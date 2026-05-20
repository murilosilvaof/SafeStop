import React from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native";
import { globalStyles as styles } from "../styles/globalStyles";
import { StatusPill } from "../components/StatusPill";
import { AlertFeedItem } from "../components/AlertFeedItem";
import { riskMeta } from "../data/stops";

// Dados extras por parada — idealmente viria do mockData ou de uma API
const stopExtras = {
  ect: {
    infrastructure: ["Cobertura", "Iluminação", "Câmera de segurança", "Lixeira"],
    tip: "Horário de maior movimento: 07h–08h e 17h–18h. Prefira aguardar dentro do bloco nos horários noturnos.",
    patrolSchedule: "Patrulha a cada 2h — Última: 17:30",
  },
};

export function StopDetailScreen({ state }) {
  const { selectedStop, alerts, confirmAlert } = state;

  if (!selectedStop) return null;

  const risk = riskMeta[selectedStop.riskLevel];
  const extras = stopExtras[selectedStop.id] || {};

  // Alertas relacionados a esta parada
  const stopAlerts = alerts.filter(
    (a) => a.stopId === selectedStop.id && a.status !== "resolvido"
  );

  const riskColor =
    risk.tone === "danger" ? "#F04444"
    : risk.tone === "warning" ? "#F3C548"
    : "#34D399";

  return (
    <ScrollView
      style={styles.shell}
      contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{selectedStop.zone} · {selectedStop.routeName}</Text>
        <Text style={styles.title}>{selectedStop.name}</Text>
        <Text style={styles.subtitle}>{selectedStop.description}</Text>
      </View>

      {/* Status Card */}
      <View style={{
        backgroundColor: "#0D1B23",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: riskColor + "40",
        padding: 20,
        gap: 16,
      }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.eyebrow}>STATUS ATUAL</Text>
          <StatusPill label={risk.label} tone={risk.tone} />
        </View>

        {/* Barra de risco visual */}
        <View>
          <View style={{
            height: 8,
            backgroundColor: "#1E3040",
            borderRadius: 999,
            overflow: "hidden",
          }}>
            <View style={{
              height: 8,
              borderRadius: 999,
              backgroundColor: riskColor,
              width: risk.tone === "danger" ? "85%" : risk.tone === "warning" ? "50%" : "20%",
            }} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
            <Text style={[styles.arrivalLabel, { color: "#34D399" }]}>BAIXO</Text>
            <Text style={[styles.arrivalLabel, { color: "#F3C548" }]}>MÉDIO</Text>
            <Text style={[styles.arrivalLabel, { color: "#F04444" }]}>ALTO</Text>
          </View>
        </View>

        {/* Janela de segurança */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={[styles.arrivalChip, { flex: 1 }]}>
            <Text style={styles.arrivalLabel}>Janela segura</Text>
            <Text style={[styles.heroMeta, { fontSize: 13 }]}>{selectedStop.safetyWindow}</Text>
          </View>
          <View style={[styles.arrivalChip, { flex: 1 }]}>
            <Text style={styles.arrivalLabel}>Rota</Text>
            <Text style={[styles.heroMeta, { fontSize: 13 }]}>{selectedStop.routeDirection}</Text>
          </View>
        </View>
      </View>

      {/* Próximas chegadas */}
      <View style={styles.commandDeck}>
        <Text style={styles.eyebrow}>PRÓXIMAS CHEGADAS</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {selectedStop.nextArrivals?.map((time, i) => (
            <View key={time} style={[styles.arrivalChip, { flex: 1 }]}>
              <Text style={styles.arrivalLabel}>{i === 0 ? "Primeiro" : "Segundo"}</Text>
              <Text style={styles.arrivalValue}>{time}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Infraestrutura */}
      {extras.infrastructure && (
        <View style={styles.commandDeck}>
          <Text style={styles.eyebrow}>INFRAESTRUTURA</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {extras.infrastructure.map((item) => (
              <View key={item} style={{
                backgroundColor: "#112030",
                borderRadius: 999,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: "#1E3040",
              }}>
                <Text style={{ color: "#C8D8E4", fontSize: 13, fontWeight: "700" }}>
                  ✓ {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Patrulha e dica de segurança */}
      {extras.tip && (
        <View style={[styles.dispatchCard, { borderColor: "#F3C54840" }]}>
          <Text style={[styles.dispatchLabel, { color: "#F3C548" }]}>DICA DE SEGURANÇA</Text>
          <Text style={styles.dispatchText}>{extras.tip}</Text>
          {extras.patrolSchedule && (
            <Text style={[styles.dispatchMeta, { marginTop: 4 }]}>
              🛡 {extras.patrolSchedule}
            </Text>
          )}
        </View>
      )}

      {/* Alertas ativos nesta parada */}
      <View style={{ gap: 12 }}>
        <Text style={styles.eyebrow}>
          ALERTAS NESTA PARADA ({stopAlerts.length})
        </Text>
        {stopAlerts.length > 0 ? (
          stopAlerts.map((alert) => (
            <AlertFeedItem key={alert.id} alert={alert} onConfirm={confirmAlert} />
          ))
        ) : (
          <View style={[styles.dispatchCard]}>
            <Text style={styles.dispatchText}>
              Nenhum alerta ativo nesta parada no momento.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
