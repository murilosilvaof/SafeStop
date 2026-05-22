# 🔑 Primeira Conexão SSH ao Servidor

## 📋 Informações de Acesso

```
Servidor:   safestop.ect.ufrn.br
Porta:      22
Usuário:    safestop
Senha:      [1]ect@2026
```

---

## 🪟 Windows (PowerShell)

### 1️⃣ Abrir PowerShell

Pressione: `Win + X` → PowerShell

### 2️⃣ Conectar ao Servidor

```powershell
ssh safestop@safestop.ect.ufrn.br
```

### 3️⃣ Inserir Senha

```
Password: [1]ect@2026
```

✅ Você deve ver algo como:

```
safestop@safestop:~$
```

---

## 🍎 macOS / 🐧 Linux

### Terminal

```bash
ssh safestop@safestop.ect.ufrn.br
# Senha: [1]ect@2026
```

---

## 📡 Após Conectado

### Ver Estrutura do Servidor

```bash
# Mostrar diretório atual
pwd
# Resultado: /home/safestop

# Listar arquivos
ls -la

# Ver espaço em disco
df -h

# Ver processos Python
ps aux | grep python
```

### Clonar ou Atualizar SafeStop

```bash
# Se for primeira vez (NÃO execute se já existe!)
cd ~
git clone https://github.com/murilosilvaof/SafeStop.git

# Se já existe (EXECUTE ISTO):
cd ~/SafeStop
git pull origin main
```

### Verificar Status do Backend

```bash
# Ver se está rodando
systemctl status safestop

# Ver logs em tempo real
sudo journalctl -u safestop -f

# Parar de ver logs: Ctrl+C
```

### Testar Conexão

```bash
# Do servidor, testar localmente
curl http://localhost:8000/health

# Resposta esperada:
# {"status":"ok","service":"safestop-backend"}
```

---

## 🔄 Operações Comuns

### Reiniciar o Backend

```bash
sudo systemctl restart safestop
```

### Ver Logs

```bash
sudo journalctl -u safestop -f
```

### Parar Temporariamente

```bash
sudo systemctl stop safestop
```

### Iniciar

```bash
sudo systemctl start safestop
```

### Sair do Servidor

```bash
exit
```

---

## 🛠️ Troubleshooting

### Erro: "Connection refused"

**Causa**: Servidor SSH não está respondendo

**Solução:**
```bash
# Tente novamente após alguns segundos
# Verifique se está conectado à rede UFRN (VPN?)
```

### Erro: "Permission denied"

**Causa**: Senha incorreta

**Solução:**
```bash
# Verifique: [1]ect@2026
# Atenção: "@" é especial, digitalize com cuidado
```

### Backend não responde

**Causa**: Serviço pode ter caído

```bash
# Ver status
systemctl status safestop

# Se não estiver rodando:
sudo systemctl restart safestop

# Ver se iniciou corretamente:
sleep 2
systemctl status safestop
```

---

## 🔐 Próximo Passo: Configurar Chave SSH (Opcional mas Recomendado)

Depois, para não digitar senha toda vez:

```bash
# Gerar chave SSH local (em seu PC/Mac)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/safestop_key

# Copiar chave pública para servidor
ssh-copy-id -i ~/.ssh/safestop_key.pub safestop@safestop.ect.ufrn.br

# Pronto! Próximas conexões não pedirão senha:
ssh -i ~/.ssh/safestop_key safestop@safestop.ect.ufrn.br
```

---

## 📊 Estrutura do Servidor

Após clonar, você verá:

```
/home/safestop/
├── SafeStop/
│   ├── backend/
│   │   ├── app/
│   │   ├── requirements.txt
│   │   ├── venv/
│   │   └── systemd/
│   │       └── safestop.service
│   ├── src/
│   ├── .git/
│   └── ...
└── safestop.db  (banco de dados)
```

---

## ✅ Checklist

- [ ] Conectado via SSH
- [ ] Repositório clonado/atualizado
- [ ] Backend respondendo (curl /health)
- [ ] Logs visíveis (sudo journalctl -u safestop -f)
- [ ] URLs do app apontando para `https://safestop.ect.ufrn.br`

**Pronto para produção!** 🚀
