"""
EXEMPLO DE INTEGRAÇÃO: Hardware Poller no Backend SafeStop

Este arquivo mostra como integrar o HardwarePoller ao main.py
Descomente as linhas relevantes no seu main.py para ativar
"""

# ============================================================================
# 1. IMPORTS NO main.py
# ============================================================================

# Adicione esta linha:
from .hardware_poller import HardwarePoller

# ============================================================================
# 2. VARIÁVEL GLOBAL
# ============================================================================

# Adicione esta variável global (junto com mqtt_bridge):
hardware_poller: HardwarePoller | None = None

# ============================================================================
# 3. STARTUP EVENT
# ============================================================================

# Modifique o @fastapi_app.on_event("startup") assim:

"""
@fastapi_app.on_event("startup")
async def on_startup() -> None:
  global mqtt_bridge, hardware_poller
  
  loop = asyncio.get_running_loop()
  
  # MQTT Bridge (existente)
  mqtt_bridge = MqttBridge(
    settings=settings,
    on_payload=service.handle_hardware_event,
    loop=loop
  )
  mqtt_bridge.start()
  
  # Hardware Poller (novo - comentado por padrão)
  # Descomente para usar polling HTTP em vez de/junto com MQTT
  # hardware_poller = HardwarePoller(
  #   on_emergency=service.handle_hardware_event,
  #   poll_interval=2,  # Poll a cada 2 segundos
  #   timeout=5,  # Timeout de 5 segundos por requisição
  # )
  
  # Registre cada totem ECT
  # hardware_poller.register_totem(
  #   totem_id="ect",
  #   base_url="http://192.168.1.100",  # IP DO SEU ESP32
  #   stop_id="ect",
  #   stop_name="Parada da ECT",
  #   latitude=-5.83917,
  #   longitude=-35.2007,
  # )
  
  # Inicie o poller
  # await hardware_poller.start()
"""

# ============================================================================
# 4. SHUTDOWN EVENT
# ============================================================================

# Modifique o @fastapi_app.on_event("shutdown") assim:

"""
@fastapi_app.on_event("shutdown")
async def on_shutdown() -> None:
  global mqtt_bridge, hardware_poller
  
  # Stop MQTT Bridge
  if mqtt_bridge is not None:
    mqtt_bridge.stop()
  
  # Stop Hardware Poller
  if hardware_poller is not None:
    await hardware_poller.stop()
"""

# ============================================================================
# 5. ENDPOINT OPCIONAL: Status do Poller
# ============================================================================

# Adicione este endpoint para monitorar o poller:

"""
@fastapi_app.get("/api/hardware-poller/status")
async def get_poller_status() -> JSONResponse:
  if hardware_poller is None:
    return JSONResponse(
      {
        "error": "Hardware poller not configured",
        "status": "disabled"
      },
      status_code=404
    )
  
  return JSONResponse(hardware_poller.get_status())
"""

# ============================================================================
# PASSO A PASSO DE INTEGRAÇÃO
# ============================================================================

"""
1. Copie o arquivo hardware_poller.py para backend/app/

2. No backend/app/main.py, adicione o import:
   from .hardware_poller import HardwarePoller

3. Adicione a variável global:
   hardware_poller: HardwarePoller | None = None

4. No startup event, descomente e configure:
   - Crie a instância do HardwarePoller
   - Registre cada totem com seu IP
   - Chame await hardware_poller.start()

5. No shutdown event, adicione:
   - await hardware_poller.stop()

6. Teste com curl:
   curl http://localhost:8000/api/hardware-poller/status

7. Pressione o botão do ESP32 e veja se o evento chega ao app
"""

# ============================================================================
# CONFIGURAÇÃO COM AMBIENTE
# ============================================================================

"""
Para ambiente de produção, use variáveis de ambiente:

Em .env:
TOTEM_ECT_URL=http://192.168.1.100
TOTEM_ECT_ENABLED=true
HARDWARE_POLL_INTERVAL=2

No code:
import os

totem_ect_url = os.getenv("TOTEM_ECT_URL")
totem_ect_enabled = os.getenv("TOTEM_ECT_ENABLED", "false").lower() == "true"
poll_interval = int(os.getenv("HARDWARE_POLL_INTERVAL", "2"))

if totem_ect_enabled:
    hardware_poller = HardwarePoller(
        on_emergency=service.handle_hardware_event,
        poll_interval=poll_interval
    )
    hardware_poller.register_totem(
        totem_id="ect",
        base_url=totem_ect_url,
        stop_id="ect",
        stop_name="Parada da ECT",
        latitude=-5.83917,
        longitude=-35.2007,
    )
    await hardware_poller.start()
"""

# ============================================================================
# DEBUGGING
# ============================================================================

"""
Para ver logs detalhados durante testes:

# Em qualquer lugar do backend:
logger.info(f"Debug: {hardware_poller.get_status()}")

# Ou por HTTP:
curl http://localhost:8000/api/hardware-poller/status | jq .

Output esperado:
{
  "running": true,
  "poll_interval": 2,
  "totems_registered": 1,
  "totems": [
    {
      "id": "ect",
      "url": "http://192.168.1.100",
      "last_poll": "2026-05-22T10:30:45.123456",
      "poll_failures": 0,
      "emergency_state": false
    }
  ]
}
"""
