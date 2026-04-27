import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fonts } from "../constants/theme";

function SummaryCard({ accent, label, value }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={[styles.summaryValue, { color: accent }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function SettingRow({ description, label, onToggle, value }) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingCopy}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>

      <Switch
        onValueChange={onToggle}
        thumbColor={value ? "#FFFFFF" : "#F4E9E2"}
        trackColor={{ false: "#D8CCC3", true: colors.route }}
        value={value}
      />
    </View>
  );
}

function ProfileAction({ danger, icon, label }) {
  return (
    <Pressable style={styles.profileAction}>
      <View style={[styles.profileActionIcon, danger && styles.profileActionDangerIcon]}>
        <Ionicons color={danger ? colors.route : colors.text} name={icon} size={18} />
      </View>
      <Text style={[styles.profileActionLabel, danger && styles.profileActionLabelDanger]}>
        {label}
      </Text>
      <Ionicons color={colors.textMuted} name="chevron-forward" size={18} />
    </Pressable>
  );
}

export function ProfileScreen({ state }) {
  const { alerts, chatMessages } = state;
  const [notifAlerts, setNotifAlerts] = useState(true);
  const [notifSchedules, setNotifSchedules] = useState(true);
  const [notifSupport, setNotifSupport] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);

  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter((alert) => alert.status !== "resolvido").length;
  const totalMessages = chatMessages.length;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MINHA CONTA</Text>
        <Text style={styles.title}>Perfil do usuario</Text>
        <Text style={styles.subtitle}>
          Ajuste suas notificacoes, acompanhe sua atividade e mantenha os alertas do app do seu
          jeito.
        </Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SU</Text>
        </View>

        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>Usuario UFRN</Text>
          <Text style={styles.profileEmail}>usuario@ufrn.br</Text>

          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>Comunidade ativa</Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard accent={colors.route} label="Alertas enviados" value={totalAlerts} />
        <SummaryCard accent={colors.info} label="Mensagens" value={totalMessages} />
        <SummaryCard accent={colors.success} label="Alertas ativos" value={activeAlerts} />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionEyebrow}>Notificacoes</Text>
        <SettingRow
          description="Receba aviso quando a comunidade acionar um novo alerta."
          label="Alertas da comunidade"
          onToggle={setNotifAlerts}
          value={notifAlerts}
        />
        <SettingRow
          description="Seja avisado um pouco antes da chegada dos proximos onibus."
          label="Horarios dos onibus"
          onToggle={setNotifSchedules}
          value={notifSchedules}
        />
        <SettingRow
          description="Continue recebendo retorno da central sobre o seu atendimento."
          label="Atualizacoes do atendimento"
          onToggle={setNotifSupport}
          value={notifSupport}
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionEyebrow}>Privacidade</Text>
        <SettingRow
          description="Melhora a precisao do alerta quando voce estiver na parada monitorada."
          label="Compartilhar localizacao"
          onToggle={setShareLocation}
          value={shareLocation}
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionEyebrow}>Conta</Text>
        <ProfileAction icon="information-circle-outline" label="Sobre o Safe Stop" />
        <ProfileAction icon="document-text-outline" label="Termos de uso" />
        <ProfileAction icon="chatbox-ellipses-outline" label="Falar com a equipe" />
        <ProfileAction danger icon="log-out-outline" label="Sair da conta" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 148,
    gap: 20,
  },
  header: {
    gap: 8,
  },
  eyebrow: {
    color: colors.route,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
  profileCard: {
    backgroundColor: colors.route,
    borderRadius: 28,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.route,
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: "800",
  },
  profileCopy: {
    flex: 1,
    gap: 6,
  },
  profileName: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: "800",
  },
  profileEmail: {
    color: "#FFE6E6",
    fontFamily: fonts.body,
    fontSize: 14,
  },
  profileBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  profileBadgeText: {
    color: "#FFFFFF",
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surfaceStrong,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  summaryValue: {
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: "800",
  },
  summaryLabel: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  sectionCard: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    gap: 2,
  },
  sectionEyebrow: {
    color: colors.route,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  settingCopy: {
    flex: 1,
    gap: 4,
  },
  settingLabel: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: "800",
  },
  settingDescription: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
  },
  profileAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  profileActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surfaceLifted,
    alignItems: "center",
    justifyContent: "center",
  },
  profileActionDangerIcon: {
    backgroundColor: "#FFF0F0",
  },
  profileActionLabel: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: "700",
  },
  profileActionLabelDanger: {
    color: colors.route,
  },
});
