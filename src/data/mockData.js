export const riskMeta = {
  monitorando: {
    label: "Monitorando",
    tone: "warning",
  },
  alerta: {
    label: "Alerta",
    tone: "accent",
  },
  emergencia: {
    label: "Emergência",
    tone: "danger",
  },
};

export const statusMeta = {
  ativo: {
    label: "Ativo",
    tone: "danger",
  },
  "em atendimento": {
    label: "Em atendimento",
    tone: "warning",
  },
  resolvido: {
    label: "Resolvido",
    tone: "success",
  },
};

export const stops = [
  {
    id: "ct",
    name: "Parada do CT",
    zone: "Centro de Tecnologia",
    coordinates: "5.8397 S, 35.2015 W",
    riskLevel: "alerta",
    activeUsers: 19,
    description:
      "Fluxo intenso no início da noite e histórico de sensação de insegurança em dias com pouca circulação.",
  },
  {
    id: "cb",
    name: "Parada da Biblioteca Central",
    zone: "Setor acadêmico central",
    coordinates: "5.8390 S, 35.2024 W",
    riskLevel: "monitorando",
    activeUsers: 12,
    description:
      "Área movimentada durante o dia, mas com trechos mais vazios no deslocamento até os estacionamentos.",
  },
  {
    id: "huol",
    name: "Parada do HUOL",
    zone: "Corredor hospitalar",
    coordinates: "5.8408 S, 35.2033 W",
    riskLevel: "emergencia",
    activeUsers: 24,
    description:
      "Usuários relataram abordagem suspeita e pouca iluminação na calçada lateral nas últimas horas.",
  },
  {
    id: "residencia",
    name: "Parada da Residência Universitária",
    zone: "Setor de moradia estudantil",
    coordinates: "5.8419 S, 35.2048 W",
    riskLevel: "monitorando",
    activeUsers: 9,
    description:
      "Parada importante no retorno noturno. O fluxo é moderado, mas a visibilidade cai após as 21h.",
  },
];

export const initialAlerts = [
  {
    id: "alert-001",
    stopId: "huol",
    stopName: "Parada do HUOL",
    author: "Segurança colaborativa",
    anonymous: false,
    message: "Relato de moto circulando repetidas vezes e usuários aguardando sozinhos.",
    createdAt: "22/04 • 18:42",
    riskLevel: "emergencia",
    status: "em atendimento",
    confirmations: 6,
  },
  {
    id: "alert-002",
    stopId: "ct",
    stopName: "Parada do CT",
    author: "Usuário anônimo",
    anonymous: true,
    message: "Pouca iluminação no ponto e grupo tentando intimidar quem estava esperando o circular.",
    createdAt: "22/04 • 18:11",
    riskLevel: "alerta",
    status: "ativo",
    confirmations: 11,
  },
  {
    id: "alert-003",
    stopId: "cb",
    stopName: "Parada da Biblioteca Central",
    author: "Equipe SafeStop",
    anonymous: false,
    message: "Trecho segue monitorado por movimentação incomum na saída lateral do estacionamento.",
    createdAt: "22/04 • 17:30",
    riskLevel: "monitorando",
    status: "resolvido",
    confirmations: 4,
  },
];

export const initialChatMessages = [
  {
    id: "chat-001",
    sender: "seguranca",
    content: "Central SafeStop online. Se precisar, compartilhe referências visuais ou direção do risco.",
    createdAt: "18:15",
  },
  {
    id: "chat-002",
    sender: "usuario",
    content: "Estou na parada do CT e a iluminação está muito baixa perto da faixa.",
    createdAt: "18:16",
  },
  {
    id: "chat-003",
    sender: "seguranca",
    content: "Recebido. Equipe de ronda já foi direcionada para esse trecho.",
    createdAt: "18:18",
  },
];

export const initialNotices = [
  {
    id: "notice-001",
    title: "Rota sugerida pela segurança",
    body: "Enquanto o atendimento ocorre no HUOL, prefira aguardar o circular pela área interna próxima ao acesso principal.",
    createdAt: "18:44",
    variant: "warning",
  },
  {
    id: "notice-002",
    title: "Totem NB-IoT sincronizado",
    body: "O totem físico do CT está recebendo alertas normalmente e reforçando a transmissão mesmo em oscilação de rede local.",
    createdAt: "18:33",
    variant: "info",
  },
  {
    id: "notice-003",
    title: "Patrulhamento concluído",
    body: "A equipe finalizou uma verificação na Biblioteca Central e o trecho voltou ao nível monitorando.",
    createdAt: "17:58",
    variant: "success",
  },
];

