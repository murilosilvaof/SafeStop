# SafeStop Backend

Backend oficial para o app Expo do SafeStop UFRN.

## Stack

- FastAPI para endpoints HTTP e dashboard
- Python Socket.IO para chat em tempo real
- SQLite para persistir mensagens, alertas e eventos de hardware
- Paho MQTT para consumir `ufrn/safestop/emergencia`

## Estrutura

- `app/main.py`: ponto de entrada ASGI
- `app/service.py`: regras de negocio e distribuicao dos eventos
- `app/storage.py`: persistencia SQLite
- `app/mqtt_bridge.py`: escuta o broker MQTT do servidor
- `app/static/dashboard.html`: painel web simples para a central de seguranca
- `systemd/safestop.service`: unidade sugerida para producao

## Execucao local

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Eventos Socket.IO

- `client:register`
- `presence:update`
- `chat:send`
- `alert:create`
- `alert:confirm`
- `dashboard:join`
- `dashboard:send-message`

## Payload MQTT esperado

```json
{
  "id_totem": "totem-ect",
  "latitude": -5.83917,
  "longitude": -35.20070
}
```
