import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const EmergencyContext = createContext(null);

const API_URL = "http://127.0.0.1:3001";

export function EmergencyProvider({ children }) {
  const [emergency, setEmergency] = useState(false);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadInitialState = async () => {
      try {
        const response = await fetch(`${API_URL}/api/emergency/state`);
        const data = await response.json();

        if (!mounted) return;
        setEmergency(Boolean(data.emergency));
        setLastUpdate(data.updatedAt || null);
        setConnected(true);
      } catch (error) {
        if (mounted) setConnected(false);
        console.log("Failed to load emergency state:", error);
      }
    };

    loadInitialState();

    const source = new EventSource(`${API_URL}/events`);

    source.onopen = () => {
      if (mounted) setConnected(true);
    };

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!mounted) return;

        setEmergency(Boolean(data.emergency));
        setLastUpdate(data.updatedAt || null);
        setConnected(true);
      } catch (error) {
        console.log("Failed to parse SSE payload:", error);
      }
    };

    source.onerror = () => {
      if (mounted) setConnected(false);
    };

    return () => {
      mounted = false;
      source.close();
    };
  }, []);

  const resetEmergency = async () => {
    await fetch(`${API_URL}/api/emergency/reset`, { method: "POST" });
  };

  const value = useMemo(
    () => ({
      emergency,
      connected,
      lastUpdate,
      resetEmergency,
    }),
    [emergency, connected, lastUpdate]
  );

  return <EmergencyContext.Provider value={value}>{children}</EmergencyContext.Provider>;
}

export function useEmergency() {
  const context = useContext(EmergencyContext);

  if (!context) {
    throw new Error("useEmergency must be used within EmergencyProvider");
  }

  return context;
}
