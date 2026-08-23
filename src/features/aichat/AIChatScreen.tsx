import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: 'greeting',
    role: 'assistant',
    text: "Hi, I'm Studium AI. Ask me about a topic you're stuck on, or say \"quiz me\" and I'll walk you through a question.",
  },
];

// Keyword-matched canned replies rather than a real model call — there's no
// AI backend wired into the mobile app yet (the web app's is real and
// rate-limited; this is a local placeholder with the same honesty as the
// rest of this app's mock data). The chat itself is genuinely interactive:
// real message state, a real scroll-to-bottom, a real "typing" delay —
// only the reply content is canned, not the interaction.
function craftReply(input: string): string {
  const text = input.toLowerCase();
  if (text.includes('streak')) {
    return 'Your streak stays alive as long as you hit your daily Knowledge Point goal — check the progress bar on Home to see how close you are today.';
  }
  if (text.includes('quiz') || text.includes('test me')) {
    return "Here's one: A patient presents with sudden breathlessness postpartum — what's the first diagnosis you should rule out? Think about Virchow's triad.";
  }
  if (text.includes('membrane') || text.includes('transport')) {
    return "Cell membrane transport splits into passive (diffusion, facilitated diffusion, osmosis — no energy needed) and active (primary, secondary — needs ATP). What part is tripping you up?";
  }
  if (text.includes('mcat')) {
    return "For the MCAT, focus on connecting mechanisms across sections — the same enzyme kinetics you see in Biochem shows up again in Bio passages. Want me to suggest a review order?";
  }
  return "Good question — I'd break that down by first identifying what you already know, then filling the gap. Try rephrasing it around the specific concept you're unsure of, and I'll walk through it with you.";
}

export function AIChatScreen() {
  const theme = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  function send() {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setIsTyping(true);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

    setTimeout(() => {
      const reply: ChatMessage = { id: `a-${Date.now()}`, role: 'assistant', text: craftReply(trimmed) };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }, 700);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <View style={styles.header}>
          <ScreenHeader title="Studium AI" />
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[styles.bubbleRow, message.role === 'user' && styles.bubbleRowUser]}>
              {message.role === 'assistant' && (
                <View style={[styles.avatar, { backgroundColor: theme.primaryMuted }]}>
                  <Ionicons name="sparkles" size={14} color={theme.primary} />
                </View>
              )}
              <View
                style={[
                  styles.bubbleShadow,
                  Shadow.card,
                  message.role === 'user' ? styles.bubbleShadowUser : styles.bubbleShadowAssistant,
                ]}>
                <View
                  style={[
                    styles.bubble,
                    message.role === 'user'
                      ? { backgroundColor: theme.primary, borderColor: theme.primary }
                      : { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                  ]}>
                  <ThemedText
                    style={[styles.bubbleText, message.role === 'user' && { color: '#FFFFFF' }]}>
                    {message.text}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
          {isTyping && (
            <View style={styles.bubbleRow}>
              <View style={[styles.avatar, { backgroundColor: theme.primaryMuted }]}>
                <Ionicons name="sparkles" size={14} color={theme.primary} />
              </View>
              <View style={[styles.bubbleShadow, Shadow.card, styles.bubbleShadowAssistant]}>
                <View style={[styles.bubble, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <ThemedText themeColor="textSecondary" style={styles.bubbleText}>
                    …
                  </ThemedText>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputRow, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask about a topic…"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
            multiline
            onSubmitEditing={send}
          />
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            style={({ pressed }) => [
              styles.sendButton,
              { backgroundColor: draft.trim() ? theme.primary : theme.border },
              pressed && draft.trim() && styles.sendButtonPressed,
            ]}>
            <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  messages: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: 12,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '90%',
  },
  bubbleRowUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleShadow: {
    borderRadius: Radius.lg,
    flexShrink: 1,
  },
  bubbleShadowAssistant: {},
  bubbleShadowUser: {},
  bubble: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonPressed: {
    opacity: 0.85,
  },
});
