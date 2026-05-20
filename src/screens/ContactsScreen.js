import React, { useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fonts } from "../constants/theme";

function ActionButton({ icon, label, onPress, secondary = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.actionButton, secondary && styles.actionButtonSecondary]}
    >
      <Ionicons
        color={secondary ? colors.text : "#FFFFFF"}
        name={icon}
        size={18}
      />
      <Text style={[styles.actionButtonText, secondary && styles.actionButtonTextSecondary]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ContactsScreen({ state }) {
  const { profile, updateEmergencyContact } = state;
  const [draftContact, setDraftContact] = useState(profile?.emergencyContact ?? "");

  const savedEmergencyContact = profile?.emergencyContact ?? "";

  const handleSave = async () => {
    const trimmedContact = draftContact.trim();

    if (!trimmedContact) {
      Alert.alert("Contato vazio", "Informe um numero antes de salvar.");
      return;
    }

    await updateEmergencyContact(trimmedContact);
    Alert.alert("Contato atualizado", "O numero foi salvo no AsyncStorage do dispositivo.");
  };

  const handleOpenDialer = async () => {
    if (!savedEmergencyContact) {
      Alert.alert("Sem contato", "Cadastre um numero de emergencia primeiro.");
      return;
    }

    await Linking.openURL(`tel:${savedEmergencyContact}`);
  };

  const handleOpenWhatsapp = async () => {
    if (!savedEmergencyContact) {
      Alert.alert("Sem contato", "Cadastre um numero de emergencia primeiro.");
      return;
    }

    const digitsOnly = savedEmergencyContact.replace(/\D/g, "");
    await Linking.openURL(
      `https://wa.me/${digitsOnly}?text=${encodeURIComponent("SafeStop: preciso de ajuda agora.")}`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CONTATOS</Text>
        <Text style={styles.title}>Contato de emergencia salvo localmente</Text>
        <Text style={styles.subtitle}>
          Esse valor e recuperado do AsyncStorage logo na abertura do app e fica pronto para uso em
          um toque.
        </Text>
      </View>

      <View style={styles.savedCard}>
        <Text style={styles.savedLabel}>Numero recuperado do dispositivo</Text>
        <Text style={styles.savedValue}>{savedEmergencyContact || "Nenhum numero cadastrado"}</Text>
        <Text style={styles.savedHint}>
          Vinculo atual: {profile?.ufrnId ?? "nao informado"} | Usuario: {profile?.fullName ?? "nao informado"}
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Atualizar numero</Text>
        <TextInput
          keyboardType="phone-pad"
          onChangeText={setDraftContact}
          placeholder="Ex: +55 84 99999-0000"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={draftContact}
        />

        <ActionButton icon="save-outline" label="Salvar no dispositivo" onPress={handleSave} />
      </View>

      <View style={styles.quickActionsCard}>
        <Text style={styles.sectionTitle}>Acionamento rapido</Text>
        <View style={styles.actionRow}>
          <ActionButton icon="call-outline" label="Ligar agora" onPress={handleOpenDialer} />
          <ActionButton
            icon="logo-whatsapp"
            label="WhatsApp"
            onPress={handleOpenWhatsapp}
            secondary
          />
        </View>
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
    gap: 18,
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
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
  savedCard: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 28,
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  savedLabel: {
    color: colors.route,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  savedValue: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
  },
  savedHint: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 28,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  quickActionsCard: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 28,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "800",
  },
  input: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    backgroundColor: colors.surfaceLifted,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 18,
    backgroundColor: colors.brand,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionButtonSecondary: {
    backgroundColor: colors.surfaceLifted,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "800",
  },
  actionButtonTextSecondary: {
    color: colors.text,
  },
});
