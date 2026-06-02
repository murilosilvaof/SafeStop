import argparse
import json
import sys
import time
from urllib import error, request

import serial


DEFAULT_PORT = "COM3"
DEFAULT_BAUDRATE = 115200
DEFAULT_ENDPOINT = "http://127.0.0.1:3001/api/emergency/activate"


def post_alert(endpoint: str) -> bool:
    payload = json.dumps({"source": "esp32", "event": "ALERTA"}).encode("utf-8")
    req = request.Request(
        endpoint,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=5) as response:
            print(f"[bridge] POST OK -> {response.status}")
        return True
    except error.URLError as exc:
        print(f"[bridge] POST failed: {exc}", file=sys.stderr)
        return False


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Serial bridge from ESP32 ALERTA messages to local HTTP endpoint."
    )
    parser.add_argument("--port", default=DEFAULT_PORT, help="Serial port, ex: COM3")
    parser.add_argument("--baudrate", type=int, default=DEFAULT_BAUDRATE)
    parser.add_argument(
        "--endpoint",
        default=DEFAULT_ENDPOINT,
        help="Local HTTP endpoint that receives the emergency trigger",
    )
    args = parser.parse_args()

    print(f"[bridge] Opening {args.port} at {args.baudrate} baud")
    print(f"[bridge] Target endpoint: {args.endpoint}")

    try:
        ser = serial.Serial(args.port, args.baudrate, timeout=1)
    except serial.SerialException as exc:
        print(f"[bridge] Could not open serial port: {exc}", file=sys.stderr)
        return 1

    # Give the ESP32 a moment to reset when the port opens.
    time.sleep(2)
    ser.reset_input_buffer()

    last_alert_ts = 0.0
    cooldown_seconds = 1.0

    try:
        while True:
            raw = ser.readline()
            if not raw:
                continue

            line = raw.decode("utf-8", errors="ignore").strip()
            if not line:
                continue

            print(f"[bridge] RX: {line}")

            if line == "ALERTA":
                now = time.time()
                if now - last_alert_ts < cooldown_seconds:
                    continue

                if post_alert(args.endpoint):
                    last_alert_ts = now
    except KeyboardInterrupt:
        print("\n[bridge] Stopped by user")
    finally:
        ser.close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
