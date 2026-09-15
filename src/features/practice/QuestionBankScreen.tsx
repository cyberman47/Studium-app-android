import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { BankQuestion, BankTrack, getQuestionsForLesson } from '@/lib/contentBank';
import { logQuestionAttempt } from '@/lib/questionBankProgress';

// The real question-bank runner — same visual language as
// features/anatomy/AnatomyQuizScreen.tsx (lettered options with
// correct/incorrect reveal + explanation, a progress bar + Next, a plain
// summary screen at the end) but simplified for this content: no image
// panel (mcat_practice_questions/nursing_quiz_questions have no image
// field) and no teaching-slide/weak-concept detour — that's anatomy's own
// UX, not part of this feature. Every question comes straight from
// Supabase (see lib/contentBank.ts); every answer is logged to
// lib/questionBankProgress.ts so the lesson list can show real completion.
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function QuestionBankScreen({
  track,
  lessonId,
  lessonTitle,
  subjectTitle,
}: {
  track: BankTrack;
  lessonId: string;
  lessonTitle: string;
  subjectTitle: string;
}) {
  const theme = useTheme();
  const router = useRouter();

  const [questions, setQuestions] = useState<BankQuestion[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getQuestionsForLesson(track, lessonId)
      .then((qs) => {
        if (!cancelled) setQuestions(qs);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [track, lessonId]);

  function exit() {
    router.back();
  }

  const correctCount = useMemo(
    () => (questions ?? []).filter((q, i) => answers[i] === q.correctIndex).length,
    [questions, answers],
  );
  const answeredCount = Object.keys(answers).length;

  function choose(i: number) {
    if (!questions) return;
    const question = questions[index];
    const selected = answers[index] ?? null;
    if (selected !== null) return;
    const correct = i === question.correctIndex;
    setAnswers((a) => ({ ...a, [index]: i }));
    logQuestionAttempt(track, lessonId, question.id, correct);
  }

  function next() {
    if (!questions) return;
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      return;
    }
    setShowSummary(true);
  }

  const header = (title: string, subtitle?: string) => (
    <View style={[styles.header, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.border }]}>
      <Pressable onPress={exit} hitSlop={8} accessibilityRole="button" accessibilityLabel="Exit" style={styles.headerButton}>
        <Ionicons name="close" size={22} color={theme.textSecondary} />
      </Pressable>
      <View style={styles.headerCenter}>
        <ThemedText numberOfLines={1} style={styles.headerTitle}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText numberOfLines={1} themeColor="textSecondary" style={styles.headerSubtitle}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      <View style={styles.headerButton}>
        {questions && !showSummary && (
          <ThemedText themeColor="textSecondary" style={styles.headerCount}>
            {index + 1} / {questions.length}
          </ThemedText>
        )}
      </View>
    </View>
  );

  if (loadError) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {header(lessonTitle)}
        <View style={styles.centerWrap}>
          <ThemedText style={styles.emptyTitle}>Couldn't load these questions.</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.emptyText}>
            Check your connection and try again.
          </ThemedText>
          <Pressable onPress={exit} accessibilityRole="button" style={[styles.pillButton, { backgroundColor: theme.accent }]}>
            <ThemedText style={styles.pillButtonText}>Back</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!questions) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {header(lessonTitle)}
        <View style={styles.centerWrap}>
          <ActivityIndicator color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {header(lessonTitle)}
        <View style={styles.centerWrap}>
          <ThemedText style={styles.emptyTitle}>No questions yet.</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.emptyText}>
            This lesson doesn't have any practice questions yet.
          </ThemedText>
          <Pressable onPress={exit} accessibilityRole="button" style={[styles.pillButton, { backgroundColor: theme.accent }]}>
            <ThemedText style={styles.pillButtonText}>Back</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (showSummary) {
    const pct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {header(lessonTitle)}
        <View style={styles.summaryWrap}>
          <View style={[styles.summaryIcon, { backgroundColor: theme.primaryMuted }]}>
            <Ionicons name="sparkles" size={26} color={theme.primary} />
          </View>
          <ThemedText style={styles.summaryTitle}>Lesson complete</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.summaryText}>
            {correctCount} / {answeredCount} correct{answeredCount > 0 ? ` (${pct}%)` : ''}
          </ThemedText>
          <Pressable
            onPress={exit}
            accessibilityRole="button"
            accessibilityLabel="Done"
            style={({ pressed }) => [styles.pillButton, styles.summaryButton, { backgroundColor: theme.accent }, pressed && styles.pressed]}>
            <ThemedText style={styles.pillButtonText}>Done</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const question = questions[index];
  const selected = answers[index] ?? null;
  const answered = selected !== null;
  const percentDone = Math.round(((index + 1) / questions.length) * 100);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {header(lessonTitle, subjectTitle)}
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.panel, Shadow.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText themeColor="primary" style={styles.concept}>
            {question.concept}
          </ThemedText>
          <ThemedText style={styles.question}>{question.question}</ThemedText>

          <View style={styles.options}>
            {question.options.map((opt, i) => {
              const isCorrect = i === question.correctIndex;
              const isSelected = selected === i;
              let border: string = theme.border;
              let bg: string = theme.backgroundElement;
              let dim = false;
              if (answered) {
                if (isCorrect) {
                  border = theme.primary;
                  bg = theme.primaryMuted;
                } else if (isSelected) {
                  border = theme.rose;
                  bg = theme.roseMuted;
                } else {
                  dim = true;
                }
              }
              return (
                <View key={i}>
                  <Pressable
                    onPress={() => choose(i)}
                    disabled={answered}
                    accessibilityRole="button"
                    accessibilityLabel={`${LETTERS[i]}: ${opt}`}
                    style={({ pressed }) => [
                      styles.option,
                      { borderColor: border, backgroundColor: bg },
                      dim && styles.dim,
                      pressed && !answered && { borderColor: theme.primary, backgroundColor: theme.backgroundSelected },
                    ]}>
                    <View style={styles.optionLeft}>
                      <View style={[styles.letter, { borderColor: theme.border }]}>
                        <ThemedText themeColor="textSecondary" style={styles.letterText}>
                          {LETTERS[i]}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.optionText}>{opt}</ThemedText>
                    </View>
                    {answered && isCorrect && <Ionicons name="checkmark" size={18} color={theme.primary} />}
                    {answered && isSelected && !isCorrect && <Ionicons name="close" size={18} color={theme.rose} />}
                  </Pressable>
                  {answered && isSelected && question.optionExplanations[i] ? (
                    <ThemedText themeColor={isCorrect ? 'primary' : 'textSecondary'} style={styles.explanation}>
                      {question.optionExplanations[i]}
                    </ThemedText>
                  ) : null}
                </View>
              );
            })}
          </View>

          <View style={[styles.panelFooter, { borderTopColor: theme.border }]}>
            <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
              <View style={[styles.progressFill, { backgroundColor: theme.primary, width: `${percentDone}%` }]} />
            </View>
            <Pressable
              onPress={next}
              disabled={!answered}
              accessibilityRole="button"
              accessibilityLabel={index + 1 < questions.length ? 'Next' : 'See results'}
              accessibilityState={{ disabled: !answered }}
              style={({ pressed }) => [
                styles.pillButton,
                styles.nextButton,
                { backgroundColor: theme.accent },
                !answered && styles.disabled,
                pressed && answered && styles.pressed,
              ]}>
              <ThemedText style={styles.pillButtonText}>{index + 1 < questions.length ? 'Next' : 'See Results'}</ThemedText>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    width: 48,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  headerCount: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: 6,
  },
  body: {
    padding: Spacing.four,
    paddingTop: Spacing.three,
    alignItems: 'center',
  },
  panel: {
    width: '100%',
    maxWidth: 800,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
  },
  concept: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  question: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '700',
    marginTop: 8,
  },
  options: {
    gap: 10,
    paddingVertical: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderRadius: Radius.lg,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 52,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  letter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    fontSize: 11,
    fontWeight: '800',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
  },
  dim: {
    opacity: 0.55,
  },
  explanation: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  panelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 14,
  },
  progressTrack: {
    flex: 1,
    maxWidth: 140,
    height: 6,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.pill,
    paddingHorizontal: 20,
    minHeight: 42,
  },
  pillButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  nextButton: {
    paddingHorizontal: 18,
    minHeight: 40,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
  summaryWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
  },
  summaryText: {
    fontSize: 14,
    marginTop: 6,
  },
  summaryButton: {
    marginTop: 28,
    paddingHorizontal: 32,
    minHeight: 48,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    marginBottom: 14,
  },
});
