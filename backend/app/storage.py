from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Any


class SafeStopStorage:
  def __init__(self, db_path: str) -> None:
    self.db_path = Path(db_path)
    self.db_path.parent.mkdir(parents=True, exist_ok=True)
    self._initialize()

  def _connect(self) -> sqlite3.Connection:
    connection = sqlite3.connect(self.db_path)
    connection.row_factory = sqlite3.Row
    return connection

  def _initialize(self) -> None:
    with self._connect() as connection:
      connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS chat_messages (
          id TEXT PRIMARY KEY,
          room_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          sender TEXT NOT NULL,
          content TEXT NOT NULL,
          stop_id TEXT,
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS alerts (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          stop_id TEXT NOT NULL,
          stop_name TEXT NOT NULL,
          author TEXT NOT NULL,
          anonymous INTEGER NOT NULL DEFAULT 0,
          message TEXT NOT NULL,
          risk_level TEXT NOT NULL,
          status TEXT NOT NULL,
          confirmations INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS hardware_events (
          id TEXT PRIMARY KEY,
          id_totem TEXT NOT NULL,
          stop_id TEXT,
          stop_name TEXT,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS hardware_state (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          active INTEGER NOT NULL DEFAULT 0,
          id_totem TEXT,
          stop_id TEXT,
          stop_name TEXT,
          latitude REAL,
          longitude REAL,
          updated_at TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS hardware_commands (
          id TEXT PRIMARY KEY,
          id_totem TEXT NOT NULL,
          command TEXT NOT NULL,
          created_at TEXT NOT NULL,
          processed INTEGER NOT NULL DEFAULT 0
        );
        """
      )

  def save_chat_message(self, payload: dict[str, Any]) -> None:
    with self._connect() as connection:
      connection.execute(
        """
        INSERT INTO chat_messages (
          id, room_id, user_id, sender, content, stop_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
          payload["id"],
          payload["roomId"],
          payload["userId"],
          payload["sender"],
          payload["content"],
          payload.get("stopId"),
          payload["createdAt"],
        ),
      )

  def list_chat_messages(self, user_id: str, limit: int = 50) -> list[dict[str, Any]]:
    with self._connect() as connection:
      rows = connection.execute(
        """
        SELECT id, room_id, user_id, sender, content, stop_id, created_at
        FROM chat_messages
        WHERE user_id = ?
        ORDER BY datetime(created_at) ASC
        LIMIT ?
        """,
        (user_id, limit),
      ).fetchall()

    return [
      {
        "id": row["id"],
        "roomId": row["room_id"],
        "userId": row["user_id"],
        "sender": row["sender"],
        "content": row["content"],
        "stopId": row["stop_id"],
        "createdAt": row["created_at"],
      }
      for row in rows
    ]

  def save_alert(self, payload: dict[str, Any]) -> None:
    with self._connect() as connection:
      connection.execute(
        """
        INSERT INTO alerts (
          id, user_id, stop_id, stop_name, author, anonymous, message,
          risk_level, status, confirmations, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
          payload["id"],
          payload["userId"],
          payload["stopId"],
          payload["stopName"],
          payload["author"],
          1 if payload.get("anonymous") else 0,
          payload["message"],
          payload["riskLevel"],
          payload["status"],
          payload["confirmations"],
          payload["createdAt"],
        ),
      )

  def list_recent_alerts(self, limit: int = 20) -> list[dict[str, Any]]:
    with self._connect() as connection:
      rows = connection.execute(
        """
        SELECT id, user_id, stop_id, stop_name, author, anonymous, message,
               risk_level, status, confirmations, created_at
        FROM alerts
        ORDER BY datetime(created_at) DESC
        LIMIT ?
        """,
        (limit,),
      ).fetchall()

    return [self._alert_row_to_dict(row) for row in rows]

  def increment_alert_confirmation(self, alert_id: str) -> dict[str, Any] | None:
    with self._connect() as connection:
      connection.execute(
        """
        UPDATE alerts
        SET confirmations = confirmations + 1
        WHERE id = ?
        """,
        (alert_id,),
      )
      row = connection.execute(
        """
        SELECT id, user_id, stop_id, stop_name, author, anonymous, message,
               risk_level, status, confirmations, created_at
        FROM alerts
        WHERE id = ?
        """,
        (alert_id,),
      ).fetchone()

    if row is None:
      return None

    return self._alert_row_to_dict(row)

  def save_hardware_event(self, payload: dict[str, Any]) -> None:
    with self._connect() as connection:
      connection.execute(
        """
        INSERT INTO hardware_events (
          id, id_totem, stop_id, stop_name, latitude, longitude, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
          payload["id"],
          payload["idTotem"],
          payload.get("stopId"),
          payload.get("stopName"),
          payload["latitude"],
          payload["longitude"],
          payload["createdAt"],
        ),
      )

  def get_last_hardware_event(self) -> dict[str, Any] | None:
    with self._connect() as connection:
      row = connection.execute(
        """
        SELECT id, id_totem, stop_id, stop_name, latitude, longitude, created_at
        FROM hardware_events
        ORDER BY datetime(created_at) DESC
        LIMIT 1
        """
      ).fetchone()

    if row is None:
      return None

    return {
      "id": row["id"],
      "idTotem": row["id_totem"],
      "stopId": row["stop_id"],
      "stopName": row["stop_name"],
      "latitude": row["latitude"],
      "longitude": row["longitude"],
      "createdAt": row["created_at"],
    }

  def set_hardware_state(self, payload: dict[str, Any]) -> None:
    with self._connect() as connection:
      connection.execute(
        """
        INSERT INTO hardware_state (
          id, active, id_totem, stop_id, stop_name, latitude, longitude, updated_at
        ) VALUES (
          1, ?, ?, ?, ?, ?, ?, ?
        )
        ON CONFLICT(id) DO UPDATE SET
          active = excluded.active,
          id_totem = excluded.id_totem,
          stop_id = excluded.stop_id,
          stop_name = excluded.stop_name,
          latitude = excluded.latitude,
          longitude = excluded.longitude,
          updated_at = excluded.updated_at
        """,
        (
          1 if payload.get("active") else 0,
          payload.get("idTotem"),
          payload.get("stopId"),
          payload.get("stopName"),
          payload.get("latitude"),
          payload.get("longitude"),
          payload["updatedAt"],
        ),
      )

  def enqueue_hardware_command(self, payload: dict[str, Any]) -> None:
    with self._connect() as connection:
      connection.execute(
        """
        INSERT INTO hardware_commands (
          id, id_totem, command, created_at, processed
        ) VALUES (?, ?, ?, ?, 0)
        """,
        (
          payload["id"],
          payload["idTotem"],
          payload["command"],
          payload["createdAt"],
        ),
      )

  def fetch_pending_commands(self, id_totem: str) -> list[dict[str, Any]]:
    with self._connect() as connection:
      rows = connection.execute(
        """
        SELECT id, id_totem, command, created_at
        FROM hardware_commands
        WHERE id_totem = ? AND processed = 0
        ORDER BY datetime(created_at) ASC
        """,
        (id_totem,),
      ).fetchall()

    return [
      {
        "id": row["id"],
        "idTotem": row["id_totem"],
        "command": row["command"],
        "createdAt": row["created_at"],
      }
      for row in rows
    ]

  def mark_command_processed(self, cmd_id: str) -> None:
    with self._connect() as connection:
      connection.execute(
        """
        UPDATE hardware_commands
        SET processed = 1
        WHERE id = ?
        """,
        (cmd_id,)
      )

  def get_hardware_state(self) -> dict[str, Any]:
    with self._connect() as connection:
      row = connection.execute(
        """
        SELECT active, id_totem, stop_id, stop_name, latitude, longitude, updated_at
        FROM hardware_state
        WHERE id = 1
        """
      ).fetchone()

    if row is None:
      return {
        "active": False,
        "idTotem": None,
        "stopId": None,
        "stopName": None,
        "latitude": None,
        "longitude": None,
        "updatedAt": None,
      }

    return {
      "active": bool(row["active"]),
      "idTotem": row["id_totem"],
      "stopId": row["stop_id"],
      "stopName": row["stop_name"],
      "latitude": row["latitude"],
      "longitude": row["longitude"],
      "updatedAt": row["updated_at"],
    }

  def _alert_row_to_dict(self, row: sqlite3.Row) -> dict[str, Any]:
    return {
      "id": row["id"],
      "userId": row["user_id"],
      "stopId": row["stop_id"],
      "stopName": row["stop_name"],
      "author": row["author"],
      "anonymous": bool(row["anonymous"]),
      "message": row["message"],
      "riskLevel": row["risk_level"],
      "status": row["status"],
      "confirmations": row["confirmations"],
      "createdAt": row["created_at"],
    }
