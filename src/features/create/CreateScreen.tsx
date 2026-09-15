import { Ionicons } from '@expo/vector-icons';
import { File } from 'expo-file-system';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// How much of an imported file's text actually gets sent along — plenty
// for a real set of notes, small enough to stay a reasonable chat message
// rather than risk a huge request to the tutor API.
const MAX_IMPORT_CHARS = 8000;

// A file picked from the "Recent"/virtual views of Android's system
// picker is backed by a SAF content:// URI whose real display name isn't
// always exposed — expo-file-system's File.name falls back to the raw
// document id in that case (e.g. "document:524"), which would read as a
// confusing bug rather than a filename. Anything that doesn't look like
// a real "name.ext" gets a plain, honest placeholder instead.
function displayFileName(name: string): string {
  return /^[\w .-]+\.[A-Za-z0-9]+$/.test(name) ? name : 'your file';
}

type CreateOption = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
};

// "What can I make/import?" — where Home's floating "+" now routes
// (previously it opened ImportSheet, a small bottom sheet with only two
// options; New Flashcards is preserved here unchanged, just reached from
// a full tab instead — New Note was dropped per feedback). New Quiz
// reuses the same real save-to-store pattern (features/review/
// quizStore.ts). Import Material is real now too, scoped honestly to
// what this app can actually do: expo-file-system's real device file
// picker (restricted to .txt/.md — no PDF/Word parser exists here, so
// the picker never even offers those) reads the file's real text and
// hands it to Studium AI chat as a pre-filled draft, so the tutor can
// build a study set from it — see handleImportMaterial below and
// AIChatScreen's importedText handling. AI Study Set routes to the same
// real AI feature directly, with no file attached. New Word opens
// features/vocabulary/NewWordScreen.tsx — real lookup against Studium's
// own terminology database (lib/glossary.ts) plus a real manual
// add-your-own-word form, both saving into one persisted "my words" list.
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

  // Real file picking + real text extraction — restricted to plain text
  // (.txt/.md) since that's the one format this app can actually read
  // reliably; there's no PDF/Word parser here, and offering those in the
  // picker would be a promise this can't keep. The extracted text hands
  // off to Studium AI chat as a pre-filled draft (not auto-sent) so the
  // student can review or edit it before asking the tutor to build a
  // study set from it.
  async function handleImportMaterial() {
    const pickResult = await File.pickFileAsync({ mimeTypes: ['text/plain', 'text/markdown'] }).catch(() => null);
    if (!pickResult) {
      showNotice("Couldn't open the file picker. Try again.");
      return;
    }
    if (pickResult.canceled) return;

    const file = pickResult.result;
    let text: string;
    try {
      text = await file.text();
    } catch {
      showNotice("Couldn't read that file — try a plain text (.txt or .md) file.");
      return;
    }
    if (!text.trim()) {
      showNotice('That file looks empty.');
      return;
    }

    const truncated = text.length > MAX_IMPORT_CHARS;
    router.push({
      pathname: '/ai-chat',
      params: {
        importedText: truncated ? text.slice(0, MAX_IMPORT_CHARS) : text,
        importedFileName: displayFileName(file.name),
        importedTruncated: truncated ? '1' : '',
      },
    });
  }

  const options: CreateOption[] = [
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
      subtitle: 'Look up real terminology or add your own',
      onPress: () => router.push('/new-word'),
    },
    {
      key: 'import',
      icon: 'cloud-upload-outline',
      title: 'Import Material',
      subtitle: 'Bring in a text file, then build a set with AI',
      onPress: handleImportMaterial,
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
