import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "../constants/theme";

const toneStyles = {
  accent: {
    backgroundColor: "rgba(197, 0, 0, 0.08)",
    borderColor: "rgba(197, 0, 0, 0.18)",
    color: colors.brand,
  },
  warning: {
    backgroundColor: "rgba(198, 122, 0, 0.1)",
    borderColor: "rgba(198, 122, 0, 0.22)",
    color: colors.warning,
  },
  success: {
    backgroundColor: "rgba(28, 140, 91, 0.1)",
    borderColor: "rgba(28, 140, 91, 0.2)",
    color: colors.success,
  },
  info: {
    backgroundColor: "rgba(15, 121, 226, 0.1)",
    borderColor: "rgba(15, 121, 226, 0.22)",
    color: colors.info,
  },
  danger: {
    backgroundColor: "rgba(214, 0, 0, 0.1)",
    borderColor: "rgba(214, 0, 0, 0.24)",
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
