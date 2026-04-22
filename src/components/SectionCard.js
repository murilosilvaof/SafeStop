import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "../constants/theme";

const toneMap = {
  sea: colors.info,
  sun: colors.warning,
  brick: colors.danger,
  mint: colors.success,
};

export function SectionCard({ children, description, eyebrow, title, tone = "sea" }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: toneMap[tone] ?? colors.info }]}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    padding: 20,
    gap: 16,
  },
  header: {
    gap: 8,
  },
  eyebrow: {
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
  },
  description: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  body: {
    gap: 12,
  },
});

