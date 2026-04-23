import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { globalStyles as styles } from "../styles/globalStyles";
import { ChatMessageBubble } from "../components/ChatMessageBubble";
import { NoticeItem } from "../components/NoticeItem";
import { SectionCard } from "../components/SectionCard";

export function ChatScreen({ state }) {
  const { chatMessages, sendChatMessage, notices } = state;
  const [chatDraft, setChatDraft] = useState("");
  const scrollViewRef = useRef();

  const handleSend = () => {
    if (chatDraft.trim()) {
      sendChatMessage(chatDraft.trim());
      setChatDraft("");
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.shell}
    >
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>CENTRAL DE APOIO</Text>
          <Text style={styles.title}>Segurança</Text>
        </View>

        {/* Notificações Preventivas da UFRN */}
        {notices.length > 0 && (
          <SectionCard title="Avisos Importantes" tone="sun">
            <View style={{ gap: 12 }}>
              {notices.slice(0, 2).map((notice) => (
                <NoticeItem key={notice.id} notice={notice} />
              ))}
            </View>
          </SectionCard>
        )}

        {/* Histórico de Conversa */}
        <View style={{ gap: 16, marginTop: 10 }}>
          <Text style={styles.eyebrow}>CONVERSA COM PATRIMONIAL</Text>
          {chatMessages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}
        </View>
      </ScrollView>

      {/* Campo de Entrada de Mensagem */}
      <View style={[styles.chatComposer, { padding: 20, backgroundColor: '#081015' }]}>
        <TextInput
          style={styles.chatInput}
          placeholder="Descreva a situação para a central..."
          placeholderTextColor="#92A3AE"
          value={chatDraft}
          onChangeText={setChatDraft}
          multiline
        />
        <Pressable 
          style={[styles.alertButton, { paddingHorizontal: 20, justifyContent: 'center' }]} 
          onPress={handleSend}
        >
          <Text style={{ color: "#FFF", fontWeight: "800" }}>Enviar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}