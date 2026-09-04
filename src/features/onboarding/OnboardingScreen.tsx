import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
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

import {
  completeOnboarding,
  dailyStudyTimeOptions,
  emptyAnswers,
  goalOptions,
  learningStyleOptions,
  OnboardingAnswers,
  studyingForOptions,
  timelineOptions,
} from './store';

type QuestionKey = 'studyingFor' | 'goal' | 'dailyStudyTime' | 'timeline' | 'learningStyle';

type QuestionDef = {
  key: QuestionKey;
  heading: string;
  options: string[];
  multiple: boolean;
};

// Questions 2–6 of the spec — question 1 (name) is its own screen type
// (free text, not options) and question 7 (completion) isn't a question
// at all, so both are handled separately below rather than forced into
// this shape.
const questions: QuestionDef[] = [
  { key: 'studyingFor', heading: 'What are you studying for?', options: studyingForOptions, multiple: false },
  { key: 'goal', heading: "What's your main goal?", options: goalOptions, multiple: false },
  { key: 'dailyStudyTime', heading: 'How much time can you study each day?', options: dailyStudyTimeOptions, multiple: false },
  { key: 'timeline', heading: 'When do you want to achieve your goal?', options: timelineOptions, multiple: false },
  { key: 'learningStyle', heading: 'How do you prefer to learn?', options: learningStyleOptions, multiple: true },
];

// step 0 = name, 1..5 = questions[step-1], 6 = completion.
const TOTAL = questions.length + 1; // +1 for the name question — "1 of 6".

