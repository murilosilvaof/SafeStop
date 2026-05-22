"""
Hardware Poller Service
Faz polling periódico dos endpoints HTTP dos totens ESP32
Alternativa ao MQTT para detectar eventos de emergência
"""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime
from typing import Any, Callable, Optional

import aiohttp

logger = logging.getLogger(__name__)


class TotemConfig:
    """Configuração de um totem individual"""

    def __init__(
        self,
        totem_id: str,
        base_url: str,
        stop_id: str,
        stop_name: str,
        latitude: float,
        longitude: float,
    ):
        self.totem_id = totem_id
        self.base_url = base_url
        self.stop_id = stop_id
        self.stop_name = stop_name
        self.latitude = latitude
        self.longitude = longitude
        self.previous_state = False
        self.last_poll = None
        self.poll_failures = 0


class HardwarePoller:
    """
    Polling service para totens ESP32
    Detecta mudanças de estado de emergência e chama callback
    """

    def __init__(
        self,
        on_emergency: Callable[[dict], Any],
        poll_interval: int = 2,
        timeout: int = 5,
    ):
        """
        Inicializa o poller

        Args:
            on_emergency: Callback quando emergência é detectada
            poll_interval: Intervalo entre polls em segundos
            timeout: Timeout para requisições HTTP em segundos
        """
        self.on_emergency = on_emergency
        self.poll_interval = poll_interval
        self.timeout = timeout
        self.totems: dict[str, TotemConfig] = {}
        self.running = False
        self.task: Optional[asyncio.Task] = None

    def register_totem(
        self,
        totem_id: str,
        base_url: str,
        stop_id: str,
        stop_name: str,
        latitude: float,
        longitude: float,
    ) -> None:
        """Registra um novo totem para polling"""
        self.totems[totem_id] = TotemConfig(
            totem_id=totem_id,
            base_url=base_url,
            stop_id=stop_id,
            stop_name=stop_name,
            latitude=latitude,
            longitude=longitude,
        )
        logger.info(f"Totem registrado: {totem_id} em {base_url}")

    async def start(self) -> None:
        """Inicia o serviço de polling"""
        if self.running:
            logger.warning("Poller já está em execução")
            return

        if not self.totems:
            logger.warning("Nenhum totem registrado para polling")
            return

        self.running = True
        logger.info(f"Iniciando polling de {len(self.totems)} totem(ns)")

        self.task = asyncio.create_task(self._polling_loop())

    async def stop(self) -> None:
        """Para o serviço de polling"""
        if not self.running:
            return

        self.running = False
        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass
        logger.info("Polling parado")

    async def _polling_loop(self) -> None:
        """Loop principal de polling"""
        while self.running:
            try:
                await self._poll_all_totems()
            except Exception as e:
                logger.error(f"Erro durante polling: {e}")

            # Aguarda intervalo antes do próximo poll
            await asyncio.sleep(self.poll_interval)

    async def _poll_all_totems(self) -> None:
        """Faz polling de todos os totems registrados"""
        async with aiohttp.ClientSession() as session:
            tasks = [
                self._poll_single_totem(session, totem)
                for totem in self.totems.values()
            ]
            await asyncio.gather(*tasks, return_exceptions=True)

    async def _poll_single_totem(
        self, session: aiohttp.ClientSession, totem: TotemConfig
    ) -> None:
        """Faz polling de um totem específico"""
        try:
            status_url = f"{totem.base_url}/status"

            async with session.get(
                status_url, timeout=aiohttp.ClientTimeout(total=self.timeout)
            ) as response:
                if response.status == 200:
                    data = await response.json()

                    # Extrai estado de emergência
                    current_state = data.get("emergencia", False)

                    # Registra last_poll bem-sucedido
                    totem.last_poll = datetime.utcnow().isoformat()
                    totem.poll_failures = 0

                    # Detecta transição de falso para verdadeiro
                    if current_state and not totem.previous_state:
                        logger.info(f"🚨 EMERGÊNCIA DETECTADA: {totem.totem_id}")
                        await self._trigger_emergency_event(totem)

                    # Detecta transição de verdadeiro para falso
                    elif not current_state and totem.previous_state:
                        logger.info(f"✓ Emergência resolvida: {totem.totem_id}")

                    totem.previous_state = current_state

                else:
                    logger.warning(
                        f"Status HTTP {response.status} do totem {totem.totem_id}"
                    )
                    totem.poll_failures += 1

        except asyncio.TimeoutError:
            logger.warning(f"Timeout ao conectar ao totem {totem.totem_id}")
            totem.poll_failures += 1

        except aiohttp.ClientError as e:
            logger.warning(f"Erro de conexão ao totem {totem.totem_id}: {e}")
            totem.poll_failures += 1

        except json.JSONDecodeError:
            logger.warning(f"Resposta JSON inválida do totem {totem.totem_id}")
            totem.poll_failures += 1

    async def _trigger_emergency_event(self, totem: TotemConfig) -> None:
        """Dispara callback de emergência"""
        payload = {
            "id_totem": totem.totem_id,
            "stop_id": totem.stop_id,
            "stop_name": totem.stop_name,
            "latitude": totem.latitude,
            "longitude": totem.longitude,
            "createdAt": datetime.utcnow().isoformat(),
        }

        try:
            if asyncio.iscoroutinefunction(self.on_emergency):
                await self.on_emergency(payload)
            else:
                self.on_emergency(payload)
        except Exception as e:
            logger.error(f"Erro ao disparar callback de emergência: {e}")

    def get_status(self) -> dict[str, Any]:
        """Retorna status do poller"""
        return {
            "running": self.running,
            "poll_interval": self.poll_interval,
            "totems_registered": len(self.totems),
            "totems": [
                {
                    "id": totem.totem_id,
                    "url": totem.base_url,
                    "last_poll": totem.last_poll,
                    "poll_failures": totem.poll_failures,
                    "emergency_state": totem.previous_state,
                }
                for totem in self.totems.values()
            ],
        }
