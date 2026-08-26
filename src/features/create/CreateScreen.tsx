import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CreateOption = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
};

// "What can I make/import?" — where Home's floating "+" now routes
// (previously it opened ImportSheet, a small bottom sheet with only two
// options; every destination that sheet had — New Note, New Flashcards —
// is preserved here unchanged, just reached from a full tab instead).
// New Quiz reuses the same real save-to-store pattern as those two
// (features/review/quizStore.ts). Import Material has no real pipeline
// behind it anywhere in this app (mycontent's own store already notes
// "there's no file-import pipeline wired up"), so it's an honest,
// working "not connected yet" notice rather than a silent dead tap or a
// disabled-looking button. AI Study Set routes to the one real AI
// feature that exists, Studium AI chat. New Word opens the reusable
// VocabularyWordCard (features/vocabulary/) — a progressive-disclosure
// word-lookup card (compact translation → swipe up for the full
// dictionary view) with real, persisted save/study state, shown with
// one realistic placeholder word since there's no real vocabulary-
// lookup backend behind it yet. The speaker button is a plain, unwired
// press affordance for now — no real pronunciation audio.
export function CreateScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
  }, []);

  function showNotice(text: string) {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    setNotice(text);
    noticeTimer.current = setTimeout(() => setNotice(null), 2600);
  }

  const options: CreateOption[] = [
    {
      key: 'note',
      icon: 'document-text-outline',
      title: 'New Note',
      subtitle: 'Write something down to study later',
      onPress: () => router.push('/new-note'),
    },
    {
      key: 'flashcards',
      icon: 'albums-outline',
      title: 'New Flashcards',
      subtitle: 'Build your own front/back cards',
      onPress: () => router.push('/new-flashcards'),
    },
    {
      key: 'quiz',
      icon: 'checkbox-outline',
      title: 'New Quiz',
      subtitle: 'Write your own multiple-choice questions',
      onPress: () => router.push('/new-quiz'),
    },
    {
      key: 'new-word',
      icon: 'language-outline',
      title: 'New Word',
      subtitle: 'Look up a word with pronunciation and grammar',
      onPress: () => router.push('/new-word'),
    },
    {
      key: 'import',
      icon: 'cloud-upload-outline',
      title: 'Import Material',
      subtitle: 'Bring in a file from your device',
      onPress: () => showNotice("File import isn't connected yet."),
    },
    {
      key: 'ai',
      icon: 'sparkles-outline',
      title: 'AI Study Set',
      subtitle: 'Ask Studium AI to build one with you',
      onPress: () => router.push('/ai-chat'),
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Create</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              What would you like to create?
            </ThemedText>
          </View>

          {notice && (
            <View style={[styles.notice, { backgroundColor: theme.primaryMuted }]}>
              <Ionicons name="information-circle" size={16} color={theme.primary} />
              <ThemedText themeColor="primary" style={styles.noticeText}>
                {notice}
              </ThemedText>
            </View>
          )}

          <View style={styles.list}>
            {options.map((option) => (
              <View key={option.key} style={[styles.optionShadow, Shadow.card]}>
                <Pressable
                  onPress={option.onPress}
                  accessibilityRole="button"
                  accessibilityLabel={`${option.title}: ${option.subtitle}`}
                  style={({ pressed }) => [
                    styles.option,
                    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                    pressed && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  <View style={[styles.icon, { backgroundColor: theme.primaryMuted }]}>
                    <Ionicons name={option.icon} size={22} color={theme.primary} />
                  </View>
                  <View style={styles.optionText}>
                    <ThemedText style={styles.optionTitle}>{option.title}</ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.optionSubtitle}>
                      {option.subtitle}
                    </ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: 800, paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: 20 },
  header: { gap: 2 },
  title: { fontSize: 23, fontWeight: '800', lineHeight: 29, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, fontWeight: '500' },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 12 },
  noticeText: { flex: 1, fontSize: 12, fontWeight: '600' },
  list: { gap: 12 },
  optionShadow: { borderRadius: Radius.lg },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 76,
  },
  icon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  optionText: { flex: 1, minWidth: 0, gap: 2 },
  optionTitle: { fontSize: 15, fontWeight: '700' },
  optionSubtitle: { fontSize: 12 },
});