// The one flow in this app reached only by a redirect (app/_layout.tsx's
// AuthGate, right after signup) rather than a button anywhere — there's
// nothing to navigate back out of into, by design: signup created the
// account, this is where it actually gets personalized, and the
// completion screen's "Start Learning" is the only way through.
export function OnboardingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { userId } = useAuthState();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(emptyAnswers);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Smooth slide+fade between questions — reset to 0 then animated to 1
  // every time `step` changes, direction read from a ref set right before
  // the step change so it doesn't need to be a dependency of the effect.
  const anim = useRef(new Animated.Value(1)).current;
  const directionRef = useRef<1 | -1>(1);

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [24 * directionRef.current, 0] });

  function go(next: number, direction: 1 | -1) {
    directionRef.current = direction;
    setError('');
    setStep(next);
  }

  function back() {
    if (step > 0) go(step - 1, -1);
  }

  function continueFromName() {
    if (!answers.name.trim()) {
      setError('Please enter your first name.');
      return;
    }
    go(1, 1);
  }

  function selectSingle(key: QuestionKey, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    // Same brief-delay-then-advance pattern used everywhere else in this
    // app a single tap both selects and moves on (e.g. the More menu's
    // predecessors) — long enough to see the selection land, short enough
    // to feel instant.
    setTimeout(() => go(step + 1, 1), 280);
  }

  function toggleMulti(key: 'learningStyle', value: string) {
    setAnswers((a) => {
      const current = a[key];
      return { ...a, [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] };
    });
  }

  async function finish() {
    if (!userId) {
      setError('Something went wrong — please try again.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await completeOnboarding(answers, userId);
      router.replace('/');
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  const isQuestionStep = step >= 0 && step < TOTAL;
  const currentQuestion = step >= 1 && step <= questions.length ? questions[step - 1] : null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            {isQuestionStep && (
              <View style={styles.chrome}>
                <View style={styles.chromeRow}>
                  <Pressable
                    onPress={back}
                    disabled={step === 0}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Back"
                    style={[styles.backButton, step === 0 && styles.backButtonHidden]}>
                    <Ionicons name="chevron-back" size={20} color={theme.text} />
                  </Pressable>
                  <ThemedText themeColor="textSecondary" style={styles.stepLabel}>
                    {step + 1} of {TOTAL}
                  </ThemedText>
                  <View style={styles.backButton} />
                </View>
                <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                  <View style={[styles.progressFill, { backgroundColor: theme.primary, width: `${((step + 1) / TOTAL) * 100}%` }]} />
                </View>
              </View>
            )}

            <Animated.View style={{ opacity: anim, transform: [{ translateX }] }}>
              {step === 0 && (
                <NameQuestion
                  value={answers.name}
                  onChange={(name) => setAnswers((a) => ({ ...a, name }))}
                  onContinue={continueFromName}
                />
              )}

              {currentQuestion && (
                <OptionsQuestion
                  heading={currentQuestion.heading}
                  options={currentQuestion.options}
                  multiple={currentQuestion.multiple}
                  selected={currentQuestion.multiple ? (answers[currentQuestion.key] as string[]) : (answers[currentQuestion.key] as string | null)}
                  onSelectSingle={(value) => selectSingle(currentQuestion.key, value)}
                  onToggleMulti={(value) => toggleMulti(currentQuestion.key as 'learningStyle', value)}
                  onContinue={() => go(step + 1, 1)}
                />
              )}

              {step === TOTAL && <CompletionScreen name={answers.name} submitting={submitting} onStart={finish} />}

              {error.length > 0 && (
                <ThemedText themeColor="rose" style={styles.error}>
                  {error}
                </ThemedText>
              )}
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function NameQuestion({ value, onChange, onContinue }: { value: string; onChange: (v: string) => void; onContinue: () => void }) {
  const theme = useTheme();
  return (
    <View style={styles.questionBody}>
      <ThemedText style={styles.heading}>First things first — what should we call you?</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.subtext}>
        We&apos;ll use this to personalize your Studium experience.
      </ThemedText>

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Enter your first name"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="words"
        autoFocus
        returnKeyType="done"
        onSubmitEditing={onContinue}
        style={[styles.nameInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
      />

      <Pressable
        onPress={onContinue}
        disabled={!value.trim()}
        accessibilityRole="button"
        accessibilityLabel="Continue"
        style={({ pressed }) => [
          styles.continueButton,
          { backgroundColor: theme.primary },
          !value.trim() && styles.continueButtonDisabled,
          pressed && !!value.trim() && styles.continueButtonPressed,
        ]}>
        <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
      </Pressable>
    </View>
  );
}

function OptionsQuestion({
  heading,
  options,
  multiple,
  selected,
  onSelectSingle,
  onToggleMulti,
  onContinue,
}: {
  heading: string;
  options: string[];
  multiple: boolean;
  selected: string | string[] | null;
  onSelectSingle: (value: string) => void;
  onToggleMulti: (value: string) => void;
  onContinue: () => void;
}) {
  const theme = useTheme();
  const selectedList = multiple ? (selected as string[]) : [];
  const canContinue = multiple && selectedList.length > 0;

  return (
    <View style={styles.questionBody}>
      <ThemedText style={styles.heading}>{heading}</ThemedText>
      {multiple && (
        <ThemedText themeColor="textSecondary" style={styles.subtext}>
          Select all that apply.
        </ThemedText>
      )}

      <View style={styles.optionList}>
        {options.map((opt) => {
          const isSelected = multiple ? selectedList.includes(opt) : selected === opt;
          return (
            <View key={opt} style={[styles.optionShadow, Shadow.card]}>
              <Pressable
                onPress={() => (multiple ? onToggleMulti(opt) : onSelectSingle(opt))}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={opt}
                style={[
                  styles.optionCard,
                  {
                    borderColor: isSelected ? theme.primary : theme.border,
                    backgroundColor: isSelected ? theme.primaryMuted : theme.backgroundElement,
                  },
                ]}>
                <ThemedText style={[styles.optionText, isSelected && { color: theme.primary }]}>{opt}</ThemedText>
                <View
                  style={[
                    styles.checkCircle,
                    isSelected ? { borderColor: theme.primary, backgroundColor: theme.primary } : { borderColor: theme.border },
                  ]}>
                  {isSelected && <Ionicons name="checkmark" size={12} strokeWidth={1} color="#FFFFFF" />}
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>

      {multiple && (
        <Pressable
          onPress={onContinue}
          disabled={!canContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          style={({ pressed }) => [
            styles.continueButton,
            { backgroundColor: theme.primary },
            !canContinue && styles.continueButtonDisabled,
            pressed && canContinue && styles.continueButtonPressed,
          ]}>
          <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

function CompletionScreen({ name, submitting, onStart }: { name: string; submitting: boolean; onStart: () => void }) {
  const theme = useTheme();
  const firstName = name.trim().split(/\s+/)[0] || 'there';

  return (
    <View style={styles.completionBody}>
      <View style={[styles.completionIcon, { backgroundColor: theme.primaryMuted }]}>
        <Ionicons name="checkmark-circle" size={32} color={theme.primary} />
      </View>
      <ThemedText style={[styles.heading, styles.completionText]}>You&apos;re all set, {firstName}.</ThemedText>
      <ThemedText themeColor="textSecondary" style={[styles.subtext, styles.completionText]}>
        We&apos;ve personalized Studium around your goals and learning preferences.
      </ThemedText>

      <Pressable
        onPress={onStart}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityLabel="Start Learning"
        style={({ pressed }) => [
          styles.startButton,
          { backgroundColor: theme.primary },
          submitting && styles.continueButtonDisabled,
          pressed && !submitting && styles.continueButtonPressed,
        ]}>
        <ThemedText style={styles.continueButtonText}>{submitting ? 'Setting up…' : 'Start Learning'}</ThemedText>
        {!submitting && <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: Spacing.six,
  },
  inner: {
    width: '100%',
    maxWidth: 480,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  chrome: {
    marginBottom: Spacing.four,
  },
  chromeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonHidden: {
    opacity: 0,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  progressTrack: {
    height: 5,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  questionBody: {
    gap: 6,
  },
  heading: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtext: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.two,
  },
  nameInput: {
    marginTop: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 17,
    fontWeight: '600',
  },
  optionList: {
    marginTop: Spacing.three,
    gap: 10,
  },
  optionShadow: {
    borderRadius: Radius.lg,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.four,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    minHeight: 52,
  },
  continueButtonDisabled: {
    opacity: 0.4,
  },
  continueButtonPressed: {
    opacity: 0.88,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  error: {
    marginTop: Spacing.three,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  completionBody: {
    alignItems: 'center',
    paddingTop: Spacing.six,
    gap: 6,
  },
  completionIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  completionText: {
    textAlign: 'center',
    maxWidth: 340,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.five,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.six,
    paddingVertical: 16,
    minHeight: 52,
  },
});
