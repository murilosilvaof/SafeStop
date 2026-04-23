import React, { useState } from "react";
import { 
  ScrollView, 
  Text, 
  View, 
  Pressable, 
  ImageBackground 
} from "react-native";
import { globalStyles as styles } from "../styles/globalStyles";
import { StatusPill } from "../components/StatusPill";
import { AlertComposer } from "../components/AlertComposer";
import { riskMeta } from "../data/mockData";

const ectHeroImage = require("../../assets/ect-campus-banner.png");

export function HomeScreen({ state }) {
  const {
    selectedStop,
    stops,
    submitAlert,
    selectedStopId,
  } = state;

  const [isComposerVisible, setComposerVisible] = useState(false);
  const selectedRisk = riskMeta[selectedStop.riskLevel];

  const handleSubmit = (alertData) => {
    submitAlert(alertData);
    setComposerVisible(false);
  };

  return (
    <View style={styles.shell}>
      <ScrollView 
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SAFE STOP | CIRCULAR UFRN</Text>
          <Text style={styles.title}>Protecao imediata na parada da ECT</Text>
          <Text style={styles.subtitle}>
            Parada da Escola de Ciencias e Tecnologia da UFRN monitorada em tempo real por usuarios, 
            equipe de seguranca e sistema de resposta automatizado...
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
        </View>

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

          <Pressable 
            style={styles.alertButton}
            onPress={() => setComposerVisible(true)}
          >
            <View style={styles.alertButtonIcon}>
              <Text style={styles.alertButtonIconText}>⚠</Text>
            </View>
            <View style={styles.alertButtonCopy}>
              <Text style={styles.alertButtonTitle}>Acionar alerta da parada</Text>
              <Text style={styles.alertButtonText}>
                Avisa usuarios proximos e a seguranca patrimonial
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <AlertComposer
        visible={isComposerVisible}
        onClose={() => setComposerVisible(false)}
        onSubmit={handleSubmit}
        stops={stops}
        defaultStopId={selectedStopId}
      />
    </View>
  );
}