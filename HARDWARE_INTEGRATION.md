# 🎛️ Integração SafeStop + ESP32 Totem de Emergência

## Arquitetura do Fluxo

```
ESP32 (Totem)
    ↓
    ├─ HTTP REST (/status) 
    │  ↓
    └─ Backend Python (Polling Service)
       ↓
       ├─ MQTT Broker (Alternativa)
       │
       ├─ Socket.IO Event: hardware:danger
       │  ↓
       └─ App Mobile (Todos os usuários conectados)
```

## 📋 Configuração do ESP32

### 1️⃣ Código Arduino Recomendado

Use a **segunda versão do código** fornecida (com Bluetooth):
- ✅ Configuração dinâmica via Bluetooth
- ✅ LED indicador de status
- ✅ Debounce do botão (50ms)
- ✅ Servidor HTTP com API JSON
- ✅ Endpoint `/status` retorna: `{"local":"...", "emergencia":true/false}`

### 2️⃣ Pinagem no ESP32

```
PINO_BOTOEIRA = GPIO27  (entrada digital)
PINO_RELE     = GPIO26  (saída digital)
PINO_LED      = GPIO4   (indicador visual)
```

### 3️⃣ Configurar via Bluetooth

Conecte pelo app Bluetooth do celular e envie:

```
WIFI=AP016,Y25KGM16SIMAS
LOCAL=Parada da ECT
CONECTAR
```

O ESP32 responderá com o IP local (ex: `192.168.1.100`)

---

## 🔗 Integração Backend

### Opção A: MQTT (Recomendado - Já Implementado)

O código ESP32 pode publicar em um tópico MQTT:

```json
Tópico: "safestop/totem/ect/status"
Mensagem: {
  "id_totem": "ECT",
  "stop_id": "ect",
  "stop_name": "Parada da ECT",
  "latitude": -5.83917,
  "longitude": -35.2007,
  "emergencia": true,
  "timestamp": "2026-05-22T10:30:45Z"
}
```

**Vantagem**: Backend já tem `mqtt_bridge.py` pronto  
**Fluxo**: MQTT → `handle_hardware_event()` → Socket.IO

### Opção B: HTTP Polling (Alternativa)

Se não tiver MQTT, crie um polling service:

```python
# backend/app/hardware_poller.py
import asyncio
import aiohttp
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class HardwarePoller:
    def __init__(self, service, settings):
        self.service = service
        self.settings = settings
        self.totem_urls = {
            "ect": "http://192.168.1.100",  # IP do ESP32
        }
        self.previous_state = {}
    
    async def start(self):
        """Inicia polling periódico dos totens"""
        while True:
            await self.poll_all_totems()
            await asyncio.sleep(2)  # Poll a cada 2 segundos
    
    async def poll_all_totems(self):
        """Faz request para todos os totens"""
        async with aiohttp.ClientSession() as session:
            for totem_id, url in self.totem_urls.items():
                try:
                    await self.poll_totem(session, totem_id, url)
                except Exception as e:
                    logger.error(f"Erro ao poller {totem_id}: {e}")
    
    async def poll_totem(self, session, totem_id, url):
        """Faz request para um totem específico"""
        async with session.get(f"{url}/status", timeout=5) as resp:
            if resp.status == 200:
                data = await resp.json()
                current_state = data.get("emergencia", False)
                previous_state = self.previous_state.get(totem_id, False)
                
                # Detecta mudança de estado
                if current_state and not previous_state:
                    logger.info(f"EMERGÊNCIA DETECTADA: {totem_id}")
                    await self.service.handle_hardware_event({
                        "id_totem": totem_id,
                        "stop_id": "ect",
                        "stop_name": data.get("local", "Desconhecido"),
                        "latitude": -5.83917,
                        "longitude": -35.2007,
                        "timestamp": datetime.utcnow().isoformat()
                    })
                
                self.previous_state[totem_id] = current_state
```

### Integração no Startup

