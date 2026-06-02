from __future__ import annotations

import json
import os
from dataclasses import dataclass


def _split_csv(value: str) -> list[str]:
  return [item.strip() for item in value.split(",") if item.strip()]


def _load_totem_map() -> dict[str, dict[str, str]]:
  raw_value = os.getenv("SAFESTOP_TOTEM_MAP", "")

  if not raw_value:
    return {
      "totem-ect": {
        "stop_id": "ect",
        "stop_name": "Parada da ECT",
        "latitude": -5.83917,
        "longitude": -35.2007,
      },
      "totem-biblioteca": {
        "stop_id": "biblioteca",
        "stop_name": "Biblioteca Central",
        "latitude": -5.84252,
        "longitude": -35.19861,
      },
      "totem-ru": {
        "stop_id": "ru",
        "stop_name": "Restaurante Universitario",
        "latitude": -5.83848,
        "longitude": -35.20643,
      },
    }

  return json.loads(raw_value)


@dataclass(slots=True)
class Settings:
  host: str = os.getenv("SAFESTOP_HOST", "0.0.0.0")
  port: int = int(os.getenv("SAFESTOP_PORT", "8000"))
  base_url: str = os.getenv("SAFESTOP_BASE_URL", "https://safestop.ect.ufrn.br")
  allowed_origins: list[str] = None
  db_path: str = os.getenv("SAFESTOP_DB_PATH", "./data/safestop.db")
  mqtt_host: str = os.getenv("SAFESTOP_MQTT_HOST", "127.0.0.1")
  mqtt_port: int = int(os.getenv("SAFESTOP_MQTT_PORT", "1883"))
  mqtt_topic: str = os.getenv("SAFESTOP_MQTT_TOPIC", "ufrn/safestop/emergencia")
  mqtt_username: str = os.getenv("SAFESTOP_MQTT_USERNAME", "")
  mqtt_password: str = os.getenv("SAFESTOP_MQTT_PASSWORD", "")
  totem_map: dict[str, dict[str, str]] = None

  def __post_init__(self) -> None:
    if self.allowed_origins is None:
      self.allowed_origins = _split_csv(
        os.getenv(
          "SAFESTOP_ALLOWED_ORIGINS",
          "*,http://localhost:8083,http://127.0.0.1:8083,https://safestop.ect.ufrn.br,https://safe-stop-one.vercel.app,http://localhost:8081,http://127.0.0.1:8081,exp://127.0.0.1:8081,exp://localhost:8081",
        )
      )

    if self.totem_map is None:
      self.totem_map = _load_totem_map()
