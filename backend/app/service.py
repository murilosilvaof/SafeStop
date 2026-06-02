from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timezone
from uuid import uuid4

import socketio

from .catalog import STOP_CATALOG
from .config import Settings
from .storage import SafeStopStorage


@dataclass(slots=True)
class ClientSession:
  sid: str
  user_id: str
  full_name: str
  ufrn_id: str
  emergency_contact: str
  selected_stop_id: str


def utc_now_iso() -> str:
  return datetime.now(timezone.utc).isoformat()


def sanitize_user_id(raw_value: str) -> str:
  normalized = re.sub(r"[^a-zA-Z0-9_-]", "", raw_value or "").lower()
  return normalized or f"user-{uuid4().hex[:8]}"


class SafeStopService:
  def __init__(self, sio: socketio.AsyncServer, storage: SafeStopStorage, settings: Settings) -> None:
    self.sio = sio
    self.storage = storage
    self.settings = settings
    self.sessions_by_sid: dict[str, ClientSession] = {}
    self.stop_map = {stop["id"]: stop for stop in STOP_CATALOG}

  async def register_mobile(self, sid: str, payload: dict) -> ClientSession:
    profile = payload.get("profile", {})
    user_id = sanitize_user_id(profile.get("ufrnId", ""))
    selected_stop_id = payload.get("selectedStopId") or "ect"
    session = ClientSession(
      sid=sid,
      user_id=user_id,
      full_name=profile.get("fullName", "Usuario UFRN"),
      ufrn_id=profile.get("ufrnId", ""),
      emergency_contact=profile.get("emergencyContact", ""),
      selected_stop_id=selected_stop_id,
    )
    self.sessions_by_sid[sid] = session

    await self.sio.enter_room(sid, "mobiles")
    await self.sio.enter_room(sid, f"user:{user_id}")

    bootstrap_payload = {
      "alerts": self.storage.list_recent_alerts(limit=20),
      "chatMessages": self.storage.list_chat_messages(user_id=user_id, limit=50),
      "notices": [
        {
          "id": "backend-online",
          "title": "Central SafeStop conectada",
          "body": f"Usuario {session.full_name} autenticado para atendimento em tempo real.",
          "variant": "success",
          "createdAt": utc_now_iso(),
        }
      ],
      "hardwareAlert": self.storage.get_last_hardware_event(),
      "hardwareState": self.storage.get_hardware_state(),
    }

    await self.sio.emit("bootstrap", bootstrap_payload, to=sid)
    return session

  async def update_presence(self, sid: str, payload: dict) -> None:
    session = self.sessions_by_sid.get(sid)

    if session is None:
      return

    session.selected_stop_id = payload.get("selectedStopId") or session.selected_stop_id

  async def register_dashboard(self, sid: str, payload: dict | None = None) -> None:
    await self.sio.enter_room(sid, "dashboard:security")
    await self.sio.emit(
      "dashboard:bootstrap",
      {
        "alerts": self.storage.list_recent_alerts(limit=20),
        "hardwareAlert": self.storage.get_last_hardware_event(),
      },
      to=sid,
    )

  async def send_chat_from_mobile(self, sid: str, payload: dict) -> None:
    session = self.sessions_by_sid.get(sid)
    content = (payload.get("content") or "").strip()

    if session is None or not content:
      return

    message = {
      "id": uuid4().hex,
      "roomId": f"chat:{session.user_id}",
      "userId": session.user_id,
      "sender": "usuario",
      "content": content,
      "stopId": payload.get("stopId") or session.selected_stop_id,
      "createdAt": utc_now_iso(),
      "fullName": session.full_name,
      "ufrnId": session.ufrn_id,
    }
    self.storage.save_chat_message(message)

    await self.sio.emit("chat:message", message, room=f"user:{session.user_id}")
    await self.sio.emit("chat:message", message, room="dashboard:security")

  async def send_chat_from_dashboard(self, payload: dict) -> None:
    raw_user_id = (payload.get("userId") or "").strip()
    content = (payload.get("content") or "").strip()

    if not raw_user_id or not content:
      return

    user_id = sanitize_user_id(raw_user_id)
    message = {
      "id": uuid4().hex,
      "roomId": f"chat:{user_id}",
      "userId": user_id,
      "sender": "seguranca",
      "content": content,
      "stopId": payload.get("stopId"),
      "createdAt": utc_now_iso(),
    }
    self.storage.save_chat_message(message)

    await self.sio.emit("chat:message", message, room=f"user:{user_id}")
    await self.sio.emit("chat:message", message, room="dashboard:security")

  async def create_alert(self, sid: str, payload: dict) -> None:
    session = self.sessions_by_sid.get(sid)
    message_body = (payload.get("message") or "").strip()

    if session is None or not message_body:
      return

    stop_id = payload.get("stopId") or session.selected_stop_id
    stop = self.stop_map.get(stop_id, self.stop_map["ect"])
    alert = {
      "id": uuid4().hex,
      "userId": session.user_id,
      "stopId": stop["id"],
      "stopName": stop["name"],
      "author": "Usuario anonimo" if payload.get("anonymous") else session.full_name,
      "anonymous": bool(payload.get("anonymous")),
      "message": message_body,
      "riskLevel": payload.get("riskLevel", "alerta"),
      "status": "ativo",
      "confirmations": 1,
      "createdAt": utc_now_iso(),
    }
    self.storage.save_alert(alert)

    await self.sio.emit("alert:created", alert, room="mobiles")
    await self.sio.emit("alert:created", alert, room="dashboard:security")
    await self.sio.emit(
      "notice:new",
      {
        "id": f"notice-alert-{alert['id']}",
        "title": f"Novo alerta em {stop['name']}",
        "body": alert["message"],
        "variant": "warning",
        "createdAt": utc_now_iso(),
      },
      room="mobiles",
    )

  async def confirm_alert(self, payload: dict) -> None:
    alert_id = payload.get("alertId")

    if not alert_id:
      return

    alert = self.storage.increment_alert_confirmation(alert_id)

    if alert is None:
      return

    await self.sio.emit("alert:updated", alert, room="mobiles")
    await self.sio.emit("alert:updated", alert, room="dashboard:security")

  async def handle_hardware_event(self, payload: dict) -> None:
    totem_id = payload.get("id_totem", "totem-desconhecido")
    mapped_stop = self.settings.totem_map.get(totem_id, {})
    latitude = payload.get("latitude", mapped_stop.get("latitude"))
    longitude = payload.get("longitude", mapped_stop.get("longitude"))

    if latitude is None or longitude is None:
      latitude = -5.83917
      longitude = -35.2007

    event = {
      "id": uuid4().hex,
      "idTotem": totem_id,
      "stopId": mapped_stop.get("stop_id"),
      "stopName": mapped_stop.get("stop_name", totem_id),
      "latitude": float(latitude),
      "longitude": float(longitude),
      "createdAt": utc_now_iso(),
    }
    self.storage.save_hardware_event(event)
    self.storage.set_hardware_state(
      {
        "active": True,
        "idTotem": event["idTotem"],
        "stopId": event["stopId"],
        "stopName": event["stopName"],
        "latitude": event["latitude"],
        "longitude": event["longitude"],
        "updatedAt": event["createdAt"],
      }
    )

    await self.sio.emit("hardware:danger", event, room="mobiles")
    await self.sio.emit("hardware:danger", event, room="dashboard:security")
    await self.sio.emit(
      "notice:new",
      {
        "id": f"notice-hardware-{event['id']}",
        "title": "Totem acionado em emergencia",
        "body": f"{event['stopName']} reportou perigo via hardware.",
        "variant": "warning",
        "createdAt": utc_now_iso(),
      },
      room="mobiles",
    )

  async def clear_hardware_event(self) -> None:
    current = self.storage.get_hardware_state()

    self.storage.set_hardware_state(
      {
        "active": False,
        "idTotem": current.get("idTotem"),
        "stopId": current.get("stopId"),
        "stopName": current.get("stopName"),
        "latitude": current.get("latitude"),
        "longitude": current.get("longitude"),
        "updatedAt": utc_now_iso(),
      }
    )

    await self.sio.emit(
      "hardware:reset",
      {
        "active": False,
        "updatedAt": utc_now_iso(),
      },
      room="mobiles",
    )
    await self.sio.emit(
      "hardware:reset",
      {
        "active": False,
        "updatedAt": utc_now_iso(),
      },
      room="dashboard:security",
    )
    # Enqueue a hardware RESET command so bridges can turn off indicators
    try:
      cmd = {
        "id": uuid4().hex,
        "idTotem": current.get("idTotem") or "totem-ect",
        "command": "RESET",
        "createdAt": utc_now_iso(),
      }
      self.storage.enqueue_hardware_command(cmd)
    except Exception:
      # don't let a storage issue break the reset flow
      pass

  async def disconnect(self, sid: str) -> None:
    self.sessions_by_sid.pop(sid, None)
