"""
TESTE LOCAL: Hardware Poller Standalone

Arquivo para testar o HardwarePoller sem precisar do backend completo
Útil para validar a integração ESP32 + Backend
"""

import asyncio
import logging
import sys
from pathlib import Path

# Adiciona o diretório backend ao path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.hardware_poller import HardwarePoller

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


async def handle_emergency(payload: dict):
    """Callback chamado quando emergência é detectada"""
    logger.warning("=" * 70)
    logger.warning("🚨 EMERGÊNCIA RECEBIDA!")
    logger.warning("=" * 70)
    logger.warning(f"ID Totem: {payload.get('id_totem')}")
    logger.warning(f"Parada: {payload.get('stop_name')}")
    logger.warning(f"Latitude: {payload.get('latitude')}")
    logger.warning(f"Longitude: {payload.get('longitude')}")
    logger.warning(f"Timestamp: {payload.get('createdAt')}")
    logger.warning("=" * 70)


async def main():
    """Função principal de teste"""
    logger.info("Iniciando teste do HardwarePoller...")

    # Crie a instância do poller
    poller = HardwarePoller(
        on_emergency=handle_emergency, poll_interval=2, timeout=5
    )

    # Registre o totem ECT (MODIFIQUE O IP)
    # ⚠️  ALTERE ESTE IP PARA O IP DO SEU ESP32
    ESP32_IP = "192.168.1.100"  # ← MUDE AQUI

    logger.info(f"Tentando conectar ao ESP32 em: {ESP32_IP}")

    poller.register_totem(
        totem_id="ect",
        base_url=f"http://{ESP32_IP}",
        stop_id="ect",
        stop_name="Parada da ECT",
        latitude=-5.83917,
        longitude=-35.2007,
    )

    # Inicie o polling
    await poller.start()

    # Mostre status
    logger.info("Polling iniciado. Status:")
    logger.info(poller.get_status())

    # Aguarde polling (Ctrl+C para parar)
    try:
        logger.info("Aguardando eventos de emergência... (Pressione Ctrl+C para sair)")
        while True:
            await asyncio.sleep(5)

            # Exiba status a cada 5 segundos
            status = poller.get_status()
            if status["totems"]:
                totem = status["totems"][0]
                logger.info(
                    f"Status: {totem['id']} - "
                    f"Estado: {'🚨 EMERGÊNCIA' if totem['emergency_state'] else '✓ Normal'} - "
                    f"Falhas: {totem['poll_failures']}"
                )

    except KeyboardInterrupt:
        logger.info("Parando poller...")
        await poller.stop()
        logger.info("Teste finalizado")


if __name__ == "__main__":
    # Certifique-se de que você tem o IP do ESP32 correto
    print("\n" + "=" * 70)
    print("TESTE LOCAL - HARDWARE POLLER")
    print("=" * 70)
    print("\n⚠️  ANTES DE EXECUTAR:")
    print("   1. Verifique o IP do seu ESP32")
    print("   2. Modifique a variável ESP32_IP no código")
    print("   3. Certifique-se de que o ESP32 está online")
    print("   4. Execute este script: python backend/app/test_hardware_poller.py")
    print("\nO script fará polling do endpoint /status do ESP32")
    print("Pressione o botão do ESP32 para testar a detecção de emergência\n")
    print("=" * 70 + "\n")

    asyncio.run(main())
