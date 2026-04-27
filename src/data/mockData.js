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
    platformCode: "ECT-01",
    operatingWindow: "05:40 as 22:30",
    boardingTip: "Priorize o abrigo principal e mantenha o app aberto no horario de pico noturno.",
    scheduleByPeriod: {
      manha: ["06:00", "06:20", "06:40", "07:00", "07:20"],
      tarde: ["12:10", "12:30", "12:50", "13:10", "13:30"],
      noite: ["18:00", "18:15", "18:30", "18:45", "19:00"],
    },
  },
  {
    id: "biblioteca",
    name: "Biblioteca Central",
    zone: "Setor de aulas e estudo",
    coordinates: "Corredor central da UFRN",
    riskLevel: "monitorando",
    activeUsers: 19,
    description:
      "Parada com alto fluxo no fim da tarde, usada por estudantes que saem dos blocos centrais e seguem para a ECT e RU.",
    routeName: "Circular UFRN",
    routeDirection: "Sentido ECT e residencia universitaria",
    nextArrivals: ["6 min", "14 min", "23 min"],
    recommendedWaitArea:
      "Aguarde no recuo iluminado ao lado da biblioteca para manter visibilidade de quem vem do corredor central.",
    patrolEta: "8 min",
    patrolWindow: "Cobertura compartilhada com a seguranca do setor de aulas.",
    safetyWindow: "Movimento mais intenso entre 16h30 e 20h30.",
    totemStatus: "Area sem totem, monitoramento feito pelo app e pela ronda.",
    heroCaption: "Fluxo de saida do setor de aulas em direcao ao circular",
    platformCode: "BIC-02",
    operatingWindow: "05:50 as 22:20",
    boardingTip: "Nos intervalos noturnos, fique proximo a fachada principal da biblioteca.",
    scheduleByPeriod: {
      manha: ["06:15", "06:35", "06:55", "07:15"],
      tarde: ["12:20", "12:40", "13:00", "13:20"],
      noite: ["17:50", "18:10", "18:30", "18:50"],
    },
  },
  {
    id: "ru",
    name: "Restaurante Universitario",
    zone: "Acesso ao RU",
    coordinates: "Eixo de alimentacao e convivencia",
    riskLevel: "monitorando",
    activeUsers: 14,
    description:
      "Parada que concentra embarque apos o jantar e conecta quem sai do RU para os blocos, residencia e ECT.",
    routeName: "Circular UFRN",
    routeDirection: "Sentido ECT e eixo central",
    nextArrivals: ["9 min", "17 min", "28 min"],
    recommendedWaitArea:
      "Posicione-se perto da faixa principal do RU para manter circulacao visivel e acesso rapido ao embarque.",
    patrolEta: "10 min",
    patrolWindow: "Ronda compartilhada com o corredor do RU e acesso ao estacionamento.",
    safetyWindow: "Atencao reforcada das 18h20 as 21h40.",
    totemStatus: "Sem totem dedicado; avisos chegam via central SafeStop.",
    heroCaption: "Saida do RU com embarque de estudantes no horario noturno",
    platformCode: "RU-03",
    operatingWindow: "06:10 as 22:10",
    boardingTip: "No horario de menor fluxo, aguarde proximo ao ponto iluminado do acesso lateral.",
    scheduleByPeriod: {
      manha: ["06:30", "06:50", "07:10", "07:30"],
      tarde: ["12:35", "12:55", "13:15", "13:35"],
      noite: ["18:05", "18:25", "18:45", "19:05"],
    },
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
