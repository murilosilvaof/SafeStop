import React, { useState } from "react";
import {
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
import { riskMeta } from "./src/data/mockData";
import { colors, fonts } from "./src/constants/theme";
import { useSafeStopState } from "./src/hooks/useSafeStopState";

export default function App() {
  const {
    alerts,
    chatMessages,
    confirmAlert,
    lastSentAlert,
    notices,
    selectedStop,
    selectedStopId,
    sendChatMessage,
    setSelectedStopId,
    stops,
    submitAlert,
  } = useSafeStopState();

  const [chatDraft, setChatDraft] = useState("");
  const [isComposerVisible, setComposerVisible] = useState(false);

  const activeAlerts = alerts.filter((alert) => alert.status !== "resolvido");
  const totalWatchers = stops.reduce((sum, stop) => sum + stop.activeUsers, 0);
  const communityReach = new Set(alerts.map((alert) => alert.stopId)).size;
  const selectedRisk = riskMeta[selectedStop.riskLevel];

  const metrics = [
    {
      id: "active-alerts",
      label: "Alertas ativos",
      value: String(activeAlerts.length).padStart(2, "0"),
      hint: "Ocorrências em acompanhamento agora",
      tone: "danger",
    },
    {
      id: "watchers",
      label: "Usuários monitorando",
      value: String(totalWatchers),
      hint: "App e totems acompanhando o entorno",
      tone: "info",
    },
    {
      id: "reach",
      label: "Paradas com cobertura",
      value: String(communityReach),
      hint: "Trechos sinalizados pela comunidade",
      tone: "success",
    },
  ];

  const handleSubmitAlert = (payload) => {
    submitAlert(payload);
    setSelectedStopId(payload.stopId);
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
        <View style={styles.orbTop} />
        <View style={styles.orbBottom} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>SAFE STOP UFRN</Text>
            <Text style={styles.title}>Botão de alerta para proteger as paradas do circular</Text>
            <Text style={styles.subtitle}>
              O usuário sinaliza risco na parada, compartilha o motivo e dispara o aviso para
              pessoas próximas e para a segurança patrimonial.
            </Text>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroTextBlock}>
                <Text style={styles.heroLabel}>Parada monitorada agora</Text>
                <Text style={styles.heroTitle}>{selectedStop.name}</Text>
                <Text style={styles.heroMeta}>
                  {selectedStop.zone} • {selectedStop.coordinates}
                </Text>
              </View>

              <StatusPill label={selectedRisk.label} tone={selectedRisk.tone} />
            </View>

            <Text style={styles.heroDescription}>{selectedStop.description}</Text>

            <View style={styles.heroHighlights}>
              <Text style={styles.heroHighlightText}>
                {selectedStop.activeUsers} pessoas acompanhando essa parada no momento
              </Text>
              <Text style={styles.heroHighlightDot}>•</Text>
              <Text style={styles.heroHighlightText}>Canal com segurança disponível em tempo real</Text>
            </View>

            <Pressable style={styles.alertButton} onPress={() => setComposerVisible(true)}>
              <Text style={styles.alertButtonTitle}>Acionar alerta da parada</Text>
              <Text style={styles.alertButtonText}>
                Informe o motivo, classifique o risco e compartilhe o aviso com a comunidade.
              </Text>
            </Pressable>

            {lastSentAlert ? (
              <View style={styles.dispatchCard}>
                <Text style={styles.dispatchLabel}>Último alerta enviado</Text>
                <Text style={styles.dispatchTitle}>{lastSentAlert.stopName}</Text>
                <Text style={styles.dispatchText}>{lastSentAlert.message}</Text>
                <Text style={styles.dispatchMeta}>{lastSentAlert.createdAt}</Text>
              </View>
            ) : null}
          </View>

          <SectionCard
            eyebrow="Mapa rápido"
            title="Paradas acompanhadas"
            description="Troque a parada em foco para entender como o botão principal reage conforme o contexto."
            tone="sea"
          >
            <View style={styles.stopGrid}>
              {stops.map((stop) => {
                const stopRisk = riskMeta[stop.riskLevel];
                const isSelected = stop.id === selectedStopId;

                return (
                  <Pressable
                    key={stop.id}
                    onPress={() => setSelectedStopId(stop.id)}
                    style={[styles.stopCard, isSelected && styles.stopCardSelected]}
                  >
                    <View style={styles.stopCardHeader}>
                      <Text style={styles.stopCardTitle}>{stop.name}</Text>
                      <StatusPill label={stopRisk.label} tone={stopRisk.tone} />
                    </View>
                    <Text style={styles.stopCardZone}>{stop.zone}</Text>
                    <Text style={styles.stopCardText}>{stop.description}</Text>
                  </Pressable>
                );
              })}
            </View>
          </SectionCard>

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
            eyebrow="Visão da comunidade"
            title="Alertas recentes"
            description="Cada aviso mostra o motivo informado pelo usuário, o estágio de atendimento e a confirmação de outras pessoas."
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
            title="Central de apoio"
            description="Chat simplificado entre o solicitante e a equipe de segurança para reduzir o tempo de resposta."
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
                placeholder="Compartilhe detalhes adicionais com a segurança"
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
            eyebrow="Prevenção"
            title="Notificações preventivas"
            description="Resumo de avisos que ajudam os usuários a decidir se aguardam o circular ou escolhem outra rota."
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
          defaultStopId={selectedStopId}
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
  orbTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.secondaryGlow,
    opacity: 0.28,
  },
  orbBottom: {
    position: "absolute",
    bottom: -120,
    left: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.primaryGlow,
    opacity: 0.18,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 18,
  },
  header: {
    gap: 10,
  },
  eyebrow: {
    color: colors.brand,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2.6,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
  },
  heroCard: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    gap: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.22,
    shadowRadius: 30,
    elevation: 10,
  },
  heroTopRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  heroTextBlock: {
    flex: 1,
    gap: 6,
  },
  heroLabel: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "800",
  },
  heroMeta: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  heroDescription: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
  },
  heroHighlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  heroHighlightText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: "600",
  },
  heroHighlightDot: {
    color: colors.brand,
    fontSize: 18,
    lineHeight: 18,
  },
  alertButton: {
    backgroundColor: colors.brand,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 6,
  },
  alertButtonTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: "800",
  },
  alertButtonText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
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
    color: colors.info,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
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
  stopGrid: {
    gap: 12,
  },
  stopCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 16,
    gap: 10,
  },
  stopCardSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.surfaceLifted,
  },
  stopCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  stopCardTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
  },
  stopCardZone: {
    color: colors.brandSoft,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: "700",
  },
  stopCardText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  metricsRow: {
    gap: 12,
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
    backgroundColor: colors.info,
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
