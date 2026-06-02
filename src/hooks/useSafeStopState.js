import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { io } from "socket.io-client";

import { API_URL, SOCKET_URL } from "../config/runtime";
import { stops as stopSeed } from "../data/stops";
import {
  clearStoredProfile,
  loadStoredProfile,
  persistProfile,
} from "../storage/profileStorage";

const alertFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const chatFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

function formatAlertTimestamp(dateInput) {
  const date = new Date(dateInput);
  return alertFormatter.format(date).replace(",", " |");
}

function formatChatTimestamp(dateInput) {
  return chatFormatter.format(new Date(dateInput));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function normalizeProfile(profile) {
  if (!profile) {
    return null;
  }

  return {
    fullName: profile.fullName?.trim() ?? "",
    ufrnId: profile.ufrnId?.trim() ?? "",
    emergencyContact: profile.emergencyContact?.trim() ?? "",
  };
}

function normalizeChatMessage(message) {
  const sender = message.sender === "seguranca" ? "seguranca" : "usuario";

  return {
    id: message.id ?? createId("chat"),
    roomId: message.roomId ?? null,
    sender,
    content: message.content ?? "",
    createdAt: message.createdAt
      ? formatChatTimestamp(message.createdAt)
      : formatChatTimestamp(new Date().toISOString()),
  };
}

function normalizeAlert(alert) {
  return {
    id: alert.id ?? createId("alert"),
    stopId: alert.stopId ?? "ect",
    stopName: alert.stopName ?? "Parada monitorada",
    author: alert.author ?? "Central SafeStop",
    anonymous: Boolean(alert.anonymous),
    message: alert.message ?? "",
    createdAt: alert.createdAt
      ? formatAlertTimestamp(alert.createdAt)
      : formatAlertTimestamp(new Date().toISOString()),
    riskLevel: alert.riskLevel ?? "alerta",
    status: alert.status ?? "ativo",
    confirmations: Number(alert.confirmations ?? 0),
  };
}

function normalizeNotice(notice) {
  return {
    id: notice.id ?? createId("notice"),
    title: notice.title ?? "Atualizacao",
    body: notice.body ?? "",
    createdAt: notice.createdAt
      ? formatChatTimestamp(notice.createdAt)
      : formatChatTimestamp(new Date().toISOString()),
    variant: notice.variant ?? "info",
  };
}

function normalizeHardwareAlert(event) {
  return {
    id: event.id ?? createId("hardware"),
    idTotem: event.id_totem ?? event.idTotem ?? "totem-desconhecido",
    stopId: event.stop_id ?? event.stopId ?? null,
    stopName: event.stop_name ?? event.stopName ?? null,
    latitude: Number(event.latitude ?? 0).toFixed(5),
    longitude: Number(event.longitude ?? 0).toFixed(5),
    createdAt: event.createdAt
      ? formatAlertTimestamp(event.createdAt)
      : formatAlertTimestamp(new Date().toISOString()),
  };
}

function createDemoHardwarePayload(selectedStop) {
  return {
    id_totem: selectedStop?.shortCode?.toLowerCase() ?? "ect",
    stop_id: selectedStop?.id ?? "ect",
    stop_name: selectedStop?.name ?? "Parada monitorada",
    latitude: selectedStop?.latitude ?? -5.83917,
    longitude: selectedStop?.longitude ?? -35.2007,
    createdAt: new Date().toISOString(),
  };
}

function upsertById(items, nextItem) {
  const currentIndex = items.findIndex((item) => item.id === nextItem.id);

  if (currentIndex === -1) {
    return [nextItem, ...items];
  }

  const nextItems = [...items];
  nextItems[currentIndex] = {
    ...nextItems[currentIndex],
    ...nextItem,
  };

  return nextItems;
}

function mergeStopStatuses(baseStops, alerts, hardwareAlert) {
  return baseStops.map((stop) => {
    const activeAlerts = alerts.filter(
      (alert) => alert.stopId === stop.id && alert.status !== "resolvido"
    );

    const hardwareRisk =
      hardwareAlert?.stopId === stop.id || hardwareAlert?.idTotem === stop.shortCode?.toLowerCase();

    let riskLevel = "monitorando";

    if (activeAlerts.some((alert) => alert.riskLevel === "emergencia") || hardwareRisk) {
      riskLevel = "emergencia";
    } else if (activeAlerts.length > 0) {
      riskLevel = "alerta";
    }

    return {
      ...stop,
      activeUsers: activeAlerts.length,
      riskLevel,
    };
  });
}

export function useSafeStopState() {
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [selectedStopId, setSelectedStopId] = useState(stopSeed[0].id);
  const [alerts, setAlerts] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [notices, setNotices] = useState([]);
  const [lastHardwareAlert, setLastHardwareAlert] = useState(null);
  const [hardwareState, setHardwareState] = useState({
    active: false,
    updatedAt: null,
    idTotem: null,
    stopId: null,
    stopName: null,
    latitude: null,
    longitude: null,
  });
  const socketRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function hydrateProfile() {
      const storedProfile = await loadStoredProfile();

      if (!mounted) {
        return;
      }

      setProfile(normalizeProfile(storedProfile));
      setIsReady(true);
    }

    hydrateProfile();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return undefined;
    }

    if (!profile?.ufrnId) {
      setConnectionStatus("disconnected");
      setAlerts([]);
      setChatMessages([]);
      setNotices([]);
      setLastHardwareAlert(null);
      return undefined;
    }

    const socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket"],
      auth: {
        role: "mobile",
      },
    });

    socketRef.current = socket;
    setConnectionStatus("connecting");

    socket.on("connect", () => {
      setConnectionStatus("connected");
      socket.emit("client:register", {
        profile,
        selectedStopId,
      });
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("connect_error", () => {
      setConnectionStatus("error");
      setNotices((current) =>
        upsertById(
          current,
          normalizeNotice({
            id: "offline-warning",
            title: "Central indisponivel",
            body: "Nao foi possivel conectar ao backend. Verifique a URL do servidor e o deploy.",
            variant: "warning",
          })
        )
      );
    });

    socket.on("bootstrap", (payload) => {
      const nextAlerts = (payload.alerts ?? []).map(normalizeAlert);
      const nextHardwareAlerts = payload.hardwareAlert ? normalizeHardwareAlert(payload.hardwareAlert) : null;
      const nextHardwareState =
        payload.hardwareState ?? {
          active: Boolean(payload.hardwareAlert),
          updatedAt: payload.hardwareAlert?.createdAt ?? null,
          idTotem: payload.hardwareAlert?.idTotem ?? null,
          stopId: payload.hardwareAlert?.stopId ?? null,
          stopName: payload.hardwareAlert?.stopName ?? null,
          latitude: payload.hardwareAlert?.latitude ?? null,
          longitude: payload.hardwareAlert?.longitude ?? null,
        };

      setAlerts(nextAlerts);
      setChatMessages((payload.chatMessages ?? []).map(normalizeChatMessage));
      setNotices((payload.notices ?? []).map(normalizeNotice));
      setHardwareState(nextHardwareState);
      setLastHardwareAlert(nextHardwareState.active ? nextHardwareAlerts : null);
    });

    socket.on("chat:message", (payload) => {
      setChatMessages((current) => [...current, normalizeChatMessage(payload)]);
    });

    socket.on("alert:created", (payload) => {
      setAlerts((current) => upsertById(current, normalizeAlert(payload)));
    });

    socket.on("alert:updated", (payload) => {
      setAlerts((current) => upsertById(current, normalizeAlert(payload)));
    });

    socket.on("notice:new", (payload) => {
      setNotices((current) => upsertById(current, normalizeNotice(payload)));
    });

    socket.on("hardware:danger", (payload) => {
      setHardwareState({
        active: true,
        updatedAt: payload.createdAt ?? new Date().toISOString(),
        idTotem: payload.idTotem ?? null,
        stopId: payload.stopId ?? null,
        stopName: payload.stopName ?? null,
        latitude: payload.latitude ?? null,
        longitude: payload.longitude ?? null,
      });
      handleHardwareDanger(payload);
    });

    socket.on("hardware:reset", (payload) => {
      setHardwareState((current) => ({
        ...current,
        active: false,
        updatedAt: payload?.updatedAt ?? new Date().toISOString(),
      }));
      setLastHardwareAlert(null);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isReady, profile]);

  useEffect(() => {
    if (
      Platform.OS !== "web" ||
      typeof window === "undefined" ||
      !isReady ||
      !profile?.ufrnId
    ) {
      return undefined;
    }

    const baseStop = stopSeed.find((stop) => stop.id === selectedStopId) ?? stopSeed[0];
    const browserDemoTrigger = (detail = {}) => {
      handleHardwareDanger({
        ...createDemoHardwarePayload(baseStop),
        ...detail,
      });
    };

    const handleKeyDown = (event) => {
      const key = event.key?.toLowerCase();

      if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === "e") {
        event.preventDefault();
        browserDemoTrigger();
      }
    };

    const handleBrowserDanger = (event) => {
      browserDemoTrigger(event.detail ?? {});
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("hardware:danger", handleBrowserDanger);
    window.addEventListener("safestop:hardware-danger", handleBrowserDanger);
    window.__SAFE_STOP_TRIGGER_HARDWARE_DANGER__ = browserDemoTrigger;

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("hardware:danger", handleBrowserDanger);
      window.removeEventListener("safestop:hardware-danger", handleBrowserDanger);

      if (window.__SAFE_STOP_TRIGGER_HARDWARE_DANGER__ === browserDemoTrigger) {
        delete window.__SAFE_STOP_TRIGGER_HARDWARE_DANGER__;
      }
    };
  }, [isReady, profile?.ufrnId, selectedStopId]);

  useEffect(() => {
    if (!socketRef.current?.connected || !selectedStopId) {
      return;
    }

    socketRef.current.emit("presence:update", {
      selectedStopId,
    });
  }, [selectedStopId]);

  const stops = mergeStopStatuses(stopSeed, alerts, lastHardwareAlert);
  const selectedStop = stops.find((stop) => stop.id === selectedStopId) ?? stops[0];
  const hasProfile = Boolean(profile?.ufrnId);

  function handleHardwareDanger(payload) {
    const nextHardwareAlert = normalizeHardwareAlert(payload);

    setLastHardwareAlert(nextHardwareAlert);
    setNotices((current) =>
      upsertById(
        current,
        normalizeNotice({
          title: "Totem acionado",
          body: `Sinal de emergencia recebido para ${nextHardwareAlert.stopName ?? nextHardwareAlert.idTotem}.`,
          variant: "warning",
        })
      )
    );
  }

  async function saveProfile(nextProfile) {
    const normalizedProfile = normalizeProfile(nextProfile);
    await persistProfile(normalizedProfile);
    setProfile(normalizedProfile);
  }

  async function updateEmergencyContact(nextEmergencyContact) {
    if (!profile) {
      return;
    }

    const nextProfile = {
      ...profile,
      emergencyContact: nextEmergencyContact.trim(),
    };

    await persistProfile(nextProfile);
    setProfile(nextProfile);
  }

  async function clearProfile() {
    await clearStoredProfile();
    setProfile(null);
  }

  function clearLastHardwareAlert() {
    setLastHardwareAlert(null);
  }

  async function triggerHardwareDanger(payload = {}) {
    try {
      const response = await fetch(`${API_URL}/api/hardware/serial-alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.warn("Could not trigger hardware danger:", error);
    }

    if (
      Platform.OS === "web" &&
      typeof window !== "undefined" &&
      typeof window.__SAFE_STOP_TRIGGER_HARDWARE_DANGER__ === "function"
    ) {
      window.__SAFE_STOP_TRIGGER_HARDWARE_DANGER__(payload);
      return true;
    }

    return false;
  }

  async function clearHardwareAlert() {
    try {
      const response = await fetch(`${API_URL}/api/hardware/reset`, {
        method: "POST",
      });

      if (!response.ok) {
        return false;
      }

      setLastHardwareAlert(null);
      setHardwareState((current) => ({
        ...current,
        active: false,
        updatedAt: new Date().toISOString(),
      }));
      return true;
    } catch (error) {
      console.warn("Could not reset hardware alert:", error);
      return false;
    }
  }

  function sendChatMessage(content) {
    const message = content.trim();

    if (!message || !socketRef.current?.connected) {
      return false;
    }

    socketRef.current.emit("chat:send", {
      content: message,
      stopId: selectedStopId,
    });

    return true;
  }

  function submitAlert({ anonymous, message, riskLevel, stopId }) {
    if (!socketRef.current?.connected) {
      return false;
    }

    socketRef.current.emit("alert:create", {
      anonymous,
      message: message.trim(),
      riskLevel,
      stopId,
    });

    return true;
  }

  function confirmAlert(alertId) {
    if (!socketRef.current?.connected) {
      return false;
    }

    socketRef.current.emit("alert:confirm", {
      alertId,
    });

    return true;
  }

  return {
    alerts,
    chatMessages,
    clearProfile,
    clearLastHardwareAlert,
    clearHardwareAlert,
    confirmAlert,
    connectionStatus,
    hasProfile,
    isReady,
    hardwareState,
    lastHardwareAlert,
    notices,
    profile,
    saveProfile,
    selectedStop,
    selectedStopId,
    sendChatMessage,
    setSelectedStopId,
    stops,
    submitAlert,
    triggerHardwareDanger,
    updateEmergencyContact,
  };
}
