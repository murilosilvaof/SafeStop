import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AlertComposer } from "./src/components/AlertComposer";
import { AlertFeedItem } from "./src/components/AlertFeedItem";
import { ChatMessageBubble } from "./src/components/ChatMessageBubble";
import { MetricCard } from "./src/components/MetricCard";
import { NoticeItem } from "./src/components/NoticeItem";
import { SectionCard } from "./src/components/SectionCard";
import { StatusPill } from "./src/components/StatusPill";
import { colors, fonts } from "./src/constants/theme";
import { riskMeta } from "./src/data/mockData";
import { useSafeStopState } from "./src/hooks/useSafeStopState";

const ectHeroImage = require("./assets/ect-campus-banner.png");

export default function App() {
  const {
    alerts,
    chatMessages,
    confirmAlert,
    lastSentAlert,
    notices,
    selectedStop,
    sendChatMessage,
    stops,
    submitAlert,
  } = useSafeStopState();

  const [chatDraft, setChatDraft] = useState("");
  const [isComposerVisible, setComposerVisible] = useState(false);

  const activeAlerts = alerts.filter((alert) => alert.status !== "resolvido");
  const totalWatchers = stops.reduce((sum, stop) => sum + stop.activeUsers, 0);
  const totalConfirmations = alerts.reduce((sum, alert) => sum + alert.confirmations, 0);
  const selectedRisk = riskMeta[selectedStop.riskLevel];

  const metrics = [
    {
      id: "active-alerts",
      label: "Alertas ativos",
      value: String(activeAlerts.length).padStart(2, "0"),
      hint: "Ocorrencias abertas na parada piloto",
      tone: "danger",
    },
    {
      id: "watchers",
      label: "Rede presente",
      value: String(totalWatchers),
      hint: "Pessoas acompanhando a ECT agora",
      tone: "info",
    },
    {
      id: "confirmations",
      label: "Confirmacoes",
      value: String(totalConfirmations),
      hint: "Sinais cruzados pela comunidade",
      tone: "success",
    },
  ];

  const operationHighlights = [
    {
      id: "arrivals",
      title: "Proximos circulares",
      value: selectedStop.nextArrivals[0],
      detail: `Depois: ${selectedStop.nextArrivals.slice(1).join(" / ")}`,
    },
    {
      id: "patrol",
      title: "Chegada da ronda",
      value: selectedStop.patrolEta,
      detail: selectedStop.patrolWindow,
    },
    {
      id: "safe-wait",
      title: "Espera recomendada",
      value: "Abrigo central",
      detail: selectedStop.recommendedWaitArea,
    },
  ];

  const handleSubmitAlert = (payload) => {
    submitAlert(payload);
    setComposerVisible(false);
  };

  const handleSendChat = () => {
    if (!chatDraft.trim()) {
      return;
    }

    sendChatMessage(chatDraft.trim());
    setChatDraft("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.shell}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>SAFE STOP | CIRCULAR UFRN</Text>
            <Text style={styles.title}>Protecao imediata na parada da ECT</Text>
            <Text style={styles.subtitle}>
              Parada da Escola de Ciencias e Tecnologia da UFRN monitorada em tempo real por usuarios, equipe de seguranca e sistema de resposta automatizado, para garantir que voce tenha a informacao e o apoio necessario para decidir esperar o circular com mais seguranca ou registrar uma ocorrencia em caso de risco.
            </Text>
          </View>

          <View style={styles.heroSection}>
            <ImageBackground
              imageStyle={styles.heroImageInner}
              source={ectHeroImage}
              style={styles.heroImage}
            >
              <View style={styles.heroOverlay} />

              <View style={styles.heroTopRow}>
                <View style={styles.heroTag}>
                  <Text style={styles.heroTagText}>PARADA PILOTO</Text>
                </View>
                <View style={styles.heroTagDark}>
                  <Text style={styles.heroTagDarkText}>{selectedStop.routeName}</Text>
                </View>
              </View>

              <View style={styles.heroContent}>
                <View style={styles.heroTextBlock}>
                  <Text style={styles.heroLabel}>{selectedStop.heroCaption}</Text>
                  <Text style={styles.heroTitle}>{selectedStop.name}</Text>
                  <Text style={styles.heroMeta}>
                    {selectedStop.zone} | {selectedStop.routeDirection}
                  </Text>
                  <Text style={styles.heroDescription}>{selectedStop.description}</Text>
                </View>

                <View style={styles.heroPillRow}>
                  <StatusPill label={selectedRisk.label} tone={selectedRisk.tone} />
                  <View style={styles.inlineSignal}>
                    <View style={styles.inlineSignalDot} />
                    <Text style={styles.inlineSignalText}>{selectedStop.safetyWindow}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.arrivalRow}>
                {selectedStop.nextArrivals.map((time, index) => (
                  <View key={time} style={styles.arrivalChip}>
                    <Text style={styles.arrivalLabel}>{index === 0 ? "Chega em" : "Depois"}</Text>
                    <Text style={styles.arrivalValue}>{time}</Text>
                  </View>
                ))}
              </View>
            </ImageBackground>

            <View style={styles.commandDeck}>
              <View style={styles.commandHeader}>
                <View style={styles.commandBadge}>
                  <Text style={styles.commandBadgeText}>SOS</Text>
                </View>
                <View style={styles.commandTextBlock}>
                  <Text style={styles.commandEyebrow}>Acionamento principal</Text>
                  <Text style={styles.commandTitle}>Botao de alerta da parada da ECT</Text>
                  <Text style={styles.commandDescription}>
                    Toque para registrar risco, compartilhar o motivo e disparar o aviso para
                    usuarios proximos e para a seguranca patrimonial.
                  </Text>
                </View>
              </View>

              <Pressable style={styles.alertButton} onPress={() => setComposerVisible(true)}>
                <View style={styles.alertButtonIcon}>
                  <Text style={styles.alertButtonIconText}>!</Text>
                </View>
                <View style={styles.alertButtonCopy}>
                  <Text style={styles.alertButtonTitle}>Acionar alerta agora</Text>
                  <Text style={styles.alertButtonText}>
                    Envio prioritario para a rede SafeStop, totem da parada e equipe de ronda.
                  </Text>
                </View>
              </Pressable>

              <View style={styles.commandMetaRow}>
                <View style={styles.commandMetaCard}>
                  <Text style={styles.commandMetaLabel}>Rede ativa</Text>
                  <Text style={styles.commandMetaValue}>{selectedStop.activeUsers} pessoas online</Text>
                </View>
                <View style={styles.commandMetaCard}>
                  <Text style={styles.commandMetaLabel}>Totem piloto</Text>
                  <Text style={styles.commandMetaValue}>{selectedStop.totemStatus}</Text>
                </View>
              </View>

              {lastSentAlert ? (
                <View style={styles.dispatchCard}>
                  <Text style={styles.dispatchLabel}>Ultimo alerta enviado</Text>
                  <Text style={styles.dispatchTitle}>{lastSentAlert.stopName}</Text>
                  <Text style={styles.dispatchText}>{lastSentAlert.message}</Text>
                  <Text style={styles.dispatchMeta}>{lastSentAlert.createdAt}</Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.metricsRow}>
            {metrics.map((metric) => (
              <MetricCard
                key={metric.id}
                hint={metric.hint}
                label={metric.label}
                tone={metric.tone}
                value={metric.value}
              />
            ))}
          </View>

          <SectionCard
            eyebrow="Operacao ECT"
            title="Contexto rapido da parada"
            description="Tudo o que o usuario precisa ver antes de decidir esperar o circular, mudar de posicao ou registrar uma ocorrencia."
            tone="sea"
          >
            <View style={styles.operationGrid}>
              {operationHighlights.map((item) => (
                <View key={item.id} style={styles.operationCard}>
                  <Text style={styles.operationLabel}>{item.title}</Text>
                  <Text style={styles.operationValue}>{item.value}</Text>
                  <Text style={styles.operationText}>{item.detail}</Text>
                </View>
              ))}
            </View>

            <View style={styles.routeBar}>
              <View style={styles.routeIndicator} />
              <View style={styles.routeCopy}>
                <Text style={styles.routeTitle}>{selectedStop.routeName}</Text>
                <Text style={styles.routeText}>
                  {selectedStop.coordinates} | {selectedStop.routeDirection}
                </Text>
              </View>
            </View>
          </SectionCard>

          <SectionCard
            eyebrow="Visao da comunidade"
            title="Alertas recentes da ECT"
            description="Ocorrencias registradas para a parada piloto, com leitura rapida de gravidade, status de resposta e confirmacoes."
            tone="sun"
          >
            <View style={styles.alertList}>
              {alerts.map((alert) => (
                <AlertFeedItem key={alert.id} alert={alert} onConfirm={confirmAlert} />
              ))}
            </View>
          </SectionCard>

          <SectionCard
            eyebrow="Canal direto"
            title="Central de apoio patrimonial"
            description="Chat enxuto para manter o usuario orientado enquanto a equipe se desloca para a parada."
            tone="brick"
          >
            <View style={styles.chatList}>
              {chatMessages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}
            </View>

            <View style={styles.chatComposer}>
              <TextInput
                onChangeText={setChatDraft}
                placeholder="Compartilhe detalhes adicionais com a seguranca"
                placeholderTextColor={colors.textMuted}
                style={styles.chatInput}
                value={chatDraft}
              />

              <Pressable onPress={handleSendChat} style={styles.chatButton}>
                <Text style={styles.chatButtonText}>Enviar</Text>
              </Pressable>
            </View>
          </SectionCard>

          <SectionCard
            eyebrow="Prevencao"
            title="Avisos operacionais"
            description="Mensagens preventivas para quem usa o circular e precisa decidir onde esperar com mais seguranca."
            tone="mint"
          >
            <View style={styles.noticeList}>
              {notices.map((notice) => (
                <NoticeItem key={notice.id} notice={notice} />
              ))}
            </View>
          </SectionCard>
        </ScrollView>

        <AlertComposer
          defaultStopId={selectedStop.id}
          onClose={() => setComposerVisible(false)}
          onSubmit={handleSubmitAlert}
          stops={stops}
          visible={isComposerVisible}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  shell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
    gap: 20,
  },
  header: {
    gap: 12,
  },
  eyebrow: {
    color: colors.brandSoft,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 35,
    lineHeight: 40,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
  },
  heroSection: {
    gap: 16,
  },
  heroImage: {
    minHeight: 390,
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "space-between",
    padding: 20,
  },
  heroImageInner: {
    borderRadius: 30,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  heroTopRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    zIndex: 1,
  },
  heroTag: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroTagText: {
    color: colors.background,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "800",
  },
  heroTagDark: {
    backgroundColor: "rgba(8, 16, 21, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroTagDarkText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: "700",
  },
  heroContent: {
    zIndex: 1,
    gap: 16,
  },
  heroTextBlock: {
    gap: 8,
  },
  heroLabel: {
    color: colors.brandSoft,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 31,
    lineHeight: 34,
    fontWeight: "800",
  },
  heroMeta: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "700",
  },
  heroDescription: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
  },
  heroPillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  inlineSignal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(8, 16, 21, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  inlineSignalDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.success,
  },
  inlineSignalText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },
  arrivalRow: {
    zIndex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  arrivalChip: {
    minWidth: 100,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(8, 16, 21, 0.76)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    gap: 4,
  },
  arrivalLabel: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  arrivalValue: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: "800",
  },
  commandDeck: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    padding: 20,
    gap: 16,
  },
  commandHeader: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  commandBadge: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(240, 68, 68, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(240, 68, 68, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  commandBadgeText: {
    color: colors.dangerSoft,
    fontFamily: fonts.display,
    fontSize: 17,
    fontWeight: "800",
  },
  commandTextBlock: {
    flex: 1,
    gap: 6,
  },
  commandEyebrow: {
    color: colors.dangerSoft,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  commandTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
  },
  commandDescription: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  alertButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.route,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  alertButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.routeDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  alertButtonIconText: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 28,
    fontWeight: "800",
  },
  alertButtonCopy: {
    flex: 1,
    gap: 4,
  },
  alertButtonTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "800",
  },
  alertButtonText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  commandMetaRow: {
    gap: 10,
  },
  commandMetaCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 14,
    gap: 6,
  },
  commandMetaLabel: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  commandMetaValue: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
  },
  dispatchCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  dispatchLabel: {
    color: colors.brandSoft,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  dispatchTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: "800",
  },
  dispatchText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  dispatchMeta: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  metricsRow: {
    gap: 12,
  },
  operationGrid: {
    gap: 12,
  },
  operationCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 16,
    gap: 6,
  },
  operationLabel: {
    color: colors.brandSoft,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  operationValue: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "800",
  },
  operationText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  routeBar: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 16,
    alignItems: "center",
  },
  routeIndicator: {
    width: 12,
    alignSelf: "stretch",
    borderRadius: 999,
    backgroundColor: colors.route,
  },
  routeCopy: {
    flex: 1,
    gap: 6,
  },
  routeTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 19,
    fontWeight: "800",
  },
  routeText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  alertList: {
    gap: 12,
  },
  chatList: {
    gap: 12,
  },
  chatComposer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  chatInput: {
    flex: 1,
    minHeight: 54,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 18,
    paddingHorizontal: 16,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  chatButton: {
    backgroundColor: colors.brand,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  chatButtonText: {
    color: colors.background,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "800",
  },
  noticeList: {
    gap: 12,
  },
});
