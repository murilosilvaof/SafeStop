#!/bin/bash

# ============================================================================
# SafeStop Automated Deployment Script
# 
# Uso: bash deploy.sh
# 
# Este script faz deploy automatizado do backend para safestop.ect.ufrn.br
# ============================================================================

set -e  # Exit on error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações
REMOTE_USER="safestop"
REMOTE_HOST="safestop.ect.ufrn.br"
REMOTE_PATH="/home/safestop/SafeStop"
LOCAL_PATH="$(pwd)"

echo -e "${YELLOW}=== SafeStop Deployment Script ===${NC}"
echo ""

# ============================================================================
# 1. Verificar repositório local
# ============================================================================

echo -e "${YELLOW}[1/6] Verificando repositório local...${NC}"

if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ Há mudanças não commitadas!${NC}"
    echo "Execute: git add . && git commit -m 'mensagem'"
    exit 1
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT=$(git rev-parse --short HEAD)
echo -e "${GREEN}✓ Branch: $BRANCH | Commit: $COMMIT${NC}"

# ============================================================================
# 2. Fazer push para repositório
# ============================================================================

echo -e "${YELLOW}[2/6] Fazendo push para GitHub...${NC}"

git push origin $BRANCH
echo -e "${GREEN}✓ Push realizado${NC}"

# ============================================================================
# 3. Conectar ao servidor e atualizar código
# ============================================================================

echo -e "${YELLOW}[3/6] Conectando ao servidor e atualizando código...${NC}"

ssh $REMOTE_USER@$REMOTE_HOST << 'EOF'
    cd /home/safestop/SafeStop
    
    # Fazer pull do repositório
    git fetch origin
    git checkout main
    git pull origin main
    
    # Verificar se requirements mudou
    if ! diff requirements.txt backend/requirements.txt &>/dev/null; then
        echo "requirements.txt foi atualizado, instalando dependências..."
        cd backend
        source venv/bin/activate
        pip install -r requirements.txt
        cd ..
    fi
    
    echo "✓ Código atualizado"
EOF

echo -e "${GREEN}✓ Código no servidor atualizado${NC}"

# ============================================================================
# 4. Reiniciar serviço
# ============================================================================

echo -e "${YELLOW}[4/6] Reiniciando serviço...${NC}"

ssh $REMOTE_USER@$REMOTE_HOST << 'EOF'
    sudo systemctl restart safestop
    sleep 2
    sudo systemctl status safestop --no-pager
EOF

echo -e "${GREEN}✓ Serviço reiniciado${NC}"

# ============================================================================
# 5. Testar health check
# ============================================================================

echo -e "${YELLOW}[5/6] Testando health check...${NC}"

sleep 2

if curl -s https://safestop.ect.ufrn.br/health | grep -q "ok"; then
    echo -e "${GREEN}✓ Health check OK${NC}"
else
    echo -e "${RED}❌ Health check falhou!${NC}"
    echo "Verifique os logs: ssh safestop@safestop.ect.ufrn.br"
    echo "Comando: sudo journalctl -u safestop -f"
    exit 1
fi

# ============================================================================
# 6. Ver logs recentes
# ============================================================================

echo -e "${YELLOW}[6/6] Logs recentes...${NC}"

ssh $REMOTE_USER@$REMOTE_HOST << 'EOF'
    echo "Últimas 10 linhas de log:"
    sudo journalctl -u safestop -n 10 --no-pager
EOF

echo -e "${GREEN}✓ Deploy concluído!${NC}"
echo ""
echo -e "${GREEN}=== Deployment Successful ===${NC}"
echo ""
echo "Servidor: https://safestop.ect.ufrn.br"
echo "Dashboard: https://safestop.ect.ufrn.br/dashboard"
echo "Health: https://safestop.ect.ufrn.br/health"
