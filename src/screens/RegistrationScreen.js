import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, fonts } from "../constants/theme";

function buildInitials(fullName) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("");
}

export function RegistrationScreen({ onSubmit }) {
  const [fullName, setFullName] = useState("");
  const [ufrnId, setUfrnId] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const initials = useMemo(() => buildInitials(fullName || "Safe Stop"), [fullName]);

  const handleSubmit = async () => {
    const trimmedName = fullName.trim();
    const trimmedUfrnId = ufrnId.trim();
    const trimmedEmergencyContact = emergencyContact.trim();

    if (!trimmedName || !trimmedUfrnId || !trimmedEmergencyContact) {
      Alert.alert("Cadastro incompleto", "Preencha nome, vinculo UFRN e contato de emergencia.");
      return;
    }

    await onSubmit({
      fullName: trimmedName,
      ufrnId: trimmedUfrnId,
      emergencyContact: trimmedEmergencyContact,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>SAFE STOP UFRN</Text>
          <Text style={styles.title}>Cadastro inicial do usuario</Text>
          <Text style={styles.subtitle}>
            Esse cadastro local identifica o estudante para a central e salva o contato de
            emergencia de forma permanente no dispositivo.
          </Text>

          <View style={styles.identityCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || "SS"}</Text>
            </View>
            <View style={styles.identityCopy}>
              <Text style={styles.identityTitle}>Pronto para atendimento real</Text>
              <Text style={styles.identityText}>
                O numero salvo aqui sera recuperado automaticamente na tela de contatos.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Dados obrigatorios</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              autoCapitalize="words"
              onChangeText={setFullName}
              placeholder="Ex: Maria Clara de Souza"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              value={fullName}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Matricula / vinculo UFRN</Text>
            <TextInput
              autoCapitalize="characters"
              onChangeText={setUfrnId}
              placeholder="Ex: 20241234567"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              value={ufrnId}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Numero de contato de emergencia</Text>
            <TextInput
              keyboardType="phone-pad"
              onChangeText={setEmergencyContact}
              placeholder="Ex: +55 84 99999-0000"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              value={emergencyContact}
            />
          </View>

          <Pressable onPress={handleSubmit} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Salvar cadastro e entrar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 40,
    gap: 20,
    justifyContent: "center",
  },
  heroCard: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 30,
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
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
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
  },
  identityCard: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: colors.surfaceLifted,
    padding: 18,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 999,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "800",
  },
  identityCopy: {
    flex: 1,
    gap: 4,
  },
  identityTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: "800",
  },
  identityText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 30,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "800",
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    backgroundColor: colors.surfaceLifted,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
  },
  primaryButton: {
    marginTop: 6,
    borderRadius: 20,
    backgroundColor: colors.brand,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: "800",
  },
});
