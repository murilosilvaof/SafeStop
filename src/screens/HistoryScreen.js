import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native";
import { globalStyles as styles } from "../styles/globalStyles";

const STATUS_FILTERS = ["Todos", "Pendente", "Confirmado", "Resolvido"];

const statusStyle = {
  pendente: { bg: "#F3C54820", border: "#F3C54840", text: "#F3C548" },
  confirmado: { bg: "#3B82F620", border: "#3B82F640", text: "#60A5FA" },
  resolvido: { bg: "#34D39920", border: "#34D39940", text: "#34D399" },
};

const typeIcons = {
  assalto: "⚠️",
  iluminacao: "💡",
  suspeito: "👁",
  acidente: "🚨",
  default: "📍",
};

function HistoryCard({ alert }) {
  const s = statusStyle[alert.status] || statusStyle["pendente"];
  const icon = typeIcons[alert.type] || typeIcons.default;
  const date = new Date(alert.createdAt);
  const dateStr = date.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric"
  });
  const timeStr = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit", minute: "2-digit"
  });

  return (
    <View style={{
      backgroundColor: "#0D1B23",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#1E3040",
      padding: 16,
      gap: 10,
    }}>
      {/* Topo: ícone + parada + status */}
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
        <View style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: "#112030",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Text style={{ fontSize: 22 }}>{icon}</Text>
        </View>

        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[styles.heroMeta, { fontSize: 12 }]}>{alert.stopName || "Parada desconhecida"}</Text>
          <Text style={[styles.commandTitle, { fontSize: 16 }]}>{alert.title}</Text>
        </View>

        <View style={{
          backgroundColor: s.bg,
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderWidth: 1,
          borderColor: s.border,
        }}>
          <Text style={{ color: s.text, fontSize: 11, fontWeight: "800", textTransform: "uppercase" }}>
            {alert.status}
          </Text>
        </View>
      </View>

      {/* Descrição */}
      {alert.description && (
        <Text style={[styles.subtitle, { fontSize: 14 }]}>{alert.description}</Text>
      )}

      {/* Rodapé: data + confirmações */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={styles.dispatchMeta}>{dateStr} às {timeStr}</Text>
        {alert.confirmations > 0 && (
          <Text style={[styles.dispatchMeta, { color: "#60A5FA" }]}>
            👥 {alert.confirmations} confirmação(ões)
          </Text>
        )}
      </View>
    </View>
  );
}

export function HistoryScreen({ state }) {
  const { alerts } = state;
  const [activeFilter, setActiveFilter] = useState("Todos");

  // Simula alertas "do usuário" — em produção viria de um userId
  const myAlerts = alerts; // exibe todos por ora

  const filtered = activeFilter === "Todos"
    ? myAlerts
    : myAlerts.filter((a) => a.status?.toLowerCase() === activeFilter.toLowerCase());

  // Estatísticas rápidas
  const total = myAlerts.length;
  const resolved = myAlerts.filter((a) => a.status === "resolvido").length;
  const confirmed = myAlerts.filter((a) => a.confirmations > 0).length;

  return (
    <ScrollView
      style={styles.shell}
      contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SEU HISTÓRICO</Text>
        <Text style={styles.title}>Alertas Enviados</Text>
        <Text style={styles.subtitle}>
          Acompanhe os alertas que você registrou e veja se foram confirmados pela comunidade.
        </Text>
      </View>

      {/* Cards de estatísticas */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        {[
          { label: "Total", value: total, color: "#92A3AE" },
          { label: "Resolvidos", value: resolved, color: "#34D399" },
          { label: "Confirmados", value: confirmed, color: "#60A5FA" },
        ].map((stat) => (
          <View key={stat.label} style={[styles.operationCard, { flex: 1, alignItems: "center" }]}>
            <Text style={[styles.operationValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.operationLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 4 }}
      >
        {STATUS_FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setActiveFilter(f)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 999,
              backgroundColor: activeFilter === f ? "#1D4D6B" : "#0D1B23",
              borderWidth: 1,
              borderColor: activeFilter === f ? "#3B7EA6" : "#1E3040",
            }}
          >
            <Text style={{
              color: activeFilter === f ? "#E0F0FF" : "#92A3AE",
              fontSize: 13,
              fontWeight: "700",
            }}>
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Lista de alertas */}
      <View style={{ gap: 12 }}>
        {filtered.length > 0 ? (
          filtered.map((alert) => (
            <HistoryCard key={alert.id} alert={alert} />
          ))
        ) : (
          <View style={styles.dispatchCard}>
            <Text style={styles.dispatchText}>
              Nenhum alerta encontrado com este filtro.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}