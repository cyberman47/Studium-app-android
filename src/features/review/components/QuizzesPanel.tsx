import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { useQuizzes } from '../quizStore';

// Real data only — there's no quiz-taking engine anywhere in this app
// yet (no scoring, no "resume at question 8/20"), so unlike the desktop
// spec's illustrative example this honestly lists just the quizzes the
// student has actually created (Create > New Quiz), with real question
// counts — not fabricated scores or in-progress state that doesn't
// exist. Once real quiz-taking exists, this is the real store
// (quizStore.ts) it should read attempt history from too.
export function QuizzesPanel() {
  const theme = useTheme();
  const router = useRouter();
  const quizzes = useQuizzes();

  return (
    <View style={styles.wrap}>
      <View>
        <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
          YOUR QUIZZES
        </ThemedText>
        {quizzes.length === 0 ? (
          <View style={[styles.emptyShadow, Shadow.card]}>
            <View style={[styles.emptyCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                You haven't created any quizzes yet.
              </ThemedText>
            </View>
          </View>
        ) : (
          <View style={styles.list}>
            {quizzes.map((quiz) => (
              <View key={quiz.id} style={[styles.rowShadow, Shadow.card]}>
                <View style={[styles.row, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <View style={[styles.icon, { backgroundColor: theme.primaryMuted }]}>
                    <Ionicons name="checkbox-outline" size={18} color={theme.primary} />
                  </View>
                  <View style={styles.rowText}>
                    <ThemedText numberOfLines={1} style={styles.rowTitle}>
                      {quiz.title}
                    </ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.rowSubtitle}>
                      {quiz.subject} · {quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <Pressable
        onPress={() => router.push('/new-quiz')}
        accessibilityRole="button"
        accessibilityLabel="Create quiz"
        style={({ pressed }) => [styles.createLink, pressed && styles.pressed]}>
        <ThemedText themeColor="primary" style={styles.createLinkText}>
          Create quiz
        </ThemedText>
        <Ionicons name="arrow-forward" size={13} color={theme.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    marginBottom: Spacing.two,
  },
  emptyShadow: {
    borderRadius: Radius.lg,
  },
  emptyCard: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
  list: {
    gap: 10,
  },
  rowShadow: {
    borderRadius: Radius.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 60,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  rowSubtitle: {
    fontSize: 12,
  },
  createLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    minHeight: 32,
  },
  pressed: {
    opacity: 0.7,
  },
  createLinkText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
