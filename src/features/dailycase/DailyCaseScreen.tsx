import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InteractiveText } from '@/components/interactive-text';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { ClinicalCase } from './data';
import { getCaseOfTheDay, getCaseRewardKP, getCaseRewardLabel, getCaseRewardTier } from './logic';
import { submitCaseDiagnosis, useTodayCaseAttempt } from './store';

const difficultyColor: Record<string, 'amber' | 'primary' | 'rose'> = {
  Beginner: 'primary',
  Intermediate: 'amber',
  Advanced: 'rose',
};

// The full Daily Medical Case experience — previously a small MCQ inside
// a Home card's own bottom-sheet Modal, now its own screen (per
// feedback), and rebuilt to actually match the real progressive-reveal
// format the web app uses (app/dashboard/(main)/case-of-the-day/
// page.tsx): the patient's story unfolds one real beat at a time via
// "Continue the Story" rather than dumping the whole vignette at once,
// diagnosing earlier (with less revealed) earns more KP, and the result
// view shows the rationale for every option, not just the correct one.
//
// KP shown here is informational feedback only (matching the real
// tiered formula in logic.ts) — it does NOT get written to the real
// Supabase profiles.total_kp shown elsewhere in the app. Actually
// claiming case KP into that real column is real-backend work this
// screen doesn't attempt; showing a fabricated increment against a
// genuinely-synced field would be the dishonest direction to guess at,
// so this stays a local congratulatory readout, clearly not double-
// counted anywhere else.
export function DailyCaseScreen() {
  const theme = useTheme();
  const router = useRouter();
  const todaysCase = useMemo(() => getCaseOfTheDay(), []);

  // Medical Cases content was removed (clinicalCases.ts is intentionally
  // empty, pending a real Supabase-backed source — see logic.ts), so
  // getCaseOfTheDay genuinely has nothing to hand back some days. An
  // honest blank state instead of the case UI, rather than crashing on
  // a null case's fields.
  if (!todaysCase) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={styles.inner}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Back">
              <Ionicons name="chevron-back" size={22} color={theme.text} />
            </Pressable>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.backgroundSelected }]}>
              <Ionicons name="pulse-outline" size={22} color={theme.textSecondary} />
            </View>
            <ThemedText style={styles.emptyTitle}>No case available right now</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyText}>
              Check back soon — new cases are on the way.
            </ThemedText>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return <DailyCaseContent todaysCase={todaysCase} router={router} theme={theme} />;
}

