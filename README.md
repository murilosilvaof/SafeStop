# SafeStop UFRN

Aplicativo Expo + backend Python para monitoramento de paradas da UFRN com cadastro local, chat em tempo real e integracao MQTT com o totem ESP32.

## O que esta versao entrega

- cadastro inicial com `Nome Completo`, `Matricula/Vinculo UFRN` e `Numero de Contato de Emergencia`
- persistencia local do cadastro com `@react-native-async-storage/async-storage`
- recuperacao do numero salvo na tela `Contatos`
- chat real via Socket.IO entre app e central de seguranca
- backend Python com FastAPI, Socket.IO, SQLite e painel web simples
- ponte MQTT para receber eventos do ESP32 no topico `ufrn/safestop/emergencia`
- destaque da parada em risco no mapa operacional do app

## Estrutura

- `App.js`: fluxo principal do app e gate de cadastro inicial
- `src/hooks/useSafeStopState.js`: hidratacao local, conexao Socket.IO e estado do app
- `src/screens/RegistrationScreen.js`: cadastro inicial
- `src/screens/ContactsScreen.js`: recuperacao e edicao do contato salvo localmente
- `src/components/OperationalMapCard.js`: mapa operacional com destaque do alerta de hardware
- `backend/`: servidor Python para producao

## Frontend Expo

1. Instale dependencias:
   `npm install`
2. Defina a URL do backend:
   `EXPO_PUBLIC_SAFESTOP_SOCKET_URL=https://safestop.ect.ufrn.br`
   `EXPO_PUBLIC_SAFESTOP_API_URL=https://safestop.ect.ufrn.br`
3. Rode o app:
   `npm run start`

## Backend Python

1. Entre na pasta:
   `cd backend`
2. Crie o ambiente virtual:
   `python3 -m venv .venv`
3. Ative o ambiente:
   `source .venv/bin/activate`
4. Instale dependencias:
   `pip install -r requirements.txt`
5. Copie as variaveis:
   `cp .env.example .env`
6. Suba o servidor:
   `uvicorn app.main:app --host 0.0.0.0 --port 8000`

## Deploy sugerido no Linux da UFRN

1. Publique o repositorio em `/opt/safestop`.
2. Configure o backend em `/opt/safestop/backend/.env`.
3. Crie o virtualenv e instale `backend/requirements.txt`.
4. Copie `backend/systemd/safestop.service` para `/etc/systemd/system/safestop.service`.
5. Ajuste `WorkingDirectory`, `EnvironmentFile` e `ExecStart` se necessario.
6. Rode:
   `sudo systemctl daemon-reload`
   `sudo systemctl enable safestop`
   `sudo systemctl start safestop`
7. Aponte o Nginx ou Apache para fazer proxy reverso de `https://safestop.ect.ufrn.br` para `http://127.0.0.1:8000`.

## Evento MQTT esperado

```json
{
  "id_totem": "totem-ect",
  "latitude": -5.83917,
  "longitude": -35.20070
}
```

## Fluxo em producao

1. O usuario abre o app e conclui o cadastro local.
2. O contato de emergencia fica salvo no `AsyncStorage`.
3. O app conecta no Socket.IO e envia `client:register`.
4. O backend entrega historico recente e passa a rotear chat e alertas em tempo real.
5. O ESP32 publica no broker MQTT.
6. O backend recebe o JSON, persiste o evento e emite `hardware:danger` para app e painel web.
