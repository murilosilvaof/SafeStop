import React, { useMemo, useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AlertComposer } from "../components/AlertComposer";
import { ChatMessageBubble } from "../components/ChatMessageBubble";
import { OperationalMapCard } from "../components/OperationalMapCard";
import { StatusPill } from "../components/StatusPill";
import { colors, fonts } from "../constants/theme";
import { riskMeta } from "../data/stops";

const ectHeroImage = require("../../assets/ect-campus-banner.png");

function QuickStatusCard({ icon, title, value, tone = "default" }) {
  const accentMap = {
    default: {
      backgroundColor: colors.surfaceLifted,
      iconBackgroundColor: colors.brandSoft,
      iconColor: colors.brand,
    },
    warning: {
      backgroundColor: "#FFF4E5",
      iconBackgroundColor: "#FFE0B5",
      iconColor: "#B86B00",
    },
    success: {
      backgroundColor: "#ECF9F1",
      iconBackgroundColor: "#D2F0E0",
      iconColor: colors.success,
    },
  };

  const accent = accentMap[tone] ?? accentMap.default;

  return (
    <View style={[styles.quickStatusCard, { backgroundColor: accent.backgroundColor }]}>
      <View style={[styles.quickStatusIcon, { backgroundColor: accent.iconBackgroundColor }]}>
        <Ionicons color={accent.iconColor} name={icon} size={20} />
      </View>
      <Text style={styles.quickStatusValue}>{value}</Text>
      <Text style={styles.quickStatusTitle}>{title}</Text>
    </View>
  );
}

