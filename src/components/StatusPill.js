import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "../constants/theme";

const toneStyles = {
  accent: {
    backgroundColor: "rgba(255, 122, 26, 0.18)",
    borderColor: "rgba(255, 122, 26, 0.45)",
    color: colors.brandSoft,
  },
  warning: {
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    borderColor: "rgba(251, 191, 36, 0.4)",
    color: colors.warning,
  },
  success: {
    backgroundColor: "rgba(74, 222, 128, 0.16)",
    borderColor: "rgba(74, 222, 128, 0.4)",
    color: colors.success,
  },
  info: {
    backgroundColor: "rgba(125, 211, 252, 0.16)",
    borderColor: "rgba(125, 211, 252, 0.4)",
    color: colors.info,
  },
  danger: {
    backgroundColor: "rgba(251, 113, 133, 0.18)",
    borderColor: "rgba(251, 113, 133, 0.45)",
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
      <Text style={[styles.label, { color: palette.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});

