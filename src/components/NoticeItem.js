import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "../constants/theme";

const accentMap = {
  info: colors.info,
  warning: colors.warning,
  success: colors.success,
};

export function NoticeItem({ notice }) {
  const accent = accentMap[notice.variant] ?? colors.info;

  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accent }]} />

      <View style={styles.content}>
        <Text style={styles.title}>{notice.title}</Text>
        <Text style={styles.body}>{notice.body}</Text>
        <Text style={styles.time}>{notice.createdAt}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 14,
  },
  accent: {
    width: 6,
    borderRadius: 99,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 17,
    fontWeight: "800",
  },
  body: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  time: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
  },
});

