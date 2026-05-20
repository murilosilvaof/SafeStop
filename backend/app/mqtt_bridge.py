from __future__ import annotations

import asyncio
import json
import logging
from collections.abc import Awaitable, Callable

import paho.mqtt.client as mqtt

from .config import Settings

logger = logging.getLogger(__name__)


class MqttBridge:
  def __init__(
    self,
    settings: Settings,
    on_payload: Callable[[dict], Awaitable[None]],
    loop: asyncio.AbstractEventLoop,
  ) -> None:
    self.settings = settings
    self.on_payload = on_payload
    self.loop = loop
    self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

    if settings.mqtt_username:
      self.client.username_pw_set(settings.mqtt_username, settings.mqtt_password)

    self.client.on_connect = self._on_connect
    self.client.on_message = self._on_message

  def start(self) -> None:
    logger.info("Connecting MQTT bridge to %s:%s", self.settings.mqtt_host, self.settings.mqtt_port)
    self.client.connect_async(self.settings.mqtt_host, self.settings.mqtt_port, keepalive=60)
    self.client.loop_start()

  def stop(self) -> None:
    self.client.loop_stop()
    self.client.disconnect()

  def _on_connect(self, client: mqtt.Client, userdata, flags, reason_code, properties) -> None:
    if reason_code != 0:
      logger.error("MQTT connection failed with code %s", reason_code)
      return

    logger.info("MQTT connected. Subscribing to %s", self.settings.mqtt_topic)
    client.subscribe(self.settings.mqtt_topic, qos=1)

  def _on_message(self, client: mqtt.Client, userdata, message: mqtt.MQTTMessage) -> None:
    try:
      payload = json.loads(message.payload.decode("utf-8"))
    except json.JSONDecodeError:
      logger.exception("Invalid MQTT payload received on topic %s", message.topic)
      return

    asyncio.run_coroutine_threadsafe(self.on_payload(payload), self.loop)
