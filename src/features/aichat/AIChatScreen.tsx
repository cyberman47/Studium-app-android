import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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
import { useAuthState } from '@/features/auth/store';
import { useTheme } from '@/hooks/use-theme';
import { educationTrackLabel } from '@/lib/educationTrack';
import { supabase } from '@/lib/supabase';
import { streamTutorReply, type TutorContext } from '@/lib/tutorChat';

import { recentLessons } from './data';
import { type ChatMessage, getSession, upsertSession, useAISettings, useChatSettings } from './store';

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Shown in place of the assistant bubble's text while waiting on the
// first real chunk from /api/tutor — a thin indeterminate bar (a sweeping
// highlight, looping) rather than static "…" text, so a slow reply still
// visibly reads as "working," not stalled. Once real text starts
// streaming in this unmounts and the bubble shows that text instead.
function TypingBar({ color, trackColor }: { color: string; trackColor: string }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-56, 56] });

  return (
    <View style={[typingBarStyles.track, { backgroundColor: trackColor }]}>
      <Animated.View style={[typingBarStyles.fill, { backgroundColor: color, transform: [{ translateX }] }]} />
    </View>
  );
}

const typingBarStyles = StyleSheet.create({
  track: {
    width: 56,
    height: 5,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    width: 28,
    height: '100%',
    borderRadius: Radius.pill,
  },
});

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

  // Real "Currently Studying" track, same profiles.education_track column
  // the dashboard reads — sent as TutorContext.currentTrack so the model
  // frames answers for this student's actual field, same as the website's
  // in-lesson tutor panel. Left undefined until this resolves; the server
  // treats a missing track as "not specified" rather than erroring.
  const { userId } = useAuthState();
  const [trackLabel, setTrackLabel] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    supabase
      .from('profiles')
      .select('education_track')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setTrackLabel(educationTrackLabel(data?.education_track));
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

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

  function patchMessage(id: string, patch: Partial<ChatMessage>) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  // Real streamed reply from /api/tutor (src/lib/tutorChat.ts) — the same
  // Gemini-backed endpoint and request contract studium-website's own AI
  // Tutor uses. No mode picker exists in this screen yet, so the AI
  // Settings "Response style" toggle (concise/detailed) maps onto the
  // server's tutor mode instead of being thrown away: concise asks for the
  // short-analogy "simplify" mode, detailed uses the standard "tutor" mode.
  async function send() {
    const trimmed = draft.trim();
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = { id: newId('u'), role: 'user', text: trimmed };
    const assistantMessage: ChatMessage = { id: newId('a'), role: 'assistant', text: '', streaming: true };
    const priorMessages = messages;
    const withPlaceholder = [...priorMessages, userMessage, assistantMessage];
    setMessages(withPlaceholder);
    setDraft('');
    setIsTyping(true);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

    const lessonMeta = selectedLesson ? recentLessons.find((l) => l.title === selectedLesson) : undefined;
    const context: TutorContext = {
      sectionName: '',
      subjectName: lessonMeta?.subject ?? '',
      lessonTitle: selectedLesson ?? '',
      lessonId: lessonMeta?.id ?? '',
      currentStep: '',
      currentFlashcard: null,
      currentPracticeQuestion: null,
      recentMistakes: [],
      studentLevel: '',
      currentTrack: trackLabel,
      currentOnScreenText: null,
    };
    const history = priorMessages.filter((m) => !m.error).map((m) => ({ role: m.role, text: m.text }));
    const mode = aiSettings.responseStyle === 'concise' ? 'simplify' : 'tutor';

    let latestText = '';
    const result = await streamTutorReply({
      message: trimmed,
      mode,
      context,
      history,
      onChunk: (textSoFar) => {
        latestText = textSoFar;
        patchMessage(assistantMessage.id, { text: textSoFar });
        requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
      },
    });

    const finalAssistant: ChatMessage = result.ok
      ? { ...assistantMessage, text: latestText, streaming: false }
      : { ...assistantMessage, text: result.error, streaming: false, error: true };
    patchMessage(assistantMessage.id, finalAssistant);
    setIsTyping(false);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

    if (chatSettings.saveHistory) {
      const finalMessages = [...priorMessages, userMessage, finalAssistant];
      upsertSession({
        id: sessionIdRef.current,
        title: deriveTitle(finalMessages, selectedLesson),
        lessonTitle: selectedLesson,
        messages: finalMessages,
        updatedAt: Date.now(),
      });
    }
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
            {messages.map((message) => {
              // Still waiting on the first chunk — no text yet to show, so
              // render the same "…" placeholder the old canned-reply delay
              // used, rather than an empty bubble. Once real text starts
              // streaming in, this flips to showing it live.
              const isPending = message.role === 'assistant' && message.streaming && message.text === '';
              return (
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
                          : message.error
                            ? { backgroundColor: theme.roseMuted, borderColor: theme.rose }
                            : { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                      ]}>
                      {isPending ? (
                        <View style={styles.typingBarWrap}>
                          <TypingBar color={theme.primary} trackColor={theme.backgroundSelected} />
                        </View>
                      ) : (
                        <ThemedText
                          themeColor={message.error ? 'rose' : undefined}
                          style={[styles.bubbleText, message.role === 'user' && { color: '#FFFFFF' }]}>
                          {message.text}
                        </ThemedText>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
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
            disabled={!draft.trim() || isTyping}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            style={({ pressed }) => [
              styles.sendButton,
              { backgroundColor: draft.trim() && !isTyping ? theme.primary : theme.border },
              pressed && draft.trim() && !isTyping && styles.sendButtonPressed,
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
  typingBarWrap: {
    paddingVertical: 4,
    justifyContent: 'center',
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
