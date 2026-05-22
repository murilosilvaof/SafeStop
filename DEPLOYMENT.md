# 🚀 Deployment SafeStop para Produção

## 📋 Credenciais do Servidor

```
Hostname: safestop.ect.ufrn.br
Porta: 22 (SSH)
Usuário: safestop
Senha: [1]ect@2026
```

---

## 🔗 Step 1: Conectar ao Servidor via SSH

### Windows (PowerShell)

```powershell
# Conectar ao servidor
ssh safestop@safestop.ect.ufrn.br

# Quando pedir senha, digite: [1]ect@2026
```

### macOS/Linux

```bash
ssh safestop@safestop.ect.ufrn.br
# Senha: [1]ect@2026
```

---

## 📁 Step 2: Explorar Estrutura do Servidor

Após conectado, execute:

```bash
# Ver diretório home
pwd

# Listar arquivos
ls -la

# Ver espaço em disco
df -h

# Ver processos rodando
ps aux | grep python

# Ver qual Python está instalado
python3 --version
pip3 --version
```

---

## 📦 Step 3: Deploy do Backend

### 3.1 Clonar ou Atualizar o Repositório

```bash
# Se for primeira vez
cd ~
git clone https://github.com/murilosilvaof/SafeStop.git
cd SafeStop

# Se já existe, atualizar
git pull origin main
```

### 3.2 Instalar Dependências

```bash
# Entrar no backend
cd backend

# Criar virtual environment (se não existir)
python3 -m venv venv

# Ativar virtual environment
source venv/bin/activate  # Linux/macOS
# ou no Windows Git Bash:
source venv/Scripts/activate

# Instalar requirements
pip install -r requirements.txt
```

### 3.3 Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env
nano .env
```

**Conteúdo do .env:**

```env
# Servidor
PORT=8000
HOST=0.0.0.0
ALLOWED_ORIGINS=https://safestop.ect.ufrn.br,http://192.168.*

# Banco de Dados
DB_PATH=/home/safestop/safestop.db

# MQTT (se usar)
MQTT_HOST=localhost
MQTT_PORT=1883
MQTT_USERNAME=safestop
MQTT_PASSWORD=safestop

# Hardware Poller
TOTEM_ECT_URL=http://192.168.1.100
TOTEM_ECT_ENABLED=true
HARDWARE_POLL_INTERVAL=2
```

Salvar: `Ctrl+O` → Enter → `Ctrl+X`

### 3.4 Testar Backend Localmente

```bash
# Rodar servidor
python3 -m uvicorn app.main:fastapi_app --host 0.0.0.0 --port 8000

# Você verá algo como:
# Uvicorn running on http://0.0.0.0:8000
```

Teste em outro terminal:

```bash
curl http://localhost:8000/health
# Deve retornar: {"status": "ok", "service": "safestop-backend"}
```

---

## 🐳 Step 4: Usar Systemd (Daemon Permanente)

### 4.1 Criar Serviço Systemd

```bash
# Copiar arquivo de serviço
sudo cp backend/systemd/safestop.service /etc/systemd/system/safestop.service

# Editar o arquivo se necessário
sudo nano /etc/systemd/system/safestop.service
```

**Arquivo `/etc/systemd/system/safestop.service` deve conter:**

```ini
[Unit]
Description=SafeStop Backend Service
After=network.target

[Service]
Type=simple
User=safestop
WorkingDirectory=/home/safestop/SafeStop/backend
Environment="PATH=/home/safestop/SafeStop/backend/venv/bin"
ExecStart=/home/safestop/SafeStop/backend/venv/bin/python3 -m uvicorn app.main:fastapi_app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 4.2 Iniciar o Serviço

```bash
# Recarregar systemd
sudo systemctl daemon-reload

# Iniciar o serviço
sudo systemctl start safestop

# Verificar status
sudo systemctl status safestop

# Ver logs
sudo journalctl -u safestop -f

# Habilitar para iniciar automaticamente
sudo systemctl enable safestop
```

---

## 🌐 Step 5: Configurar Nginx (Reverse Proxy)

### 5.1 Instalar Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 5.2 Configurar Proxy

```bash
# Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/safestop
```

**Conteúdo:**

```nginx
server {
    listen 80;
    server_name safestop.ect.ufrn.br;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io {
        proxy_pass http://localhost:8000/socket.io;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5.3 Ativar Configuração

```bash
# Criar symbolic link
sudo ln -s /etc/nginx/sites-available/safestop /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar nginx
sudo systemctl restart nginx
```

---

## 📱 Step 6: Atualizar URLs no App Mobile

Edite [src/config/runtime.js](src/config/runtime.js):

```javascript
export const SOCKET_URL =
  process.env.EXPO_PUBLIC_SAFESTOP_SOCKET_URL ?? "https://safestop.ect.ufrn.br";

export const API_URL =
  process.env.EXPO_PUBLIC_SAFESTOP_API_URL ?? "https://safestop.ect.ufrn.br";
```

Ou via variáveis de ambiente (melhor prática):

```bash
EXPO_PUBLIC_SAFESTOP_SOCKET_URL=https://safestop.ect.ufrn.br
EXPO_PUBLIC_SAFESTOP_API_URL=https://safestop.ect.ufrn.br
```

---

## 🧪 Step 7: Testar Tudo

### Backend

```bash
# Via SSH, verifique se está rodando
systemctl status safestop

# Teste a API
curl https://safestop.ect.ufrn.br/health

# Veja logs
sudo journalctl -u safestop -f
```

### App Mobile

1. Atualize o URL em `runtime.js`
2. Rebuilde o app no Expo
3. Escaneie o QR code
4. Verifique conexão na seção "Online"

---

## 📊 Monitoramento

### Ver Logs em Tempo Real

```bash
sudo journalctl -u safestop -f
```

### Verificar Recursos

```bash
# CPU e Memória
top

# Espaço em disco
df -h

# Processo Python
ps aux | grep uvicorn
```

### Reiniciar Serviço

```bash
sudo systemctl restart safestop
```

---

## 🔐 Security Checklist

- [ ] Firewall configurado (porta 22, 80, 443)
- [ ] SSH key configurada (em vez de senha)
- [ ] SSL/HTTPS habilitado
- [ ] Credenciais em `.env` (não no código)
- [ ] Backups do BD configurados
- [ ] Logs monitorados

---

## ❌ Troubleshooting

| Erro | Solução |
|------|---------|
| `Connection refused` | Verifique se serviço está rodando: `systemctl status safestop` |
| `Port 8000 in use` | `sudo lsof -i :8000` e mate o processo |
| `Permission denied` | Use `sudo` ou verifique permissões |
| `Module not found` | Ative venv: `source venv/bin/activate` |
| `Nginx 502` | Backend caiu, reinicie: `sudo systemctl restart safestop` |

---

## 📞 Comandos Rápidos

```bash
# Conectar
ssh safestop@safestop.ect.ufrn.br

# Após conectado:
cd SafeStop

# Ativar venv
source backend/venv/bin/activate

# Ver status
systemctl status safestop

# Ver logs
sudo journalctl -u safestop -f

# Sair
exit
```

---

## 🎯 Próximos Passos

1. ✅ Conectar via SSH
2. ✅ Clonar repositório
3. ✅ Instalar dependências
4. ✅ Configurar `.env`
5. ✅ Ativar systemd
6. ✅ Configurar Nginx
7. ✅ Atualizar URLs do app
8. ✅ Testar conexão

**Você está pronto para produção!** 🚀
