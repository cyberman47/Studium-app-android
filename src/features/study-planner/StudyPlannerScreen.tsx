import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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

import { DateField } from '@/components/date-field';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Radius, Shadow, Spacing } from '@/constants/theme';
import { useAuthState } from '@/features/auth/store';
import { useTheme } from '@/hooks/use-theme';
import { educationTrackLabel } from '@/lib/educationTrack';
import {
  getCurrentWeeklyPlan,
  getPlannerOnboarding,
  getTaskCompletion,
  PlannerOnboarding,
  requestWeeklyPlan,
  setPlannerOnboarding,
  toggleTaskDone,
  weekdayOptions,
  Weekday,
  WeeklyPlan,
} from '@/lib/studyPlanner';
import { supabase } from '@/lib/supabase';

const EXAM_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidFutureDate(value: string): boolean {
  if (!EXAM_DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed.getTime() >= today.getTime();
}

const ACTIVITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  learn: 'book-outline',
  active_recall: 'flash-outline',
  flashcards: 'albums-outline',
  practice_questions: 'help-circle-outline',
  mistake_review: 'refresh-outline',
  cumulative_review: 'layers-outline',
  timed_practice: 'timer-outline',
  practice_exam: 'document-text-outline',
  clinical_case: 'medkit-outline',
  ai_tutoring: 'chatbubbles-outline',
};

const WIZARD_STEPS = 4; // exam date, hours/week, confidence, preferred days

type Phase = 'loading' | 'wizard' | 'generating' | 'results';

