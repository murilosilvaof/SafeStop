import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Switch,
} from "react-native";
import { globalStyles as styles } from "../styles/globalStyles";

function SettingRow({ label, description, value, onToggle }) {
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: "#1E3040",
    }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.heroMeta, { fontSize: 15 }]}>{label}</Text>
        {description && (
          <Text style={[styles.subtitle, { fontSize: 13 }]}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#1E3040", true: "#1D4D6B" }}
        thumbColor={value ? "#F3C548" : "#92A3AE"}
      />
    </View>
  );
}

function MenuRow({ label, icon, onPress, danger }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#1E3040",
      }}
    >
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text style={[styles.heroMeta, {
        flex: 1,
        fontSize: 15,
        color: danger ? "#F04444" : undefined,
      }]}>
        {label}
      </Text>
      <Text style={{ color: "#92A3AE", fontSize: 18 }}>›</Text>
    </Pressable>
  );
}

export function ProfileScreen({ state }) {
  const { alerts } = state;

  const [notifAlerts, setNotifAlerts] = useState(true);
  const [notifArrivals, setNotifArrivals] = useState(true);
  const [notifPatrol, setNotifPatrol] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);

  const totalAlerts = alerts?.length || 0;
  const resolvedAlerts = alerts?.filter((a) => a.status === "resolvido").length || 0;

  return (
    <ScrollView
      style={styles.shell}
      contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MINHA CONTA</Text>
        <Text style={styles.title}>Perfil</Text>
      </View>

      {/* Avatar + info do usuário */}
      <View style={{
        backgroundColor: "#0D1B23",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#1E3040",
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
      }}>
        <View style={{
          width: 64,
          height: 64,
          borderRadius: 999,
          backgroundColor: "#1D4D6B",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: "#F3C548",
        }}>
          <Text style={{ fontSize: 28 }}>👤</Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[styles.commandTitle, { fontSize: 20 }]}>Usuário UFRN</Text>
          <Text style={[styles.subtitle, { fontSize: 13 }]}>usuario@ufrn.br</Text>
          <View style={{
            backgroundColor: "#1D4D6B",
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 4,
            alignSelf: "flex-start",
            marginTop: 2,
          }}>
            <Text style={{ color: "#C8E8FF", fontSize: 11, fontWeight: "800" }}>
              MEMBRO COMUNIDADE
            </Text>
          </View>
        </View>
      </View>

      {/* Stats do usuário */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={[styles.operationCard, { flex: 1, alignItems: "center" }]}>
          <Text style={[styles.operationValue, { color: "#F3C548" }]}>{totalAlerts}</Text>
          <Text style={styles.operationLabel}>Alertas</Text>
        </View>
        <View style={[styles.operationCard, { flex: 1, alignItems: "center" }]}>
          <Text style={[styles.operationValue, { color: "#34D399" }]}>{resolvedAlerts}</Text>
          <Text style={styles.operationLabel}>Resolvidos</Text>
        </View>
        <View style={[styles.operationCard, { flex: 1, alignItems: "center" }]}>
          <Text style={[styles.operationValue, { color: "#60A5FA" }]}>12</Text>
          <Text style={styles.operationLabel}>Confirmados</Text>
        </View>
      </View>

      {/* Notificações */}
      <View style={{
        backgroundColor: "#0D1B23",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#1E3040",
        paddingHorizontal: 20,
        paddingTop: 4,
      }}>
        <Text style={[styles.eyebrow, { paddingTop: 16, paddingBottom: 4 }]}>NOTIFICAÇÕES</Text>
        <SettingRow
          label="Alertas da comunidade"
          description="Receba quando outros usuários acionarem alertas"
          value={notifAlerts}
          onToggle={setNotifAlerts}
        />
        <SettingRow
          label="Chegada de ônibus"
          description="Aviso 5 minutos antes da chegada"
          value={notifArrivals}
          onToggle={setNotifArrivals}
        />
        <SettingRow
          label="Patrulha próxima"
          description="Aviso quando a segurança estiver na área"
          value={notifPatrol}
          onToggle={setNotifPatrol}
        />
      </View>

      {/* Privacidade */}
      <View style={{
        backgroundColor: "#0D1B23",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#1E3040",
        paddingHorizontal: 20,
        paddingTop: 4,
      }}>
        <Text style={[styles.eyebrow, { paddingTop: 16, paddingBottom: 4 }]}>PRIVACIDADE</Text>
        <SettingRow
          label="Compartilhar localização"
          description="Necessário para alertas precisos"
          value={shareLocation}
          onToggle={setShareLocation}
        />
      </View>

      {/* Menu de opções */}
      <View style={{
        backgroundColor: "#0D1B23",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#1E3040",
        paddingHorizontal: 20,
        paddingTop: 4,
      }}>
        <Text style={[styles.eyebrow, { paddingTop: 16, paddingBottom: 4 }]}>MAIS</Text>
        <MenuRow label="Sobre o Safe Stop" icon="ℹ️" onPress={() => {}} />
        <MenuRow label="Termos de uso" icon="📄" onPress={() => {}} />
        <MenuRow label="Fale com a equipe" icon="💬" onPress={() => {}} />
        <MenuRow label="Sair da conta" icon="🚪" onPress={() => {}} danger />
      </View>

      {/* Versão */}
      <Text style={[styles.dispatchMeta, { textAlign: "center" }]}>
        Safe Stop v1.0.0 · UFRN · Circular Natal
      </Text>
    </ScrollView>
  );
}