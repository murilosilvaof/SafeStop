import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { StatusPill } from "../components/StatusPill";
import { colors, fonts } from "../constants/theme";
import { riskMeta } from "../data/stops";

const periodLabels = {
  manha: "Manha",
  tarde: "Tarde",
  noite: "Noite",
};

function InfoPill({ icon, label, value }) {
  return (
    <View style={styles.infoPill}>
      <Ionicons color={colors.route} name={icon} size={16} />
      <View style={styles.infoPillCopy}>
        <Text style={styles.infoPillLabel}>{label}</Text>
        <Text style={styles.infoPillValue}>{value}</Text>
      </View>
    </View>
  );
}

export function SchedulesScreen({ state }) {
  const { selectedStopId, setSelectedStopId, stops } = state;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CIRCULAR UFRN</Text>
        <Text style={styles.title}>Paradas e horarios</Text>
        <Text style={styles.subtitle}>
          Consulte a parada principal, os proximos onibus e os horarios estimados por periodo.
        </Text>
      </View>

      {stops.map((stop) => {
        const selected = stop.id === selectedStopId;
        const risk = riskMeta[stop.riskLevel];

        return (
          <Pressable
            key={stop.id}
            onPress={() => setSelectedStopId(stop.id)}
            style={[styles.stopCard, selected && styles.stopCardSelected]}
          >
            <View style={styles.stopHeader}>
              <View style={styles.stopIconWrap}>
                <Ionicons color={colors.route} name="bus-outline" size={24} />
              </View>

              <View style={styles.stopCopy}>
                <Text style={styles.stopTitle}>{stop.name}</Text>
                <Text style={styles.stopMeta}>
                  {stop.zone} | Plataforma {stop.platformCode}
                </Text>
              </View>

              <StatusPill label={risk.label} tone={risk.tone} />
            </View>

            <View style={styles.infoRow}>
              <InfoPill icon="time-outline" label="Proximo" value={stop.nextArrivals[0]} />
              <InfoPill icon="calendar-outline" label="Operacao" value={stop.operatingWindow} />
            </View>

            <Text style={styles.tipText}>{stop.boardingTip}</Text>

            <View style={styles.scheduleGrid}>
              {Object.entries(stop.scheduleByPeriod ?? {}).map(([period, values]) => (
                <View key={period} style={styles.scheduleCard}>
                  <Text style={styles.scheduleTitle}>{periodLabels[period] ?? period}</Text>

                  <View style={styles.timeRow}>
                    {values.map((time) => (
                      <View key={`${stop.id}-${period}-${time}`} style={styles.timeChip}>
                        <Text style={styles.timeText}>{time}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 148,
    gap: 18,
  },
  header: {
    gap: 8,
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
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
  stopCard: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 28,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  stopCardSelected: {
    borderColor: "#F0B7B7",
    backgroundColor: "#FFF9F7",
  },
  stopHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stopIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F0",
  },
  stopCopy: {
    flex: 1,
    gap: 4,
  },
  stopTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 23,
    fontWeight: "800",
  },
  stopMeta: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
  },
  infoPill: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: colors.surfaceLifted,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  infoPillCopy: {
    flex: 1,
    gap: 2,
  },
  infoPillLabel: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  infoPillValue: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: "800",
  },
  tipText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  scheduleGrid: {
    gap: 12,
  },
  scheduleCard: {
    backgroundColor: colors.surfaceLifted,
    borderRadius: 22,
    padding: 16,
    gap: 12,
  },
  scheduleTitle: {
    color: colors.route,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  timeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.outline,
  },
  timeText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: "700",
  },
});
