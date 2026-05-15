import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "../constants/theme";

export function ChatMessageBubble({ message }) {
  const isUser = message.sender === "usuario";

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.guardBubble]}>
        <Text style={styles.sender}>{isUser ? "Você" : "Segurança"}</Text>
        <Text style={styles.content}>{message.content}</Text>
        <Text style={styles.time}>{message.createdAt}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "flex-start",
    width: "100%",
  },
  rowUser: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "84%",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  guardBubble: {
    backgroundColor: colors.surface,
    borderColor: colors.outlineStrong,
  },
  userBubble: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brand,
  },
  sender: {
    color: colors.brandDeep,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  content: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  time: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
  },
});
