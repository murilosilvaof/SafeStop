import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "../constants/theme";

const toneMap = {
  danger: colors.danger,
  info: colors.info,
  success: colors.success,
};

export function MetricCard({ hint, label, tone = "info", value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: toneMap[tone] ?? colors.info }]}>{value}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    padding: 18,
    gap: 10,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 38,
    fontWeight: "800",
  },
  hint: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
});
