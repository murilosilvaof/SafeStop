import { useState } from "react";

import { initialAlerts, initialChatMessages, initialNotices, stops as stopSeed } from "../data/mockData";

const formatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const chatFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

function formatAlertTimestamp(date) {
  return formatter.format(date).replace(",", " •");
}

function formatChatTimestamp(date) {
  return chatFormatter.format(date);
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export function useSafeStopState() {
  const [stops, setStops] = useState(stopSeed);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [notices, setNotices] = useState(initialNotices);
  const [selectedStopId, setSelectedStopId] = useState(stopSeed[0].id);
  const [lastSentAlertId, setLastSentAlertId] = useState(null);

  const selectedStop = stops.find((stop) => stop.id === selectedStopId) ?? stops[0];
  const lastSentAlert = alerts.find((alert) => alert.id === lastSentAlertId) ?? null;

  const submitAlert = ({ anonymous, message, riskLevel, stopId }) => {
    const targetStop = stops.find((stop) => stop.id === stopId) ?? stops[0];
    const createdAt = new Date();

    const newAlert = {
      id: createId("alert"),
      stopId: targetStop.id,
      stopName: targetStop.name,
      author: anonymous ? "Usuário anônimo" : "Você",
      anonymous,
      message,
      createdAt: formatAlertTimestamp(createdAt),
      riskLevel,
      status: "ativo",
      confirmations: 1,
    };

    setAlerts((current) => [newAlert, ...current]);
    setLastSentAlertId(newAlert.id);

    setStops((current) =>
      current.map((stop) =>
        stop.id === targetStop.id
          ? {
              ...stop,
              riskLevel,
              activeUsers: stop.activeUsers + 1,
            }
          : stop
      )
    );

    setChatMessages((current) => [
      ...current,
      {
        id: createId("chat"),
        sender: "seguranca",
        content: `Alerta recebido para ${targetStop.name}. Equipe patrimonial acionada e usuários próximos foram avisados.`,
        createdAt: formatChatTimestamp(createdAt),
      },
    ]);

    setNotices((current) => [
      {
        id: createId("notice"),
        title: `Novo alerta na ${targetStop.name}`,
        body: message,
        createdAt: formatChatTimestamp(createdAt),
        variant: riskLevel === "emergencia" ? "warning" : "info",
      },
      ...current,
    ]);
  };

  const confirmAlert = (alertId) => {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              confirmations: alert.confirmations + 1,
            }
          : alert
      )
    );
  };

  const sendChatMessage = (content) => {
    const createdAt = new Date();
    const humanTime = formatChatTimestamp(createdAt);

    setChatMessages((current) => [
      ...current,
      {
        id: createId("chat"),
        sender: "usuario",
        content,
        createdAt: humanTime,
      },
      {
        id: createId("chat"),
        sender: "seguranca",
        content: "Mensagem recebida. Continue em local iluminado enquanto a ronda se aproxima.",
        createdAt: humanTime,
      },
    ]);
  };

  return {
    alerts,
    chatMessages,
    confirmAlert,
    lastSentAlert,
    notices,
    selectedStop,
    selectedStopId,
    sendChatMessage,
    setSelectedStopId,
    stops,
    submitAlert,
  };
}

