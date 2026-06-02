from __future__ import annotations

import asyncio
from pathlib import Path

import socketio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse

from .catalog import STOP_CATALOG
from .config import Settings
from .mqtt_bridge import MqttBridge
from .service import SafeStopService
from .storage import SafeStopStorage

settings = Settings()
storage = SafeStopStorage(settings.db_path)
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=settings.allowed_origins)
service = SafeStopService(sio=sio, storage=storage, settings=settings)
fastapi_app = FastAPI(title="SafeStop Backend", version="1.0.0")
dashboard_path = Path(__file__).with_name("static").joinpath("dashboard.html")
mqtt_bridge: MqttBridge | None = None

fastapi_app.add_middleware(
  CORSMiddleware,
  allow_origins=settings.allowed_origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@fastapi_app.on_event("startup")
async def on_startup() -> None:
  global mqtt_bridge
  loop = asyncio.get_running_loop()
  mqtt_bridge = MqttBridge(settings=settings, on_payload=service.handle_hardware_event, loop=loop)
  mqtt_bridge.start()


@fastapi_app.on_event("shutdown")
async def on_shutdown() -> None:
  if mqtt_bridge is not None:
    mqtt_bridge.stop()


@fastapi_app.get("/health")
async def healthcheck() -> JSONResponse:
  return JSONResponse({"status": "ok", "service": "safestop-backend"})


@fastapi_app.get("/api/stops")
async def list_stops() -> JSONResponse:
  return JSONResponse({"stops": STOP_CATALOG})


@fastapi_app.get("/api/hardware/state")
async def hardware_state() -> JSONResponse:
  return JSONResponse(service.storage.get_hardware_state())


@fastapi_app.post("/api/hardware/serial-alert")
async def hardware_serial_alert(payload: dict | None = None) -> JSONResponse:
  next_payload = payload or {}
  next_payload.setdefault("id_totem", "totem-ect")
  await service.handle_hardware_event(next_payload)
  return JSONResponse({"ok": True, "active": True})


@fastapi_app.post("/api/hardware/reset")
async def hardware_reset() -> JSONResponse:
  await service.clear_hardware_event()
  return JSONResponse({"ok": True, "active": False})


@fastapi_app.get("/api/hardware/commands")
async def hardware_commands(totem_id: str | None = None) -> JSONResponse:
  if not totem_id:
    return JSONResponse({"commands": []})

  cmds = service.storage.fetch_pending_commands(totem_id)
  return JSONResponse({"commands": cmds})


@fastapi_app.post("/api/hardware/commands/{cmd_id}/ack")
async def hardware_command_ack(cmd_id: str) -> JSONResponse:
  service.storage.mark_command_processed(cmd_id)
  return JSONResponse({"ok": True})


@fastapi_app.get("/dashboard", response_class=HTMLResponse)
async def dashboard() -> HTMLResponse:
  return HTMLResponse(dashboard_path.read_text(encoding="utf-8"))


@fastapi_app.get("/")
async def root() -> JSONResponse:
  return JSONResponse(
    {
      "service": "SafeStop Backend",
      "health": "/health",
      "dashboard": "/dashboard",
      "socketio": "/socket.io/",
    }
  )


@sio.event
async def connect(sid, environ, auth):
  return True


@sio.event
async def disconnect(sid):
  await service.disconnect(sid)


@sio.on("client:register")
async def client_register(sid, payload):
  await service.register_mobile(sid, payload or {})


@sio.on("presence:update")
async def presence_update(sid, payload):
  await service.update_presence(sid, payload or {})


@sio.on("chat:send")
async def chat_send(sid, payload):
  await service.send_chat_from_mobile(sid, payload or {})


@sio.on("alert:create")
async def alert_create(sid, payload):
  await service.create_alert(sid, payload or {})


@sio.on("alert:confirm")
async def alert_confirm(sid, payload):
  await service.confirm_alert(payload or {})


@sio.on("dashboard:join")
async def dashboard_join(sid, payload):
  await service.register_dashboard(sid, payload or {})


@sio.on("dashboard:send-message")
async def dashboard_send_message(sid, payload):
  await service.send_chat_from_dashboard(payload or {})


app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)


if __name__ == "__main__":
  uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=False)
