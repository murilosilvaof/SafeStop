#include <Arduino.h>

// ----------------------------------------------------------------------------
// SafeStop UFRN - firmware USB Serial
// Botao fisico em GPIO27 (entre GPIO27 e GND) alterna:
//   - ALERTA quando desarmado
//   - RESET quando ja estiver em emergencia
// Reset manual opcional em GPIO25 (entre GPIO25 e GND)
// ----------------------------------------------------------------------------

#define PINO_LED      2
#define PINO_BOTOEIRA 27
#define PINO_RELE     26
#define PINO_RESET    25

bool emergenciaAtiva = false;
bool estadoLeituraBotao = HIGH;
bool estadoEstavelBotao = HIGH;
bool estadoLeituraReset = HIGH;
bool estadoEstavelReset = HIGH;
unsigned long ultimoDebounceBotao = 0;
unsigned long ultimoDebounceReset = 0;
const unsigned long debounceDelay = 50;

void acionarEmergencia() {
  if (emergenciaAtiva) {
    return;
  }

  emergenciaAtiva = true;
  digitalWrite(PINO_RELE, HIGH);
  digitalWrite(PINO_LED, HIGH);

  Serial.println("EMERGENCIA ACIONADA");
  Serial.println("ALERTA");
}

void desarmarEmergencia() {
  if (!emergenciaAtiva) {
    return;
  }

  emergenciaAtiva = false;
  digitalWrite(PINO_RELE, LOW);
  digitalWrite(PINO_LED, LOW);

  Serial.println("EMERGENCIA RESETADA");
  Serial.println("RESET");
}

void setup() {
  Serial.begin(115200);
  delay(500);

  pinMode(PINO_LED, OUTPUT);
  pinMode(PINO_RELE, OUTPUT);
  pinMode(PINO_BOTOEIRA, INPUT_PULLUP);
  pinMode(PINO_RESET, INPUT_PULLUP);

  digitalWrite(PINO_LED, LOW);
  digitalWrite(PINO_RELE, LOW);

  Serial.println("SafeStop UFRN pronto");
  Serial.println("Botoeira: GPIO27 -> GND");
  Serial.println("Reset manual: GPIO25 -> GND");
  Serial.println("Aguardando botoeira...");
}

void loop() {
  bool leituraBotaoAtual = digitalRead(PINO_BOTOEIRA);
  bool leituraResetAtual = digitalRead(PINO_RESET);

  if (leituraBotaoAtual != estadoLeituraBotao) {
    ultimoDebounceBotao = millis();
  }

  if ((millis() - ultimoDebounceBotao) > debounceDelay && leituraBotaoAtual != estadoEstavelBotao) {
    estadoEstavelBotao = leituraBotaoAtual;
    if (estadoEstavelBotao == LOW) {
      if (emergenciaAtiva) {
        desarmarEmergencia();
      } else {
        acionarEmergencia();
      }
    }
  }

  if (leituraResetAtual != estadoLeituraReset) {
    ultimoDebounceReset = millis();
  }

  if ((millis() - ultimoDebounceReset) > debounceDelay && leituraResetAtual != estadoEstavelReset) {
    estadoEstavelReset = leituraResetAtual;
    if (estadoEstavelReset == LOW) {
      desarmarEmergencia();
    }
  }

  estadoLeituraBotao = leituraBotaoAtual;
  estadoLeituraReset = leituraResetAtual;

  delay(10);

  // Check for serial commands from bridge (e.g., RESET or ALERTA)
  if (Serial.available()) {
    String in = Serial.readStringUntil('\n');
    in.trim();
    in.toUpperCase();
    if (in.indexOf("RESET") >= 0) {
      desarmarEmergencia();
    } else if (in.indexOf("ALERTA") >= 0 || in.indexOf("EMERGEN") >= 0) {
      acionarEmergencia();
    }
  }
}