export function HomeScreen({ navigation, state }) {
  const {
    alerts,
    chatMessages,
    connectionStatus,
    lastHardwareAlert,
    notices,
    profile,
    selectedStop,
    selectedStopId,
    sendChatMessage,
    setSelectedStopId,
    stops,
    submitAlert,
  } = state;
  const [chatDraft, setChatDraft] = useState("");
  const [isComposerVisible, setComposerVisible] = useState(false);

  const stop = selectedStop ?? stops[0];
  const stopRisk = riskMeta[stop?.riskLevel ?? "monitorando"];
  const stopAlerts = alerts.filter(
    (alert) => alert.stopId === stop?.id && alert.status !== "resolvido"
  );
  const latestNotice = notices[0] ?? null;
  const previewMessages = useMemo(() => chatMessages.slice(-4), [chatMessages]);
  const firstName = profile?.fullName?.split(" ")[0] ?? "Usuario";

  if (!stop) {
    return null;
  }

  const handleSendMessage = () => {
    const wasSent = sendChatMessage(chatDraft);

    if (!wasSent) {
      Alert.alert(
        "Sem conexao com a central",
        "Conecte o app ao backend Python para enviar mensagens em tempo real."
      );
      return;
    }

    setChatDraft("");
  };

  const handleAlertSubmit = (alertData) => {
    const wasSent = submitAlert(alertData);

    if (!wasSent) {
      Alert.alert(
        "Servidor indisponivel",
        "Nao foi possivel registrar o alerta agora. Verifique o backend e tente novamente."
      );
      return;
    }

    setComposerVisible(false);
  };

  const openSchedules = () => {
    setSelectedStopId(stop.id);
    navigation.navigate("Horarios");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>SAFE STOP | OPERACAO</Text>
          <Text style={styles.heroTitle}>Central em tempo real</Text>
          <Text style={styles.heroSubtitle}>
            {firstName}, esse fluxo agora depende do backend oficial, do Socket.IO e do broker MQTT
            da universidade.
          </Text>

          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <View
                style={[
                  styles.heroBadgeDot,
                  connectionStatus === "connected" ? styles.heroBadgeDotOnline : styles.heroBadgeDotOffline,
                ]}
              />
              <Text style={styles.heroBadgeText}>
                {connectionStatus === "connected"
                  ? "Central sincronizada"
                  : "Aguardando backend"}
              </Text>
            </View>

            <View style={[styles.heroBadge, styles.heroBadgeOutline]}>
              <Ionicons color={colors.warning} name="warning-outline" size={16} />
              <Text style={styles.heroBadgeText}>{stopAlerts.length} alertas ativos</Text>
            </View>
          </View>
        </View>

        <View style={styles.statusRow}>
          <QuickStatusCard
            icon="chatbubble-ellipses-outline"
            title="Mensagens"
            value={String(chatMessages.length)}
          />
          <QuickStatusCard
            icon="hardware-chip-outline"
            title="Totens em monitoramento"
            tone="success"
            value={String(stops.length)}
          />
          <QuickStatusCard
            icon="alert-circle-outline"
            title="Ultimo nivel"
            tone={stop.riskLevel === "emergencia" ? "warning" : "default"}
            value={stopRisk.label}
          />
        </View>

        <View style={styles.alertCard}>
          <Pressable onPress={() => setComposerVisible(true)} style={styles.alertButton}>
            <Ionicons color="#FFFFFF" name="warning" size={48} />
            <Text style={styles.alertButtonText}>ALERTA</Text>
          </Pressable>

          <Text style={styles.alertTitle}>Acionar ajuda imediata</Text>
          <Text style={styles.alertDescription}>
            O alerta vai direto para a central, para o painel de seguranca e para os usuarios
            conectados.
          </Text>
        </View>

        <OperationalMapCard
          highlightedStopId={lastHardwareAlert?.stopId}
          lastHardwareAlert={lastHardwareAlert}
          stops={stops}
        />

        <ImageBackground imageStyle={styles.stopImage} source={ectHeroImage} style={styles.stopCard}>
          <View style={styles.stopOverlay} />

          <View style={styles.stopHeader}>
            <View style={styles.stopHeaderCopy}>
              <Text style={styles.stopEyebrow}>Parada acompanhada agora</Text>
              <Text style={styles.stopTitle}>{stop.name}</Text>
              <Text style={styles.stopMeta}>
                {stop.zone} | {stop.routeName}
              </Text>
            </View>
            <StatusPill label={stopRisk.label} tone={stopRisk.tone} />
          </View>

          <Text style={styles.stopDescription}>{stop.recommendedWaitArea}</Text>

          <View style={styles.arrivalRow}>
            {stop.nextArrivals.slice(0, 3).map((time, index) => (
              <View key={time} style={styles.arrivalChip}>
                <Text style={styles.arrivalLabel}>{index === 0 ? "Proximo" : "Depois"}</Text>
                <Text style={styles.arrivalValue}>{time}</Text>
              </View>
            ))}
          </View>

          <View style={styles.stopFooter}>
            <View style={styles.stopInfoPill}>
              <Ionicons color="#FFFFFF" name="shield-checkmark-outline" size={16} />
              <Text style={styles.stopInfoPillText}>{stop.safetyWindow}</Text>
            </View>

            <Pressable onPress={openSchedules} style={styles.stopLinkButton}>
              <Text style={styles.stopLinkButtonText}>Ver horarios</Text>
            </Pressable>
          </View>
        </ImageBackground>

        {latestNotice ? (
          <View style={styles.noticeCard}>
            <View style={styles.noticeIconWrap}>
              <Ionicons color={colors.route} name="megaphone-outline" size={20} />
            </View>
            <View style={styles.noticeCopy}>
              <Text style={styles.noticeEyebrow}>Atualizacao da central</Text>
              <Text style={styles.noticeTitle}>{latestNotice.title}</Text>
              <Text style={styles.noticeText}>{latestNotice.body}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.chatCard}>
          <View style={styles.chatHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>Atendimento</Text>
              <Text style={styles.sectionTitle}>Chat com a central</Text>
            </View>

            <View style={styles.chatBadge}>
              <Ionicons color={colors.route} name="wifi-outline" size={16} />
              <Text style={styles.chatBadgeText}>
                {connectionStatus === "connected" ? "Canal ativo" : "Canal indisponivel"}
              </Text>
            </View>
          </View>

          <View style={styles.stopSelectorRow}>
            {stops.map((campusStop) => {
              const isSelected = campusStop.id === selectedStopId;

              return (
                <Pressable
                  key={campusStop.id}
                  onPress={() => setSelectedStopId(campusStop.id)}
                  style={[styles.stopSelectorChip, isSelected && styles.stopSelectorChipActive]}
                >
                  <Text
                    style={[
                      styles.stopSelectorChipText,
                      isSelected && styles.stopSelectorChipTextActive,
                    ]}
                  >
                    {campusStop.shortCode}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.chatList}>
            {previewMessages.length > 0 ? (
              previewMessages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))
            ) : (
              <Text style={styles.emptyChatText}>
                Assim que a central responder ou voce enviar a primeira mensagem, a conversa aparece
                aqui.
              </Text>
            )}
          </View>

          <View style={styles.chatComposer}>
            <TextInput
              multiline
              onChangeText={setChatDraft}
              placeholder="Descreva o que esta acontecendo na parada..."
              placeholderTextColor={colors.textMuted}
              style={styles.chatInput}
              value={chatDraft}
            />

            <Pressable onPress={handleSendMessage} style={styles.sendButton}>
              <Ionicons color="#FFFFFF" name="send" size={18} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <AlertComposer
        defaultStopId={stop.id}
        onClose={() => setComposerVisible(false)}
        onSubmit={handleAlertSubmit}
        stops={stops}
        visible={isComposerVisible}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 148,
    gap: 20,
  },
  hero: {
    backgroundColor: colors.surfaceStrong,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 36,
    gap: 14,
  },
  heroEyebrow: {
    color: colors.route,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
  },
  heroBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surfaceLifted,
  },
  heroBadgeOutline: {
    borderWidth: 1,
    borderColor: colors.outline,
  },
  heroBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  heroBadgeDotOnline: {
    backgroundColor: colors.success,
  },
  heroBadgeDotOffline: {
    backgroundColor: colors.danger,
  },
  heroBadgeText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },
  statusRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },
  quickStatusCard: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    gap: 8,
  },
  quickStatusIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  quickStatusValue: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "800",
  },
  quickStatusTitle: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },
  alertCard: {
    marginHorizontal: 20,
    backgroundColor: colors.surfaceStrong,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  alertButton: {
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 12,
  },
  alertButtonText: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 2,
  },
  alertTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 28,
    fontWeight: "800",
  },
  alertDescription: {
    maxWidth: 300,
    textAlign: "center",
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 25,
  },
  stopCard: {
    marginHorizontal: 20,
    minHeight: 280,
    borderRadius: 30,
    padding: 20,
    gap: 16,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  stopImage: {
    borderRadius: 30,
  },
  stopOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  stopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    zIndex: 1,
  },
  stopHeaderCopy: {
    flex: 1,
    gap: 6,
  },
  stopEyebrow: {
    color: "#CCCCCC",
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  stopTitle: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: 29,
    lineHeight: 31,
    fontWeight: "800",
  },
  stopMeta: {
    color: "#DDDDDD",
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "700",
  },
  stopDescription: {
    zIndex: 1,
    color: "#FFFFFF",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  arrivalRow: {
    zIndex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  arrivalChip: {
    minWidth: 92,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    gap: 4,
  },
  arrivalLabel: {
    color: "#CCCCCC",
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  arrivalValue: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: "800",
  },
  stopFooter: {
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  stopInfoPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  stopInfoPillText: {
    color: "#FFFFFF",
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },
  stopLinkButton: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.brand,
  },
  stopLinkButtonText: {
    color: "#FFF",
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: "800",
  },
  noticeCard: {
    marginHorizontal: 20,
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#FFF4EB",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F5D6B8",
  },
  noticeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  noticeCopy: {
    flex: 1,
    gap: 6,
  },
  noticeEyebrow: {
    color: colors.route,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  noticeTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 21,
    fontWeight: "800",
  },
  noticeText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  chatCard: {
    marginHorizontal: 20,
    backgroundColor: colors.surfaceStrong,
    borderRadius: 28,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  sectionEyebrow: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 28,
    fontWeight: "800",
  },
  chatBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.brandSoft,
  },
  chatBadgeText: {
    color: colors.brandDeep,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },
  stopSelectorRow: {
    flexDirection: "row",
    gap: 10,
  },
  stopSelectorChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surfaceLifted,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  stopSelectorChipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  stopSelectorChipText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "800",
  },
  stopSelectorChipTextActive: {
    color: "#FFFFFF",
  },
  chatList: {
    gap: 12,
  },
  emptyChatText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  chatComposer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  chatInput: {
    flex: 1,
    minHeight: 58,
    maxHeight: 120,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surfaceLifted,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: "top",
  },
  sendButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
});
