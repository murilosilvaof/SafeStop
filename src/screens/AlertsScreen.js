import React from "react";
import { ScrollView, Text, View } from "react-native";
import { globalStyles as styles } from "../styles/globalStyles";
import { AlertFeedItem } from "../components/AlertFeedItem";
import { SectionCard } from "../components/SectionCard";

export function AlertsScreen({ state }) {
  const { alerts, confirmAlert } = state;

  // Filtramos para mostrar primeiro os alertas que não foram resolvidos
  const activeAlerts = alerts.filter((alert) => alert.status !== "resolvido");

  return (
    <ScrollView 
      style={styles.shell} 
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>COMUNIDADE SAFE STOP</Text>
        <Text style={styles.title}>Alertas Recentes</Text>
      </View>

      <SectionCard 
        title="Ocorrências na Região"
        description="Confirme alertas próximos para ajudar a validar a segurança das paradas."
      >
        <View style={{ gap: 16 }}>
          {activeAlerts.length > 0 ? (
            activeAlerts.map((alert) => (
              <AlertFeedItem
                key={alert.id}
                alert={alert}
                onConfirm={confirmAlert}
              />
            ))
          ) : (
            <Text style={styles.stopCardText}>
              Nenhum alerta ativo no momento. O campus parece seguro.
            </Text>
          )}
        </View>
      </SectionCard>

      {/* Seção opcional para alertas já resolvidos (histórico recente) */}
      {alerts.some(a => a.status === "resolvido") && (
        <View style={{ marginTop: 10, opacity: 0.6 }}>
          <Text style={[styles.eyebrow, { marginBottom: 12 }]}>RESOLVIDOS RECENTEMENTE</Text>
          {alerts
            .filter(a => a.status === "resolvido")
            .slice(0, 2)
            .map(alert => (
              <AlertFeedItem
                key={alert.id}
                alert={alert}
                onConfirm={() => {}}
              />
            ))}
        </View>
      )}
    </ScrollView>
  );
}