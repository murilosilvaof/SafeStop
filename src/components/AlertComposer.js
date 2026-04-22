import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, fonts } from "../constants/theme";
import { riskMeta } from "../data/mockData";
import { StatusPill } from "./StatusPill";

const severityOptions = ["monitorando", "alerta", "emergencia"];

export function AlertComposer({ defaultStopId, onClose, onSubmit, stops, visible }) {
  const [stopId, setStopId] = useState(defaultStopId);
  const [riskLevel, setRiskLevel] = useState("alerta");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setStopId(defaultStopId);
    setRiskLevel("alerta");
    setMessage("");
    setAnonymous(false);
  }, [defaultStopId, visible]);

  const handleSubmit = () => {
    if (!message.trim()) {
      return;
    }

    onSubmit({
      anonymous,
      message: message.trim(),
      riskLevel,
      stopId,
    });
  };

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.backdrop} />

        <View style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>Novo alerta</Text>
              <Text style={styles.title}>Descreva o motivo do aviso</Text>
              <Text style={styles.description}>
                Esse formulário simula o envio do alerta da parada para usuários próximos e para a
                segurança patrimonial.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Escolha a parada</Text>
              <View style={styles.optionList}>
                {stops.map((stop) => {
                  const selected = stop.id === stopId;

                  return (
                    <Pressable
                      key={stop.id}
                      onPress={() => setStopId(stop.id)}
                      style={[styles.optionCard, selected && styles.optionCardSelected]}
                    >
                      <Text style={styles.optionTitle}>{stop.name}</Text>
                      <Text style={styles.optionText}>{stop.zone}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nível do alerta</Text>
              <View style={styles.severityList}>
                {severityOptions.map((option) => {
                  const selected = option === riskLevel;
                  const optionMeta = riskMeta[option];

                  return (
                    <Pressable
                      key={option}
                      onPress={() => setRiskLevel(option)}
                      style={[styles.severityCard, selected && styles.severityCardSelected]}
                    >
                      <StatusPill label={optionMeta.label} tone={optionMeta.tone} />
                      <Text style={styles.severityText}>
                        {option === "monitorando" &&
                          "Percebeu um comportamento estranho, mas sem ameaça imediata."}
                        {option === "alerta" &&
                          "A parada parece insegura e a comunidade deve ser avisada."}
                        {option === "emergencia" &&
                          "Há indícios de risco alto e a equipe precisa agir rápido."}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mensagem do alerta</Text>
              <TextInput
                multiline
                onChangeText={setMessage}
                placeholder="Exemplo: pouca iluminação, abordagem suspeita, grupo intimidando quem espera o ônibus..."
                placeholderTextColor={colors.textMuted}
                style={styles.messageInput}
                textAlignVertical="top"
                value={message}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextBlock}>
                <Text style={styles.sectionTitle}>Enviar como anônimo</Text>
                <Text style={styles.toggleDescription}>
                  O feed público exibirá o alerta sem identificar quem acionou o botão.
                </Text>
              </View>

              <Switch
                onValueChange={setAnonymous}
                thumbColor={anonymous ? colors.brand : "#F1F5F9"}
                trackColor={{
                  false: colors.outlineStrong,
                  true: "rgba(255, 122, 26, 0.35)",
                }}
                value={anonymous}
              />
            </View>

            <View style={styles.footer}>
              <Pressable onPress={onClose} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                style={[styles.primaryButton, !message.trim() && styles.primaryButtonDisabled]}
              >
                <Text style={styles.primaryButtonText}>Enviar alerta</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2, 6, 23, 0.72)",
  },
  sheet: {
    maxHeight: "92%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surfaceStrong,
    borderTopWidth: 1,
    borderColor: colors.outlineStrong,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 18,
  },
  header: {
    gap: 8,
  },
  eyebrow: {
    color: colors.brand,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
  },
  description: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: "800",
  },
  optionList: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 14,
    gap: 4,
  },
  optionCardSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.surfaceLifted,
  },
  optionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 17,
    fontWeight: "800",
  },
  optionText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  severityList: {
    gap: 10,
  },
  severityCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 14,
    gap: 10,
  },
  severityCardSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.surfaceLifted,
  },
  severityText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  messageInput: {
    minHeight: 150,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 16,
  },
  toggleTextBlock: {
    flex: 1,
    gap: 6,
  },
  toggleDescription: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "800",
  },
  primaryButton: {
    flex: 1.2,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: colors.brand,
  },
  primaryButtonDisabled: {
    opacity: 0.48,
  },
  primaryButtonText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "800",
  },
});

