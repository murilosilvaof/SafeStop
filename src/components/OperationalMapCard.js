import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "../constants/theme";

function getMarkerTone(stop, highlightedStopId) {
  if (stop.id === highlightedStopId) {
    return {
      backgroundColor: colors.danger,
      borderColor: "#FFFFFF",
      labelColor: "#FFFFFF",
    };
  }

  if (stop.riskLevel === "emergencia") {
    return {
      backgroundColor: colors.danger,
      borderColor: colors.danger,
      labelColor: "#FFFFFF",
    };
  }

  if (stop.riskLevel === "alerta") {
    return {
      backgroundColor: colors.warning,
      borderColor: colors.warning,
      labelColor: colors.text,
    };
  }

  return {
    backgroundColor: colors.success,
    borderColor: colors.success,
    labelColor: "#FFFFFF",
  };
}

export function OperationalMapCard({ highlightedStopId, lastHardwareAlert, stops }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Parada de Testes</Text>
          <Text style={styles.title}>ECT - Totem em operação piloto</Text>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Normal</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
            <Text style={styles.legendText}>Perigo</Text>
          </View>
        </View>
      </View>

      <View style={styles.mapSurface}>
        <View style={styles.routeLineHorizontal} />
        <View style={styles.routeLineVertical} />
        <View style={styles.zoneCardTop}>
          <Text style={styles.zoneLabel}>Setor de aulas</Text>
        </View>
        <View style={styles.zoneCardBottom}>
          <Text style={styles.zoneLabel}>Eixo RU e convivio</Text>
        </View>

        {stops.map((stop) => {
          const tone = getMarkerTone(stop, highlightedStopId);

          return (
            <View
              key={stop.id}
              style={[
                styles.markerWrap,
                {
                  top: stop.mapPosition?.top ?? "50%",
                  left: stop.mapPosition?.left ?? "50%",
                },
              ]}
            >
              <View
                style={[
                  styles.marker,
                  {
                    backgroundColor: tone.backgroundColor,
                    borderColor: tone.borderColor,
                  },
                ]}
              >
                <Text style={[styles.markerCode, { color: tone.labelColor }]}>{stop.shortCode}</Text>
              </View>
              <Text style={styles.markerLabel}>{stop.name}</Text>
            </View>
          );
        })}
      </View>

      {lastHardwareAlert ? (
        <View style={styles.eventCard}>
          <Text style={styles.eventEyebrow}>Ultimo sinal do totem</Text>
          <Text style={styles.eventTitle}>
            {lastHardwareAlert.stopName ?? lastHardwareAlert.idTotem}
          </Text>
          <Text style={styles.eventText}>
            Coordenadas {lastHardwareAlert.latitude}, {lastHardwareAlert.longitude}
          </Text>
          <Text style={styles.eventText}>
            Recebido em {lastHardwareAlert.createdAt}
          </Text>
        </View>
      ) : (
        <View style={styles.eventCard}>
          <Text style={styles.eventEyebrow}>Totens</Text>
          <Text style={styles.eventText}>
            Nenhum disparo de hardware recebido nesta sessao.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    backgroundColor: colors.surfaceStrong,
    borderRadius: 28,
    padding: 20,
    gap: 18,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  eyebrow: {
    color: colors.route,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },
  legend: {
    gap: 8,
    alignItems: "flex-end",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  legendText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },
  mapSurface: {
    minHeight: 280,
    borderRadius: 24,
    backgroundColor: "#E9F0F8",
    overflow: "hidden",
    position: "relative",
  },
  routeLineHorizontal: {
    position: "absolute",
    top: "48%",
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: "#C8D6E8",
  },
  routeLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "48%",
    width: 14,
    backgroundColor: "#C8D6E8",
  },
  zoneCardTop: {
    position: "absolute",
    top: 20,
    left: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  zoneCardBottom: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  zoneLabel: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },
  markerWrap: {
    position: "absolute",
    alignItems: "center",
    width: 108,
    marginLeft: -54,
    marginTop: -32,
  },
  marker: {
    minWidth: 52,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  markerCode: {
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: "800",
  },
  markerLabel: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
  eventCard: {
    borderRadius: 20,
    backgroundColor: colors.surfaceLifted,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    padding: 16,
    gap: 6,
  },
  eventEyebrow: {
    color: colors.route,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  eventTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: "800",
  },
  eventText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
});
