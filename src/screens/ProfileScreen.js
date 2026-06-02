import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { API_URL } from "../config/runtime";
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

function ProfileAction({ danger, icon, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.profileAction}>
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

function buildInitials(fullName) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileScreen({ state }) {
  const { alerts, chatMessages, clearProfile, connectionStatus, profile } = state;
  const [notifAlerts, setNotifAlerts] = useState(true);
  const [notifHardware, setNotifHardware] = useState(true);
  const [notifSupport, setNotifSupport] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);

  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter((alert) => alert.status !== "resolvido").length;
  const totalMessages = chatMessages.length;
  const initials = buildInitials(profile?.fullName ?? "Safe Stop");

  const handleSignOut = async () => {
    await clearProfile();
    Alert.alert("Cadastro removido", "Os dados locais foram apagados do dispositivo.");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MINHA CONTA</Text>
        <Text style={styles.title}>Perfil operacional</Text>
        <Text style={styles.subtitle}>
          O cadastro abaixo e o mesmo enviado para o backend Python quando o app abre e restabelece
          a conexao em tempo real.
        </Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || "SS"}</Text>
        </View>

        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>{profile?.fullName ?? "Usuario UFRN"}</Text>
          <Text style={styles.profileEmail}>{profile?.ufrnId ?? "Vinculo nao informado"}</Text>

          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>
              {connectionStatus === "connected" ? "Conectado a central" : "Aguardando servidor"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard accent={colors.route} label="Alertas enviados" value={totalAlerts} />
        <SummaryCard accent={colors.info} label="Mensagens" value={totalMessages} />
        <SummaryCard accent={colors.success} label="Alertas ativos" value={activeAlerts} />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionEyebrow}>Cadastro local</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Contato de emergencia</Text>
          <Text style={styles.infoValue}>{profile?.emergencyContact ?? "Nao informado"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Backend</Text>
          <Text style={styles.infoValue}>{connectionStatus}</Text>
        </View>
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
          description="Receba aviso automatico quando um totem ESP32 disparar emergencia."
          label="Eventos do hardware"
          onToggle={setNotifHardware}
          value={notifHardware}
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
        <ProfileAction
          icon="server-outline"
          label={`Servidor: ${API_URL.replace(/^https?:\/\//, "")}`}
          onPress={() => {}}
        />
        <ProfileAction
          icon="shield-outline"
          label="Canal protegido via Socket.IO"
          onPress={() => {}}
        />
        <ProfileAction danger icon="trash-outline" label="Apagar cadastro local" onPress={handleSignOut} />
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
    color: "#E8F1FF",
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
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
    gap: 4,
  },
  infoLabel: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  infoValue: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: "700",
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
