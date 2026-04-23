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
    label: "Emergencia",
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
    id: "ect",
    name: "Parada da ECT",
    zone: "Escola de Ciencias e Tecnologia",
    coordinates: "Campus central da UFRN",
    riskLevel: "alerta",
    activeUsers: 27,
    description:
      "Parada piloto do SafeStop, usada para validar o alerta comunitario e o repasse rapido para a seguranca patrimonial.",
    routeName: "Circular UFRN",
    routeDirection: "Sentido eixo central e RU",
    nextArrivals: ["3 min", "11 min", "19 min"],
    recommendedWaitArea:
      "Aguarde no abrigo central iluminado, com visao para a faixa interna da ECT e fluxo de estudantes.",
    patrolEta: "4 min",
    patrolWindow: "Ronda posicionada entre a ECT, o setor de aulas e o corredor do circular.",
    safetyWindow: "Monitoramento reforcado das 17h40 as 22h00.",
    totemStatus: "Totem piloto online e replicando alertas para a equipe patrimonial.",
    heroCaption: "Entrada principal da ECT e area de embarque do circular",
  },
];

export const initialAlerts = [
  {
    id: "alert-001",
    stopId: "ect",
    stopName: "Parada da ECT",
    author: "Rede SafeStop",
    anonymous: false,
    message:
      "Grupo observando quem aguardava o circular no lado externo da parada. Fluxo reduzido na ultima volta.",
    createdAt: "22/04 | 18:42",
    riskLevel: "alerta",
    status: "em atendimento",
    confirmations: 8,
  },
  {
    id: "alert-002",
    stopId: "ect",
    stopName: "Parada da ECT",
    author: "Usuario anonimo",
    anonymous: true,
    message:
      "Iluminacao lateral baixa e duas pessoas circulando varias vezes perto do embarque.",
    createdAt: "22/04 | 18:11",
    riskLevel: "emergencia",
    status: "ativo",
    confirmations: 13,
  },
];

export const initialChatMessages = [
  {
    id: "chat-001",
    sender: "seguranca",
    content: "Central SafeStop online na ECT. Compartilhe o ponto exato da parada e a direcao do risco.",
    createdAt: "18:15",
  },
  {
    id: "chat-002",
    sender: "usuario",
    content: "Estou no abrigo principal da ECT. O lado externo da parada esta com pouca visibilidade.",
    createdAt: "18:16",
  },
  {
    id: "chat-003",
    sender: "seguranca",
    content: "Recebido. A ronda foi deslocada pelo corredor central e chega em poucos minutos.",
    createdAt: "18:18",
  },
];

export const initialNotices = [
  {
    id: "notice-001",
    title: "Posicionamento recomendado",
    body: "Enquanto a equipe se desloca, prefira aguardar o circular no abrigo central da ECT, perto do fluxo principal.",
    createdAt: "18:44",
    variant: "warning",
  },
  {
    id: "notice-002",
    title: "Totem piloto sincronizado",
    body: "O totem da ECT esta online e espelhando alertas para a equipe patrimonial e para usuarios proximos.",
    createdAt: "18:33",
    variant: "info",
  },
  {
    id: "notice-003",
    title: "Cobertura reforcada no pico",
    body: "Entre 17h40 e 22h00 a parada da ECT fica priorizada no piloto por concentrar maior volume de embarque noturno.",
    createdAt: "17:58",
    variant: "success",
  },
];
