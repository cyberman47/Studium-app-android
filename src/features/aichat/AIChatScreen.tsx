import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { recentLessons } from './data';
import {
  type ChatMessage,
  type ResponseStyle,
  getSession,
  upsertSession,
  useAISettings,
  useChatSettings,
} from './store';

// Keyword-matched canned replies rather than a real model call — there's no
// AI backend wired into the mobile app yet (the web app's is real and
// rate-limited; this is a local placeholder with the same honesty as the
// rest of this app's mock data). responseStyle and lessonTitle both come
// from real state (AI Settings, the lesson picker) so this genuinely
// reacts to them, even though the underlying reply text is scripted.
function craftReply(input: string, lessonTitle: string | undefined, style: ResponseStyle): string {
  const text = input.toLowerCase();
  let base: string;
  if (text.includes('streak')) {
    base =
      'Your streak stays alive as long as you hit your daily Knowledge Point goal. Check the progress bar on Home to see how close you are today.';
  } else if (text.includes('quiz') || text.includes('test me')) {
    base =
      "Here's one: a patient presents with sudden breathlessness postpartum. What's the first diagnosis you should rule out? Think about Virchow's triad.";
  } else if (text.includes('membrane') || text.includes('transport')) {
    base =
      'Cell membrane transport splits into passive (diffusion, facilitated diffusion, osmosis — no energy needed) and active (primary, secondary — needs ATP). What part is tripping you up?';
  } else if (text.includes('mcat')) {
    base =
      'For the MCAT, focus on connecting mechanisms across sections. The same enzyme kinetics you see in Biochem shows up again in Bio passages. Want me to suggest a review order?';
  } else {
    base =
      "Good question. I'd break that down by first identifying what you already know, then filling the gap. Try rephrasing it around the specific concept you're unsure of, and I'll walk through it with you.";
  }

  if (style === 'concise') {
    const cut = base.indexOf('. ');
    base = cut === -1 ? base : base.slice(0, cut + 1);
  }
  return lessonTitle ? `Since you're working on ${lessonTitle}: ${base}` : base;
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function deriveTitle(messages: ChatMessage[], lessonTitle: string | undefined): string {
  if (lessonTitle) return lessonTitle;
  const firstUser = messages.find((m) => m.role === 'user');
  if (!firstUser) return 'New conversation';
  return firstUser.text.length > 40 ? `${firstUser.text.slice(0, 40)}…` : firstUser.text;
}

export function AIChatScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { session: sessionParam, term: termParam } = useLocalSearchParams<{ session?: string; term?: string }>();
  const aiSettings = useAISettings();
  const chatSettings = useChatSettings();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // "Ask Studium AI" from a term's expanded view (features/terminology/
  // components/TermDetailSheet.tsx) arrives here with ?term=<name> —
  // reuses the exact same "attached lesson" context mechanism the Lesson
  // picker already feeds into craftReply()/deriveTitle() below, rather
  // than inventing a second, parallel context channel.
  const [selectedLesson, setSelectedLesson] = useState<string | undefined>(
    termParam ?? (aiSettings.autoAttachLesson ? recentLessons[0]?.title : undefined),
  );
  const [lessonSheetVisible, setLessonSheetVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const sessionIdRef = useRef(sessionParam ?? newId('session'));

  // Loading an existing conversation from Chat History — swaps in its
  // saved messages and lesson instead of starting fresh.
  useEffect(() => {
    if (!sessionParam) return;
    const existing = getSession(sessionParam);
    if (existing) {
      sessionIdRef.current = existing.id;
      setMessages(existing.messages);
      setSelectedLesson(existing.lessonTitle);
    }
  }, [sessionParam]);

  function send() {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { id: newId('u'), role: 'user', text: trimmed };
    const withUser = [...messages, userMessage];
    setMessages(withUser);
    setDraft('');
    setIsTyping(true);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

    setTimeout(() => {
      const reply: ChatMessage = {
        id: newId('a'),
        role: 'assistant',
        text: craftReply(trimmed, selectedLesson, aiSettings.responseStyle),
      };
      const withReply = [...withUser, reply];
      setMessages(withReply);
      setIsTyping(false);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

      if (chatSettings.saveHistory) {
        upsertSession({
          id: sessionIdRef.current,
          title: deriveTitle(withReply, selectedLesson),
          lessonTitle: selectedLesson,
          messages: withReply,
          updatedAt: Date.now(),
        });
      }
    }, 700);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={styles.headerButton}>
              <Ionicons name="chevron-back" size={22} color={theme.text} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/ai-chat-history')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Chat history"
              style={styles.headerButton}>
              <Ionicons name="time-outline" size={20} color={theme.text} />
            </Pressable>
          </View>

          <ThemedText style={styles.title}>Studium AI</ThemedText>

          <View style={[styles.headerSide, styles.headerSideRight]}>
            <Pressable
              onPress={() => setMenuVisible(true)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="More options"
              style={styles.headerButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color={theme.text} />
            </Pressable>
          </View>
        </View>

        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.primaryMuted }]}>
              <Ionicons name="sparkles" size={26} color={theme.primary} />
            </View>
            <ThemedText style={styles.emptyTitle}>What can I help you with today?</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyDescription}>
              Ask about a topic you're stuck on, or say "quiz me" for a practice question.
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            style={styles.flex}
            contentContainerStyle={styles.messages}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
            {messages.map((message) => (
              <View key={message.id} style={[styles.bubbleRow, message.role === 'user' && styles.bubbleRowUser]}>
                {message.role === 'assistant' && (
                  <View style={[styles.avatar, { backgroundColor: theme.primaryMuted }]}>
                    <Ionicons name="sparkles" size={14} color={theme.primary} />
                  </View>
                )}
                <View style={[styles.bubbleShadow, Shadow.card]}>
                  <View
                    style={[
                      styles.bubble,
                      message.role === 'user'
                        ? { backgroundColor: theme.primary, borderColor: theme.primary }
                        : { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                    ]}>
                    <ThemedText style={[styles.bubbleText, message.role === 'user' && { color: '#FFFFFF' }]}>
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
                <View style={[styles.bubbleShadow, Shadow.card]}>
                  <View style={[styles.bubble, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                    <ThemedText themeColor="textSecondary" style={styles.bubbleText}>
                      …
                    </ThemedText>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        <View style={styles.lessonBarWrap}>
          {selectedLesson ? (
            <View style={[styles.lessonChip, { backgroundColor: theme.primaryMuted, borderColor: theme.primary }]}>
              <Ionicons name="book-outline" size={13} color={theme.primary} />
              <ThemedText themeColor="primary" numberOfLines={1} style={styles.lessonChipText}>
                {selectedLesson}
              </ThemedText>
              <Pressable
                onPress={() => setSelectedLesson(undefined)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Remove lesson context">
                <Ionicons name="close-circle" size={16} color={theme.primary} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setLessonSheetVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Choose a recent lesson"
              style={({ pressed }) => [
                styles.lessonPill,
                { borderColor: theme.border },
                pressed && { backgroundColor: theme.backgroundSelected },
              ]}>
              <Ionicons name="book-outline" size={13} color={theme.textSecondary} />
              <ThemedText themeColor="textSecondary" style={styles.lessonPillText}>
                Choose a recent lesson
              </ThemedText>
              <Ionicons name="chevron-down" size={14} color={theme.textSecondary} />
            </Pressable>
          )}
        </View>

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

      <Modal visible={lessonSheetVisible} transparent animationType="fade" onRequestClose={() => setLessonSheetVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setLessonSheetVisible(false)}>
          <Pressable
            style={[styles.lessonSheet, { backgroundColor: theme.backgroundElement }]}
            onPress={(event) => event.stopPropagation()}>
            <View style={styles.grabber} />
            <ThemedText style={styles.lessonSheetTitle}>Choose a recent lesson</ThemedText>
            {recentLessons.map((lesson) => (
              <Pressable
                key={lesson.id}
                onPress={() => {
                  setSelectedLesson(lesson.title);
                  setLessonSheetVisible(false);
                }}
                accessibilityRole="button"
                accessibilityLabel={lesson.title}
                style={({ pressed }) => [styles.lessonRow, pressed && { backgroundColor: theme.backgroundSelected }]}>
                <View style={[styles.lessonRowIcon, { backgroundColor: theme.primaryMuted }]}>
                  <Ionicons name="book-outline" size={16} color={theme.primary} />
                </View>
                <View style={styles.lessonRowText}>
                  <ThemedText style={styles.lessonRowTitle}>{lesson.title}</ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.lessonRowSubtitle}>
                    {lesson.subject}
                  </ThemedText>
                </View>
              </Pressable>
            ))}
            <Pressable
              onPress={() => setLessonSheetVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              style={({ pressed }) => [
                styles.cancelButton,
                { borderColor: theme.border },
                pressed && { backgroundColor: theme.backgroundSelected },
              ]}>
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuVisible(false)}>
          <View style={[styles.menuCard, Shadow.raised, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Pressable
              onPress={() => {
                setMenuVisible(false);
                router.push('/ai-chat-settings');
              }}
              accessibilityRole="button"
              accessibilityLabel="Chat settings"
              style={({ pressed }) => [styles.menuRow, pressed && { backgroundColor: theme.backgroundSelected }]}>
              <Ionicons name="chatbox-outline" size={16} color={theme.text} />
              <ThemedText style={styles.menuRowText}>Chat Settings</ThemedText>
            </Pressable>
            <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />
            <Pressable
              onPress={() => {
                setMenuVisible(false);
                router.push('/ai-settings');
              }}
              accessibilityRole="button"
              accessibilityLabel="AI settings"
              style={({ pressed }) => [styles.menuRow, pressed && { backgroundColor: theme.backgroundSelected }]}>
              <Ionicons name="sparkles-outline" size={16} color={theme.text} />
              <ThemedText style={styles.menuRowText}>AI Settings</ThemedText>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    marginBottom: 2,
  },
  headerSide: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 72,
  },
  headerSideRight: {
    justifyContent: 'flex-end',
  },
  headerButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    gap: 8,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 280,
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
  lessonBarWrap: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  lessonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  lessonPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lessonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  lessonChipText: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  lessonSheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
    gap: 2,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(15, 23, 42, 0.15)',
    alignSelf: 'center',
    marginBottom: Spacing.three,
  },
  lessonSheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Spacing.two,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    borderRadius: Radius.md,
    paddingHorizontal: 4,
  },
  lessonRowIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonRowText: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  lessonRowTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  lessonRowSubtitle: {
    fontSize: 11,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 13,
    marginTop: Spacing.three,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  menuBackdrop: {
    flex: 1,
  },
  menuCard: {
    position: 'absolute',
    top: 96,
    right: Spacing.four,
    width: 200,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuRowText: {
    fontSize: 13,
    fontWeight: '600',
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
  },
});