// The mobile MVP of studium-website's Study Planner, now asked the same
// way the onboarding flow already asks its questions — one page, one
// question, an animated slide between them, a progress bar up top —
// instead of one long form. Reuses that exact visual language (chrome,
// heading/subtext sizes, the pill "Continue" button, the auto-advance
// single-select pattern) rather than inventing a second wizard grammar
// for the same app. See src/lib/studyPlanner.ts for exactly what is and
// isn't built yet (no roadmap/weekly-review UI).
export function StudyPlannerScreen() {
  const theme = useTheme();
  const { userId } = useAuthState();

  const [phase, setPhase] = useState<Phase>('loading');
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('Your track');

  const [examDate, setExamDate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('10');
  const [confidence, setConfidence] = useState(5);
  const [preferredDays, setPreferredDays] = useState<Weekday[]>([]);

  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [completion, setCompletion] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');

  // Same slide+fade transition onboarding uses between questions.
  const anim = useRef(new Animated.Value(1)).current;
  const directionRef = useRef<1 | -1>(1);
  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, phase]);
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [24 * directionRef.current, 0] });

  function go(next: number, direction: 1 | -1) {
    directionRef.current = direction;
    setStep(next);
  }
  function back() {
    if (step > 0) go(step - 1, -1);
  }

  // Prefill the goal from the student's real education_track and restore
  // any previously saved wizard answers / already-generated plan, so
  // reopening this screen doesn't discard a real plan the student
  // already has for this week.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [existingPlan, savedOnboarding] = await Promise.all([getCurrentWeeklyPlan(), getPlannerOnboarding()]);
      if (userId) {
        const { data } = await supabase.from('profiles').select('education_track').eq('id', userId).maybeSingle();
        if (!cancelled) setGoal(educationTrackLabel(data?.education_track));
      }
      if (cancelled) return;

      if (savedOnboarding) {
        setExamDate(savedOnboarding.examDate);
        setHoursPerWeek(String(savedOnboarding.hoursPerWeek));
        setConfidence(savedOnboarding.confidence);
        setPreferredDays(savedOnboarding.preferredDays);
      }

      if (existingPlan) {
        setPlan(existingPlan);
        setCompletion(await getTaskCompletion(existingPlan.weekStartDateKey));
        setPhase('results');
      } else {
        setPhase('wizard');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const dateValid = isValidFutureDate(examDate);
  const hoursValid = (() => {
    const n = Number(hoursPerWeek);
    return Number.isFinite(n) && n > 0;
  })();

  function toggleDay(day: Weekday) {
    setPreferredDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  function startWizard() {
    setError('');
    setStep(0);
    setPhase('wizard');
  }

  async function generate() {
    setError('');
    setPhase('generating');
    const onboarding: PlannerOnboarding = { goal, examDate, confidence, hoursPerWeek: Number(hoursPerWeek), preferredDays };
    await setPlannerOnboarding(onboarding);
    const result = await requestWeeklyPlan(onboarding);
    if (!result.ok) {
      setError(result.error);
      setPhase('wizard');
      return;
    }
    setPlan(result.plan);
    setCompletion({});
    setPhase('results');
  }

  async function handleToggleTask(taskId: string) {
    if (!plan) return;
    const next = await toggleTaskDone(plan.weekStartDateKey, taskId);
    setCompletion(next);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            {phase === 'wizard' ? (
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
                    {step + 1} of {WIZARD_STEPS}
                  </ThemedText>
                  <View style={styles.backButton} />
                </View>
                <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                  <View style={[styles.progressFill, { backgroundColor: theme.primary, width: `${((step + 1) / WIZARD_STEPS) * 100}%` }]} />
                </View>
              </View>
            ) : (
              <ScreenHeader title="Study Planner" />
            )}

            {phase === 'loading' && (
              <View style={styles.centerFill}>
                <ActivityIndicator color={theme.primary} />
              </View>
            )}

            <Animated.View style={{ opacity: phase === 'wizard' ? anim : 1, transform: [{ translateX: phase === 'wizard' ? translateX : 0 }] }}>
              {phase === 'wizard' && step === 0 && (
                <View style={styles.questionBody}>
                  <ThemedText style={styles.heading}>When's your exam?</ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.subtext}>
                    We&apos;ll build this week&apos;s plan around it — {goal}.
                  </ThemedText>

                  <View style={styles.dateFieldWrap}>
                    <DateField
                      value={examDate}
                      onChange={setExamDate}
                      placeholder="Select your exam date"
                      minimumDate={new Date()}
                      accessibilityLabel="Exam date"
                    />
                  </View>

                  <Pressable
                    onPress={() => go(1, 1)}
                    disabled={!dateValid}
                    accessibilityRole="button"
                    accessibilityLabel="Continue"
                    style={({ pressed }) => [
                      styles.continueButton,
                      { backgroundColor: theme.primary },
                      !dateValid && styles.continueButtonDisabled,
                      pressed && dateValid && styles.continueButtonPressed,
                    ]}>
                    <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
                  </Pressable>
                </View>
              )}

              {phase === 'wizard' && step === 1 && (
                <TextQuestion
                  heading="How many hours can you study this week?"
                  subtext="Be realistic — the plan paces itself around this."
                  value={hoursPerWeek}
                  onChange={setHoursPerWeek}
                  placeholder="10"
                  keyboardType="number-pad"
                  maxLength={3}
                  suffix="hours / week"
                  canContinue={hoursValid}
                  onContinue={() => go(2, 1)}
                />
              )}

              {phase === 'wizard' && step === 2 && (
                <View style={styles.questionBody}>
                  <ThemedText style={styles.heading}>How confident do you feel right now?</ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.subtext}>
                    1 = just starting out, 10 = ready to sit the exam today.
                  </ThemedText>
                  <View style={styles.scaleGrid}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                      const active = confidence === n;
                      return (
                        <Pressable
                          key={n}
                          onPress={() => {
                            setConfidence(n);
                            setTimeout(() => go(3, 1), 280);
                          }}
                          accessibilityRole="button"
                          accessibilityState={{ selected: active }}
                          accessibilityLabel={`Confidence ${n} out of 10`}
                          style={[
                            styles.scalePill,
                            { borderColor: active ? theme.primary : theme.border, backgroundColor: active ? theme.primary : theme.backgroundElement },
                          ]}>
                          <ThemedText style={[styles.scaleText, { color: active ? '#FFFFFF' : theme.text }]}>{n}</ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}

              {phase === 'wizard' && step === 3 && (
                <View style={styles.questionBody}>
                  <ThemedText style={styles.heading}>Which days do you usually study?</ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.subtext}>
                    Optional — leave it blank if it varies week to week.
                  </ThemedText>
                  <View style={styles.dayGrid}>
                    {weekdayOptions.map(({ id, label }) => {
                      const active = preferredDays.includes(id);
                      return (
                        <Pressable
                          key={id}
                          onPress={() => toggleDay(id)}
                          accessibilityRole="button"
                          accessibilityState={{ selected: active }}
                          accessibilityLabel={label}
                          style={[
                            styles.dayPill,
                            { borderColor: active ? theme.primary : theme.border, backgroundColor: active ? theme.primaryMuted : theme.backgroundElement },
                          ]}>
                          <ThemedText style={[styles.dayText, active && { color: theme.primary }]}>{label}</ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>

                  {error.length > 0 && (
                    <View style={[styles.errorBox, { backgroundColor: theme.roseMuted }]}>
                      <ThemedText themeColor="rose" style={styles.errorText}>
                        {error}
                      </ThemedText>
                    </View>
                  )}

                  <Pressable
                    onPress={generate}
                    accessibilityRole="button"
                    accessibilityLabel="Generate my week"
                    style={({ pressed }) => [styles.continueButton, { backgroundColor: theme.accent }, pressed && styles.continueButtonPressed]}>
                    <ThemedText style={styles.continueButtonText}>Generate my week</ThemedText>
                    <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                  </Pressable>
                </View>
              )}

              {phase === 'generating' && (
                <View style={styles.generatingBody}>
                  <View style={[styles.generatingIcon, { backgroundColor: theme.primaryMuted }]}>
                    <ActivityIndicator color={theme.primary} />
                  </View>
                  <ThemedText style={[styles.heading, styles.centeredText]}>Building your week…</ThemedText>
                  <ThemedText themeColor="textSecondary" style={[styles.subtext, styles.centeredText]}>
                    Studium AI is turning that into a real plan — this can take up to a minute.
                  </ThemedText>
                </View>
              )}

              {phase === 'results' && plan && (
                <View style={styles.resultsBody}>
                  <View style={[styles.goalCard, Shadow.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                    <ThemedText themeColor="textSecondary" style={styles.goalCaption}>
                      THIS WEEK'S GOAL
                    </ThemedText>
                    <ThemedText style={styles.goalText}>{plan.weeklyGoal}</ThemedText>
                  </View>

                  {plan.priorities.length > 0 && (
                    <View style={styles.section}>
                      <ThemedText style={styles.sectionLabel}>Priorities</ThemedText>
                      {plan.priorities.map((p, i) => (
                        <View key={i} style={[styles.priorityRow, { borderColor: theme.border }]}>
                          <ThemedText style={styles.priorityTitle}>
                            {p.subject} · {p.topic}
                          </ThemedText>
                          <ThemedText themeColor="textSecondary" style={styles.hint}>
                            {p.reason}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.section}>
                    <ThemedText style={styles.sectionLabel}>Tasks</ThemedText>
                    {plan.tasks.map((task) => {
                      const done = !!completion[task.id];
                      return (
                        <Pressable
                          key={task.id}
                          onPress={() => handleToggleTask(task.id)}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: done }}
                          accessibilityLabel={task.title}
                          style={[styles.taskRow, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
                          <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={done ? theme.primary : theme.textSecondary} />
                          <View style={styles.taskBody}>
                            <ThemedText style={[styles.taskTitle, done && styles.taskTitleDone]}>{task.title}</ThemedText>
                            <View style={styles.taskMetaRow}>
                              <Ionicons name={ACTIVITY_ICONS[task.activityType] ?? 'book-outline'} size={12} color={theme.textSecondary} />
                              <ThemedText themeColor="textSecondary" style={styles.taskMeta}>
                                {task.subject} · {task.durationMinutes} min
                              </ThemedText>
                            </View>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>

                  {plan.tips.length > 0 && (
                    <View style={styles.section}>
                      <ThemedText style={styles.sectionLabel}>Tips</ThemedText>
                      {plan.tips.map((tip, i) => (
                        <View key={i} style={styles.tipRow}>
                          <Ionicons name="bulb-outline" size={14} color={theme.amber} />
                          <ThemedText themeColor="textSecondary" style={styles.tipText}>
                            {tip}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  )}

                  <Pressable
                    onPress={startWizard}
                    accessibilityRole="button"
                    accessibilityLabel="Create a new plan"
                    style={({ pressed }) => [styles.secondaryButton, { borderColor: theme.border }, pressed && { backgroundColor: theme.backgroundSelected }]}>
                    <ThemedText style={styles.secondaryText}>Create a new plan</ThemedText>
                  </Pressable>
                </View>
              )}
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TextQuestion({
  heading,
  subtext,
  value,
  onChange,
  placeholder,
  keyboardType,
  maxLength,
  suffix,
  invalidHint,
  canContinue,
  onContinue,
}: {
  heading: string;
  subtext: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  keyboardType: 'numbers-and-punctuation' | 'number-pad';
  maxLength: number;
  suffix?: string;
  invalidHint?: string;
  canContinue: boolean;
  onContinue: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.questionBody}>
      <ThemedText style={styles.heading}>{heading}</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.subtext}>
        {subtext}
      </ThemedText>

      <View style={styles.textInputRow}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={() => canContinue && onContinue()}
          style={[styles.textInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
        />
        {suffix && (
          <ThemedText themeColor="textSecondary" style={styles.textInputSuffix}>
            {suffix}
          </ThemedText>
        )}
      </View>
      {invalidHint && (
        <ThemedText themeColor="rose" style={styles.hint}>
          {invalidHint}
        </ThemedText>
      )}

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
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  content: { alignItems: 'center', paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: MaxContentWidth, paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: 16 },
  centerFill: { paddingTop: Spacing.six, alignItems: 'center' },

  chrome: { marginBottom: Spacing.two },
  chromeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.three },
  backButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backButtonHidden: { opacity: 0 },
  stepLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  progressTrack: { height: 5, borderRadius: Radius.pill, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: Radius.pill },

  questionBody: { gap: 6 },
  heading: { fontSize: 25, lineHeight: 31, fontWeight: '800', letterSpacing: -0.3 },
  subtext: { fontSize: 14, lineHeight: 20, marginBottom: Spacing.two },
  centeredText: { textAlign: 'center' },

  textInputRow: { marginTop: Spacing.four, gap: 6 },
  dateFieldWrap: { marginTop: Spacing.four },
  textInput: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 17,
    fontWeight: '600',
  },
  textInputSuffix: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
  hint: { fontSize: 12, marginTop: 4 },

  scaleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: Spacing.four },
  scalePill: {
    width: 52,
    height: 52,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleText: { fontSize: 16, fontWeight: '800' },

  dayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: Spacing.four },
  dayPill: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
  },
  dayText: { fontSize: 14, fontWeight: '700' },

  errorBox: { borderRadius: Radius.md, padding: 12, marginTop: Spacing.four },
  errorText: { fontSize: 13, fontWeight: '600' },

  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.four,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    minHeight: 52,
  },
  continueButtonDisabled: { opacity: 0.4 },
  continueButtonPressed: { opacity: 0.88 },
  continueButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },

  generatingBody: { alignItems: 'center', paddingTop: Spacing.six, gap: 6 },
  generatingIcon: { width: 64, height: 64, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.two },

  resultsBody: { gap: 16 },
  goalCard: { borderRadius: Radius.lg, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 6 },
  goalCaption: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  goalText: { fontSize: 16, fontWeight: '800', lineHeight: 22 },
  section: { gap: 8 },
  sectionLabel: { fontSize: 13, fontWeight: '700' },
  priorityRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, gap: 2 },
  priorityTitle: { fontSize: 13, fontWeight: '700' },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    padding: 12,
  },
  taskBody: { flex: 1, gap: 4 },
  taskTitle: { fontSize: 14, fontWeight: '700' },
  taskTitleDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  taskMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  taskMeta: { fontSize: 11, fontWeight: '600' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tipText: { fontSize: 13, flex: 1, lineHeight: 18 },
  secondaryButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontSize: 14, fontWeight: '700' },
});
