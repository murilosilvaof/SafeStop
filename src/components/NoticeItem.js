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
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{notice.title}</Text>
          <View style={[styles.timeBadge, { borderColor: `${accent}55` }]}>
            <View style={[styles.timeDot, { backgroundColor: accent }]} />
            <Text style={styles.time}>{notice.createdAt}</Text>
          </View>
        </View>
        <Text style={styles.body}>{notice.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 14,
  },
  content: {
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 17,
    fontWeight: "800",
    flex: 1,
  },
  body: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.surfaceLifted,
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  time: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
  },
});
