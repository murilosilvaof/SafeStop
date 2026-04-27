import React, { useState } from "react";
import {
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
import { StatusPill } from "../components/StatusPill";
import { colors, fonts } from "../constants/theme";
import { riskMeta } from "../data/mockData";

const ectHeroImage = require("../../assets/ect-campus-banner.png");

function QuickActionCard({ description, icon, onPress, title }) {
  return (
    <Pressable onPress={onPress} style={styles.quickActionCard}>
      <View style={styles.quickActionIcon}>
        <Ionicons color={colors.route} name={icon} size={24} />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionText}>{description}</Text>
    </Pressable>
  );
}

export function HomeScreen({ navigation, state }) {
  const {
    alerts,
    chatMessages,
    notices,
    sendChatMessage,
    setSelectedStopId,
    stops,
    submitAlert,
  } = state;
  const [chatDraft, setChatDraft] = useState("");
  const [isComposerVisible, setComposerVisible] = useState(false);

  const ectStop = stops.find((stop) => stop.id === "ect") ?? stops[0];

  if (!ectStop) {
    return null;
  }

  const ectRisk = riskMeta[ectStop.riskLevel];
  const activeEctAlerts = alerts.filter(
    (alert) => alert.stopId === ectStop.id && alert.status !== "resolvido"
  );
  const previewMessages = chatMessages.slice(-3);
  const latestNotice = notices[0];

  const handleAlertSubmit = (alertData) => {
    submitAlert(alertData);
    setComposerVisible(false);
  };

  const handleSendMessage = () => {
    const nextMessage = chatDraft.trim();

    if (!nextMessage) {
      return;
    }

    sendChatMessage(nextMessage);
    setChatDraft("");
  };

  const openSchedules = () => {
    setSelectedStopId(ectStop.id);
    navigation.navigate("Horarios");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>SAFE STOP | ALERTA</Text>
          <Text style={styles.heroTitle}>Central Atendimento</Text>
          <Text style={styles.heroSubtitle}>
            Acione ajuda imediata na parada da ECT, acompanhe o ponto monitorado e fale com a
            central no mesmo lugar.
          </Text>

          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <View style={styles.heroBadgeDot} />
              <Text style={styles.heroBadgeText}>Central online</Text>
            </View>

            <View style={[styles.heroBadge, styles.heroBadgeOutline]}>
              <Ionicons color="#FFFFFF" name="notifications-outline" size={16} />
              <Text style={styles.heroBadgeText}>{activeEctAlerts.length} alertas ativos</Text>
            </View>
          </View>
        </View>

        <View style={styles.alertCard}>
          <View style={styles.alertRingOuter}>
            <View style={styles.alertRingMiddle}>
              <Pressable onPress={() => setComposerVisible(true)} style={styles.alertButton}>
                <Ionicons color="#FFFFFF" name="warning" size={42} />
                <Text style={styles.alertButtonText}>ALERTA</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.alertTitle}>Fale agora conosco!</Text>
          <Text style={styles.alertDescription}>
            Toque no botao para registrar o risco, avisar a comunidade e iniciar o atendimento da
            seguranca.
          </Text>
        </View>

        <View style={styles.quickActionRow}>
          <QuickActionCard
            description="Deixe pronta uma mensagem para continuar o atendimento pelo WhatsApp."
            icon="logo-whatsapp"
            onPress={() => setChatDraft("Preciso continuar o atendimento pelo WhatsApp.")}
            title="WhatsApp"
          />
          <QuickActionCard
            description="Prepare uma solicitacao para enviar os detalhes deste caso por e-mail."
            icon="mail-outline"
            onPress={() => setChatDraft("Quero registrar este atendimento tambem por e-mail.")}
            title="E-mail"
          />
        </View>

        <ImageBackground imageStyle={styles.stopImage} source={ectHeroImage} style={styles.stopCard}>
          <View style={styles.stopOverlay} />

          <View style={styles.stopHeader}>
            <View style={styles.stopHeaderCopy}>
              <Text style={styles.stopEyebrow}>Parada monitorada</Text>
              <Text style={styles.stopTitle}>{ectStop.name}</Text>
              <Text style={styles.stopMeta}>
                {ectStop.zone} | {ectStop.routeName}
              </Text>
            </View>
            <StatusPill label={ectRisk.label} tone={ectRisk.tone} />
          </View>

          <Text style={styles.stopDescription}>{ectStop.recommendedWaitArea}</Text>

          <View style={styles.arrivalRow}>
            {ectStop.nextArrivals.slice(0, 3).map((time, index) => (
              <View key={time} style={styles.arrivalChip}>
                <Text style={styles.arrivalLabel}>{index === 0 ? "Proximo" : "Depois"}</Text>
                <Text style={styles.arrivalValue}>{time}</Text>
              </View>
            ))}
          </View>

          <View style={styles.stopFooter}>
            <View style={styles.stopInfoPill}>
              <Ionicons color="#FFFFFF" name="shield-checkmark-outline" size={16} />
              <Text style={styles.stopInfoPillText}>{ectStop.safetyWindow}</Text>
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
              <Text style={styles.sectionTitle}>Chat da central</Text>
            </View>

            <View style={styles.chatBadge}>
              <Ionicons color={colors.route} name="chatbubble-ellipses-outline" size={16} />
              <Text style={styles.chatBadgeText}>{chatMessages.length} mensagens</Text>
            </View>
          </View>

          <View style={styles.chatList}>
            {previewMessages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} />
            ))}
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
        defaultStopId={ectStop.id}
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
    backgroundColor: colors.route,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 120,
    gap: 14,
  },
  heroEyebrow: {
    color: "#FFD8D8",
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#FFF0F0",
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
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  heroBadgeOutline: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
  },
  heroBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  heroBadgeText: {
    color: "#FFFFFF",
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },
  alertCard: {
    marginHorizontal: 20,
    marginTop: -88,
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
  alertRingOuter: {
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#EFE6DE",
    alignItems: "center",
    justifyContent: "center",
  },
  alertRingMiddle: {
    width: 176,
    height: 176,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#1B1B1B",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  alertButton: {
    width: 132,
    height: 132,
    borderRadius: 999,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  alertButtonText: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: "800",
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
  quickActionRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.surfaceStrong,
    borderRadius: 22,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.outline,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  quickActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F0",
  },
  quickActionTitle: {
    color: colors.route,
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "800",
  },
  quickActionText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
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
    backgroundColor: "rgba(41, 4, 4, 0.58)",
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
    color: "#FFD1D1",
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
    color: "#F5EDED",
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
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    gap: 4,
  },
  arrivalLabel: {
    color: "#FFE4E4",
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
    backgroundColor: "rgba(255, 255, 255, 0.14)",
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
    backgroundColor: "#FFFFFF",
  },
  stopLinkButtonText: {
    color: colors.route,
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
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  sectionEyebrow: {
    color: colors.route,
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
    backgroundColor: "#FFF0F0",
  },
  chatBadgeText: {
    color: colors.route,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },
  chatList: {
    gap: 12,
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
    backgroundColor: colors.route,
    alignItems: "center",
    justifyContent: "center",
  },
});
