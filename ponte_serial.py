import argparse
import json
import os
import sys
import time
from urllib import error, request

import serial


DEFAULT_PORT = "COM3"
DEFAULT_BAUDRATE = 115200
DEFAULT_API_URL = os.getenv("SAFE_STOP_API_URL", "https://safestop.ect.ufrn.br")


def post_event(api_url: str, endpoint_path: str, payload: dict) -> bool:
    endpoint = f"{api_url.rstrip('/')}{endpoint_path}"
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(
        endpoint,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=10) as response:
            print(f"[bridge] POST OK -> {response.status}")
        return True
    except error.URLError as exc:
        print(f"[bridge] POST failed: {exc}", file=sys.stderr)
        return False


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Bridge USB Serial do ESP32 para o backend SafeStop."
    )
    parser.add_argument("--port", default=DEFAULT_PORT, help="Porta serial, ex: COM3")
    parser.add_argument("--baudrate", type=int, default=DEFAULT_BAUDRATE)
    parser.add_argument(
        "--api-url",
        default=DEFAULT_API_URL,
        help="URL do backend SafeStop, ex: http://localhost:8000",
    )
    parser.add_argument("--totem-id", default="totem-ect")
    parser.add_argument("--stop-id", default="ect")
    parser.add_argument("--stop-name", default="Parada da ECT")
    args = parser.parse_args()

    print(f"[bridge] Opening {args.port} at {args.baudrate} baud")
    print(f"[bridge] Target API: {args.api_url}")

    try:
        ser = serial.Serial(args.port, args.baudrate, timeout=1)
    except serial.SerialException as exc:
        print(f"[bridge] Could not open serial port: {exc}", file=sys.stderr)
        return 1

    time.sleep(2)
    ser.reset_input_buffer()

    last_alert_ts = 0.0
    cooldown_seconds = 1.0
    last_command_check = 0.0
    command_check_interval = 1.0

    try:
        while True:
            try:
                raw = ser.readline()
            except serial.SerialException as exc:
                print(f"[bridge] Serial error while reading: {exc}", file=sys.stderr)
                try:
                    ser.close()
                except Exception:
                    pass

                # Try to reconnect in a loop until successful or interrupted
                while True:
                    try:
                        print(f"[bridge] Attempting to reopen {args.port}...")
                        ser = serial.Serial(args.port, args.baudrate, timeout=1)
                        time.sleep(2)
                        ser.reset_input_buffer()
                        print(f"[bridge] Reopened {args.port}")
                        break
                    except serial.SerialException as exc2:
                        print(f"[bridge] Reopen failed: {exc2}. Retrying in 2s...", file=sys.stderr)
                        time.sleep(2)
                continue

            # Periodically check for pending commands from backend
            now = time.time()
            if now - last_command_check >= command_check_interval:
                last_command_check = now
                try:
                    cmd_url = f"{args.api_url.rstrip('/')}/api/hardware/commands?totem_id={args.totem_id}"
                    with request.urlopen(cmd_url, timeout=2) as resp:
                        body = resp.read().decode('utf-8')
                        data = json.loads(body or "{}")
                        for cmd in data.get("commands", []):
                            command = (cmd.get("command") or "").upper()
                            if command == "RESET":
                                try:
                                    ser.write(b"RESET\n")
                                    print(f"[bridge] WROTE RESET to serial for {args.totem_id}")
                                    # ack the command
                                    ack_url = f"{args.api_url.rstrip('/')}/api/hardware/commands/{cmd.get('id')}/ack"
                                    req = request.Request(ack_url, data=b"{}", headers={"Content-Type": "application/json"}, method="POST")
                                    try:
                                        with request.urlopen(req, timeout=2) as _:
                                            pass
                                    except Exception:
                                        pass
                                except Exception as exc:
                                    print(f"[bridge] Could not write RESET to serial: {exc}", file=sys.stderr)
                except Exception:
                    pass

            if not raw:
                continue

            line = raw.decode("utf-8", errors="ignore").strip()
            if not line:
                continue

            print(f"[bridge] RX: {line}")

            norm = line.upper()

            if "ALERTA" in norm or "EMERGENCI" in norm:
                now = time.time()
                if now - last_alert_ts < cooldown_seconds:
                    continue

                payload = {
                    "id_totem": args.totem_id,
                    "stop_id": args.stop_id,
                    "stop_name": args.stop_name,
                }

                if post_event(args.api_url, "/api/hardware/serial-alert", payload):
                    last_alert_ts = now
            elif "RESET" in norm or "DESARM" in norm:
                payload = {
                    "id_totem": args.totem_id,
                    "stop_id": args.stop_id,
                    "stop_name": args.stop_name,
                }

                post_event(args.api_url, "/api/hardware/reset", payload)
    except KeyboardInterrupt:
        print("\n[bridge] Stopped by user")
    finally:
        try:
            ser.close()
        except Exception:
            pass

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
