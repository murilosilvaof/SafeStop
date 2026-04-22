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
  },
  rowUser: {
    alignItems: "flex-end",
  },
  bubble: {
    width: "88%",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
    borderWidth: 1,
  },
  guardBubble: {
    backgroundColor: colors.surface,
    borderColor: colors.outline,
  },
  userBubble: {
    backgroundColor: "rgba(255, 122, 26, 0.18)",
    borderColor: "rgba(255, 122, 26, 0.45)",
  },
  sender: {
    color: colors.brandSoft,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
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

