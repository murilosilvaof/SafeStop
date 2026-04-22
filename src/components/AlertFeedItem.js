import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "../constants/theme";
import { riskMeta, statusMeta } from "../data/mockData";
import { StatusPill } from "./StatusPill";

export function AlertFeedItem({ alert, onConfirm }) {
  const risk = riskMeta[alert.riskLevel];
  const status = statusMeta[alert.status];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{alert.stopName}</Text>
          <Text style={styles.meta}>
            {alert.author} • {alert.createdAt}
          </Text>
        </View>

        <View style={styles.badges}>
          <StatusPill label={risk.label} tone={risk.tone} />
          <StatusPill label={status.label} tone={status.tone} />
        </View>
      </View>

      <Text style={styles.message}>{alert.message}</Text>

      <View style={styles.footer}>
        <Text style={styles.confirmationText}>
          {alert.confirmations} confirmações de usuários próximos
        </Text>

        <Pressable onPress={() => onConfirm(alert.id)} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirmar alerta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 16,
    gap: 14,
  },
  topRow: {
    gap: 12,
  },
  textBlock: {
    gap: 4,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: "800",
  },
  meta: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  message: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
  confirmationText: {
    color: colors.info,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  confirmButton: {
    backgroundColor: colors.surfaceLifted,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  confirmButtonText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: "800",
  },
});

