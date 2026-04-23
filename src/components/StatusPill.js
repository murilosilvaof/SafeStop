import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "../constants/theme";

const toneStyles = {
  accent: {
    backgroundColor: "rgba(243, 197, 72, 0.16)",
    borderColor: "rgba(243, 197, 72, 0.36)",
    color: colors.brandSoft,
  },
  warning: {
    backgroundColor: "rgba(255, 182, 72, 0.14)",
    borderColor: "rgba(255, 182, 72, 0.35)",
    color: colors.warning,
  },
  success: {
    backgroundColor: "rgba(76, 211, 126, 0.16)",
    borderColor: "rgba(76, 211, 126, 0.4)",
    color: colors.success,
  },
  info: {
    backgroundColor: "rgba(75, 182, 255, 0.16)",
    borderColor: "rgba(75, 182, 255, 0.4)",
    color: colors.info,
  },
  danger: {
    backgroundColor: "rgba(240, 68, 68, 0.18)",
    borderColor: "rgba(240, 68, 68, 0.42)",
    color: colors.danger,
  },
};

export function StatusPill({ label, tone = "info" }) {
  const palette = toneStyles[tone] ?? toneStyles.info;

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: palette.color }]} />
      <Text style={[styles.label, { color: palette.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },
});