// Split out so the hooks below (useState, derived values) only ever run
// against a real, non-null case — the early return above already handled
// "no case today", so this component's props guarantee one exists.
function DailyCaseContent({
  todaysCase,
  router,
  theme,
}: {
  todaysCase: ClinicalCase;
  router: ReturnType<typeof useRouter>;
  theme: ReturnType<typeof useTheme>;
}) {
  const totalBeats = todaysCase.narrative.length;

  const attempt = useTodayCaseAttempt();
  const solved = !!attempt && attempt.caseId === todaysCase.id;

  const [beatsRevealed, setBeatsRevealed] = useState(solved ? (attempt!.beatsRevealed ?? totalBeats) : 0);
  const [selected, setSelected] = useState<number | null>(solved ? attempt!.selectedIndex : null);
  const [showFullCase, setShowFullCase] = useState(false);

  const allBeatsRevealed = beatsRevealed >= totalBeats;
  const tier = getCaseRewardTier(beatsRevealed, totalBeats);
  const potentialKP = getCaseRewardKP(beatsRevealed, totalBeats);
  // Warmer tint the more of the story has been used — highest/high stay
  // teal (the "still earning a good reward" state), moderate shifts to
  // amber, minimal (everything revealed) reads as neutral.
  const stakesTint =
    tier === 'minimal'
      ? { bg: theme.backgroundSelected, text: 'textSecondary' as const }
      : tier === 'moderate'
        ? { bg: theme.amberMuted, text: 'amber' as const }
        : { bg: theme.primaryMuted, text: 'primary' as const };

  function revealNextBeat() {
    if (!solved && beatsRevealed < totalBeats) setBeatsRevealed((n) => n + 1);
  }

  function handleDiagnose() {
    if (selected === null || solved) return;
    const correct = selected === todaysCase.correctIndex;
    const kp = correct ? getCaseRewardKP(beatsRevealed, totalBeats) : 0;
    submitCaseDiagnosis(todaysCase.id, selected, correct, beatsRevealed, kp);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Back">
              <Ionicons name="chevron-back" size={22} color={theme.text} />
            </Pressable>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.eyebrowRow}>
            <Ionicons name="medkit-outline" size={13} color={theme.primary} />
            <ThemedText themeColor="primary" style={styles.eyebrowText}>
              DAILY MEDICAL CASE
            </ThemedText>
          </View>
          <ThemedText style={styles.title}>{todaysCase.title}</ThemedText>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText themeColor="textSecondary" style={styles.badgeText}>
                {todaysCase.category}
              </ThemedText>
            </View>
            <View style={[styles.badge, { backgroundColor: theme[`${difficultyColor[todaysCase.difficulty]}Muted`] }]}>
              <ThemedText themeColor={difficultyColor[todaysCase.difficulty]} style={styles.badgeText}>
                {todaysCase.difficulty}
              </ThemedText>
            </View>
            {solved && (
              <View style={[styles.badge, styles.solvedBadge, { backgroundColor: theme.primaryMuted }]}>
                <Ionicons name="checkmark-circle" size={12} color={theme.primary} />
                <ThemedText themeColor="primary" style={styles.badgeText}>
                  Solved today
                </ThemedText>
              </View>
            )}
          </View>

          {/* The patient's story */}
          <View style={[styles.cardShadow, Shadow.card]}>
            <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <View style={styles.introRow}>
                <View style={[styles.introIcon, { backgroundColor: theme.primaryMuted }]}>
                  <Ionicons name="pulse-outline" size={15} color={theme.primary} />
                </View>
                <InteractiveText text={todaysCase.patientIntro} style={styles.introText} themeColor="textSecondary" />
              </View>

              {totalBeats > 0 && (
                <>
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  <View style={styles.beats}>
                    {todaysCase.narrative.map((beat, i) => {
                      const revealed = i < beatsRevealed;
                      if (revealed) {
                        return (
                          <Animated.View
                            key={i}
                            entering={FadeInDown.duration(220)}
                            style={[styles.beatRevealed, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
                            <View style={[styles.beatDot, { backgroundColor: theme.primary }]} />
                            <InteractiveText text={beat} style={styles.beatText} />
                          </Animated.View>
                        );
                      }
                      return (
                        <View key={i} style={[styles.beatLocked, { borderColor: theme.border }]}>
                          <Ionicons name="lock-closed-outline" size={12} color={theme.textSecondary} />
                          <ThemedText themeColor="textSecondary" style={styles.beatLockedText}>
                            More of the story — not yet revealed
                          </ThemedText>
                        </View>
                      );
                    })}
                  </View>

                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  <View style={styles.revealFooter}>
                    <ThemedText themeColor="textSecondary" style={styles.revealCount}>
                      {beatsRevealed} / {totalBeats} revealed
                    </ThemedText>
                    {!solved && !allBeatsRevealed && (
                      <Pressable
                        onPress={revealNextBeat}
                        accessibilityRole="button"
                        accessibilityLabel="Continue the story"
                        style={({ pressed }) => [styles.continueButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
                        <Ionicons name="sparkles" size={13} color="#FFFFFF" />
                        <ThemedText style={styles.continueButtonText}>Continue the Story</ThemedText>
                      </Pressable>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Reward stakes */}
          {!solved && totalBeats > 0 && (
            <View style={[styles.stakesRow, { backgroundColor: stakesTint.bg, borderColor: theme.border }]}>
              <View style={styles.stakesLeft}>
                <Ionicons name="flash" size={13} color={theme[stakesTint.text]} />
                <ThemedText themeColor={stakesTint.text} style={styles.stakesLabel}>
                  {getCaseRewardLabel(tier)}
                </ThemedText>
              </View>
              <ThemedText themeColor={stakesTint.text} style={styles.stakesValue}>
                +{potentialKP} KP if correct
              </ThemedText>
            </View>
          )}

          {/* Diagnosis */}
          <View style={[styles.cardShadow, Shadow.card]}>
            <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <InteractiveText text={todaysCase.question} style={styles.question} />
              <View style={styles.options}>
                {todaysCase.options.map((option, i) => {
                  const isCorrect = i === todaysCase.correctIndex;
                  const isSelected = selected === i;
                  let borderColor: string = theme.border;
                  let bg: string = 'transparent';
                  let dimmed = false;
                  if (solved) {
                    if (isCorrect) {
                      borderColor = theme.primary;
                      bg = theme.primaryMuted;
                    } else if (isSelected) {
                      borderColor = theme.rose;
                      bg = theme.roseMuted;
                    } else {
                      dimmed = true;
                    }
                  } else if (isSelected) {
                    borderColor = theme.primary;
                    bg = theme.primaryMuted;
                  }
                  return (
                    <Pressable
                      key={i}
                      disabled={solved}
                      onPress={() => setSelected(i)}
                      accessibilityRole="button"
                      accessibilityLabel={option}
                      style={[styles.option, { borderColor, backgroundColor: bg }, dimmed && styles.optionDimmed]}>
                      <ThemedText style={styles.optionText}>{option}</ThemedText>
                      {solved && isCorrect && <Ionicons name="checkmark-circle" size={17} color={theme.primary} />}
                      {solved && isSelected && !isCorrect && <Ionicons name="close-circle" size={17} color={theme.rose} />}
                    </Pressable>
                  );
                })}
              </View>

              {!solved && (
                <Pressable
                  onPress={handleDiagnose}
                  disabled={selected === null}
                  accessibilityRole="button"
                  accessibilityLabel="Make diagnosis"
                  style={({ pressed }) => [
                    styles.diagnoseButton,
                    { backgroundColor: theme.accent },
                    selected === null && styles.pressed,
                    pressed && selected !== null && styles.diagnoseButtonPressed,
                  ]}>
                  <ThemedText style={styles.diagnoseButtonText}>Make Diagnosis</ThemedText>
                </Pressable>
              )}
            </View>
          </View>

          {/* Result */}
          {solved && attempt && (
            <View style={[styles.cardShadow, Shadow.card]}>
              <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <ThemedText themeColor={attempt.correct ? 'primary' : 'rose'} style={styles.resultTitle}>
                  {attempt.correct ? 'Correct diagnosis!' : 'Not quite.'}
                </ThemedText>

                <ThemedText themeColor="textSecondary" style={styles.resultSectionLabel}>
                  WHY {attempt.correct ? 'IT WAS CORRECT' : `THE ANSWER IS "${todaysCase.options[todaysCase.correctIndex].toUpperCase()}"`}
                </ThemedText>
                <InteractiveText text={todaysCase.optionRationales[todaysCase.correctIndex]} style={styles.resultBody} themeColor="textSecondary" />

                {todaysCase.keyClues.length > 0 && (
                  <>
                    <ThemedText themeColor="textSecondary" style={[styles.resultSectionLabel, styles.resultSectionSpacing]}>
                      KEY CLUES YOU SHOULD HAVE NOTICED
                    </ThemedText>
                    <View style={styles.cluesList}>
                      {todaysCase.keyClues.map((clue, i) => (
                        <View key={i} style={styles.clueRow}>
                          <Ionicons name="sparkles" size={12} color={theme.amber} style={styles.clueIcon} />
                          <InteractiveText text={clue} style={styles.resultBody} themeColor="textSecondary" />
                        </View>
                      ))}
                    </View>
                  </>
                )}

                <ThemedText themeColor="textSecondary" style={[styles.resultSectionLabel, styles.resultSectionSpacing]}>
                  WHY THE OTHER OPTIONS WERE LESS LIKELY
                </ThemedText>
                <View style={styles.cluesList}>
                  {todaysCase.options.map((option, i) =>
                    i === todaysCase.correctIndex ? null : (
                      <ThemedText key={i} style={styles.resultBody}>
                        <ThemedText style={styles.optionLabel}>{option}: </ThemedText>
                        <InteractiveText text={todaysCase.optionRationales[i]} themeColor="textSecondary" />
                      </ThemedText>
                    )
                  )}
                </View>

                <View style={[styles.kpBanner, { backgroundColor: theme.backgroundSelected }]}>
                  <ThemedText style={styles.kpBannerText}>
                    {attempt.correct && attempt.kpAwarded ? `+${attempt.kpAwarded} KP earned` : 'No KP earned this time'}
                  </ThemedText>
                  {attempt.correct && totalBeats > 0 && (
                    <ThemedText themeColor="textSecondary" style={styles.kpBannerCaption}>
                      Diagnosed with {attempt.beatsRevealed} of {totalBeats} details revealed
                    </ThemedText>
                  )}
                </View>

                <View style={styles.resultActions}>
                  {!showFullCase && totalBeats > 0 && (
                    <Pressable
                      onPress={() => {
                        setShowFullCase(true);
                        setBeatsRevealed(totalBeats);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="View full case"
                      style={({ pressed }) => [styles.secondaryButton, { borderColor: theme.border }, pressed && styles.pressed]}>
                      <ThemedText style={styles.secondaryButtonText}>View Full Case</ThemedText>
                    </Pressable>
                  )}
                  <View style={[styles.secondaryButton, styles.lockedButton, { borderColor: theme.border }]}>
                    <Ionicons name="lock-closed-outline" size={13} color={theme.textSecondary} />
                    <ThemedText themeColor="textSecondary" style={styles.secondaryButtonText}>
                      Try Tomorrow's Case
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
          )}

          {solved && (
            <ThemedText themeColor="textSecondary" style={styles.comeBack}>
              Come back tomorrow for a new case.
            </ThemedText>
          )}

          <ThemedText themeColor="textSecondary" style={styles.disclaimer}>
            Studium Daily Diagnosis cases are for educational and entertainment purposes only and do not constitute
            medical advice. All cases are fictional. For any health concerns, please consult a qualified healthcare
            professional.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: MaxContentWidth, paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerSpacer: { flex: 1 },
  emptyState: { alignItems: 'center', paddingTop: 100, gap: 10 },
  emptyIcon: { width: 52, height: 52, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontSize: 15, fontWeight: '800' },
  emptyText: { fontSize: 13, textAlign: 'center' },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  eyebrowText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  title: { fontSize: 22, fontWeight: '800', lineHeight: 28, letterSpacing: -0.3 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  solvedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  cardShadow: { borderRadius: Radius.lg },
  card: { borderRadius: Radius.lg, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.four },
  introRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  introIcon: { width: 30, height: 30, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  introText: { flex: 1, fontSize: 13, lineHeight: 20 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.three },
  beats: { gap: 8 },
  beatRevealed: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 14, paddingVertical: 11 },
  beatDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  beatText: { flex: 1, fontSize: 13, lineHeight: 19 },
  beatLocked: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth, borderStyle: 'dashed', paddingHorizontal: 14, paddingVertical: 12 },
  beatLockedText: { fontSize: 12, fontWeight: '600' },
  revealFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  revealCount: { fontSize: 11, fontWeight: '700' },
  continueButton: { flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: Radius.pill, paddingHorizontal: 16, paddingVertical: 10 },
  continueButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  pressed: { opacity: 0.6 },
  stakesRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 14, paddingVertical: 12 },
  stakesLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
  stakesLabel: { fontSize: 11, fontWeight: '700' },
  stakesValue: { fontSize: 13, fontWeight: '800' },
  question: { fontSize: 16, fontWeight: '800', lineHeight: 22 },
  options: { marginTop: Spacing.three, gap: 9 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderWidth: 1.5, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 13, minHeight: 48 },
  optionDimmed: { opacity: 0.5 },
  optionText: { flex: 1, fontSize: 13, fontWeight: '700' },
  diagnoseButton: { alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, paddingVertical: 14, marginTop: Spacing.four, minHeight: 48 },
  diagnoseButtonPressed: { opacity: 0.85 },
  diagnoseButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  resultTitle: { fontSize: 16, fontWeight: '800' },
  resultSectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4, marginTop: Spacing.three },
  resultSectionSpacing: { marginTop: Spacing.four },
  resultBody: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  cluesList: { gap: 6, marginTop: 4 },
  clueRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  clueIcon: { marginTop: 3 },
  optionLabel: { fontSize: 13, fontWeight: '800' },
  kpBanner: { borderRadius: Radius.md, padding: 14, marginTop: Spacing.four, gap: 3 },
  kpBannerText: { fontSize: 14, fontWeight: '800' },
  kpBannerCaption: { fontSize: 11, fontWeight: '600' },
  resultActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: Spacing.four },
  secondaryButton: { borderRadius: Radius.pill, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingVertical: 11 },
  secondaryButtonText: { fontSize: 12, fontWeight: '700' },
  lockedButton: { flexDirection: 'row', alignItems: 'center', gap: 6, opacity: 0.7 },
  comeBack: { fontSize: 11, lineHeight: 16, paddingHorizontal: 2 },
  disclaimer: { fontSize: 10, lineHeight: 15, paddingHorizontal: 2 },
});