```python
# backend/app/main.py
from .hardware_poller import HardwarePoller

hardware_poller: HardwarePoller | None = None

@fastapi_app.on_event("startup")
async def on_startup() -> None:
    global mqtt_bridge, hardware_poller
    loop = asyncio.get_running_loop()
    
    # MQTT Bridge
    mqtt_bridge = MqttBridge(settings=settings, on_payload=service.handle_hardware_event, loop=loop)
    mqtt_bridge.start()
    
    # Hardware Polling (alternativa ou complemento)
    hardware_poller = HardwarePoller(service, settings)
    asyncio.create_task(hardware_poller.start())
```

---

## 📱 Integração App Mobile

### Estado Atual do App

✅ **Já implementado:**
- Listener para evento `hardware:danger` no `useSafeStopState.js`
- Notificação visual quando totem acionado
- Parada mapeada como "ECT" com coordenadas e informações

### Fluxo de Evento

```javascript
// No hook: useSafeStopState.js
socket.on("hardware:danger", (payload) => {
  const nextHardwareAlert = normalizeHardwareAlert(payload);
  setLastHardwareAlert(nextHardwareAlert);
  
  // Notifica comunidade
  setNotices((current) =>
    upsertById(
      current,
      normalizeNotice({
        title: "Totem acionado",
        body: `Sinal de emergência recebido para ${nextHardwareAlert.stopName ?? nextHardwareAlert.idTotem}.`,
        variant: "warning",
      })
    )
  );
});
```

### Visualização no App

1. **HomeScreen**: 
   - Mapa operacional mostra marcador em VERMELHO quando emergência
   - Card exibe coordenadas e timestamp do evento

2. **Chat**: 
   - Notificação automática para toda comunidade
   - Usuários podem comentar sobre o incidente

3. **Alertas**: 
   - Evento aparece no feed de ocorrências
   - Comunidade pode confirmar/validar

---

## 🔧 Configuração Prática

### Passo 1: Carregar o Código no ESP32

```bash
# Usando Arduino IDE ou VS Code + PlatformIO
# Selecione: Board = ESP32, Port = COM3 (ou seu serial)
# Compilar e Upload
```

### Passo 2: Configurar WiFi via Bluetooth

```
1. Abra app Bluetooth do celular
2. Conecte em "ESP32_EMERGENCIA"
3. Envie: WIFI=SuaRede,SuaSenha
4. Envie: LOCAL=Parada da ECT
5. Envie: CONECTAR
6. Anote o IP exibido
```

### Passo 3: Atualizar IP no Backend

Se usar polling:
```python
# backend/app/hardware_poller.py
self.totem_urls = {
    "ect": "http://192.168.X.XXX",  # IP do seu ESP32
}
```

### Passo 4: Testar

```bash
# Teste manual da API
curl http://192.168.X.XXX/status

# Resposta esperada:
# {"local":"Parada da ECT", "ip":"192.168.X.XXX", "emergencia":false}
```

---

## ⚡ Checklist de Implementação

- [ ] ESP32 com código carregado
- [ ] Botão funcionando (LED acende ao pressionar)
- [ ] WiFi conectado (LED fixo)
- [ ] Endpoint `/status` acessível no navegador
- [ ] Backend configurado (MQTT ou Polling)
- [ ] Socket.IO emitindo `hardware:danger`
- [ ] App recebendo e exibindo eventos
- [ ] Comunidade vendo alertas em tempo real

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| ESP32 não conecta WiFi | Verifique SSID/Senha, verifique distância do roteador |
| `/status` retorna erro 404 | Verifique se servidor HTTP iniciou (`servidorIniciado == true`) |
| Backend não recebe evento | Verifique IP do totem, teste com curl |
| App não mostra notificação | Verifique conexão Socket.IO, console do navegador |

---

## 📡 Estrutura do Payload de Hardware

```json
{
  "id_totem": "ECT",
  "stopId": "ect",
  "stopName": "Parada da ECT",
  "latitude": "-5.83917",
  "longitude": "-35.2007",
  "createdAt": "2026-05-22T10:30:45Z"
}
```

Normalizador no app: `normalizeHardwareAlert()` em `useSafeStopState.js`

---

## 📞 Referências

- **Código ESP32**: Fornecido (versão com Bluetooth + WiFi)
- **Backend Polling**: `hardware_poller.py` (criar)
- **App Listener**: `useSafeStopState.js` (já existe)
- **Frontend**: `OperationalMapCard.js`, `HomeScreen.js` (já integrado)
