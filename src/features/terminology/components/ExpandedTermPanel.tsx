import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { addFlashcardSet } from '@/features/mycontent/store';
import { addQuiz, type QuizQuestion } from '@/features/review/quizStore';

import { termGlossary, type TermEntry } from '../data';
import { getConditionsForTerm } from '../conditions';
import { setTermConfidence, toggleTermFavorite, useIsTermFavorited, useTermProgress, type TermConfidence } from '../store';

// The deep-dive view behind TermDetailSheet's "Expand" button — mirrors
// the web app's own ExpandedTermPanel (components/interactive-text.tsx
// there): definition, a plain-language explanation, why it matters
// clinically, which real ported clinical cases actually feature this
// term, related terms you can jump to in place, a familiarity control,
// and a real 2x2 actions grid (favorite / flashcard / quiz / Ask AI).
// Every field here is real authored content or a real cross-reference —
// nothing generated or fabricated at render time.
const familiarityLevels: { level: TermConfidence; label: string; dotColor: 'rose' | 'amber' | 'primary' }[] = [
  { level: 'dont-know', label: 'Unfamiliar', dotColor: 'rose' },
  { level: 'somewhat', label: 'Learning', dotColor: 'amber' },
  { level: 'know-well', label: 'Know', dotColor: 'primary' },
];

export function ExpandedTermPanel({
  initialTermId,
  visible,
  onClose,
}: {
  initialTermId: string;
  visible: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const router = useRouter();
  const [currentId, setCurrentId] = useState(initialTermId);
  const [flashcardSaved, setFlashcardSaved] = useState(false);
  const [quizSaved, setQuizSaved] = useState(false);
  const term = termGlossary.find((t) => t.id === currentId);
  const progress = useTermProgress(currentId);
  const favorited = useIsTermFavorited(currentId);

  if (currentId !== initialTermId && !visible) {
    // Reset back to the term that was actually opened once the panel is
    // fully closed, so reopening a different term never shows stale
    // "related concept" navigation from a previous visit.
    setCurrentId(initialTermId);
  }
  if (!term) return null;

  const relatedTerms = term.relatedTermIds.map((id) => termGlossary.find((t) => t.id === id)).filter((t): t is TermEntry => !!t);
  const conditions = getConditionsForTerm(term);

  function handleFamiliarity(level: TermConfidence) {
    setTermConfidence(currentId, level);
  }

  function handleSaveFlashcard() {
    addFlashcardSet(term!.term, [{ front: term!.term, back: term!.definition }]);
    setFlashcardSaved(true);
    setTimeout(() => setFlashcardSaved(false), 1500);
  }

  // A real, freshly-generated single-question quiz — not a fabricated
  // score or a fake "quiz engine": the question and 3 wrong-answer
  // distractors are pulled straight from this same real glossary, then
  // added through the same addQuiz() the Create > New Quiz screen uses,
  // so it shows up for real under Review > Quizzes afterward.
  function handleQuizMe() {
    const distractors = termGlossary
      .filter((t) => t.id !== term!.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((t) => t.definition);
    const options = [term!.definition, ...distractors].sort(() => Math.random() - 0.5);
    const question: QuizQuestion = {
      question: `What is the definition of "${term!.term}"?`,
      options,
      correctIndex: options.indexOf(term!.definition),
    };
    addQuiz(`${term!.term} — Quick Quiz`, term!.category, [question]);
    setQuizSaved(true);
    setTimeout(() => {
      setQuizSaved(false);
      onClose();
      router.push({ pathname: '/review', params: { section: 'quizzes' } });
    }, 700);
  }

  function handleAskAI() {
    onClose();
    router.push({ pathname: '/ai-chat', params: { term: term!.term } });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} style={[styles.panel, { backgroundColor: theme.backgroundElement }]}>
          {/* Fixed above the ScrollView, not inside it — a close button
              that scrolls out of reach with the content it closes is a
              trap, not a control. */}
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <ThemedText themeColor="primary" style={styles.eyebrow}>
                MEDICAL TERM
              </ThemedText>
              <ThemedText style={styles.title}>{term.term}</ThemedText>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              style={({ pressed }) => [styles.closeButton, { backgroundColor: theme.backgroundSelected }, pressed && styles.pressed]}>
              <Ionicons name="close" size={16} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              DEFINITION
            </ThemedText>
            <ThemedText style={styles.bodyText}>{term.definition}</ThemedText>

            <View style={[styles.calloutBox, { backgroundColor: theme.backgroundSelected }]}>
              <View style={styles.calloutHeader}>
                <Ionicons name="color-wand-outline" size={13} color={theme.primary} />
                <ThemedText themeColor="primary" style={styles.calloutLabel}>
                  Simple Explanation
                </ThemedText>
              </View>
              <ThemedText themeColor="textSecondary" style={styles.calloutText}>
                {term.aiExplanation}
              </ThemedText>
            </View>

            <View style={styles.sectionLabelRow}>
              <Ionicons name="medkit-outline" size={13} color={theme.textSecondary} />
              <ThemedText themeColor="textSecondary" style={styles.sectionLabelInline}>
                WHY THIS MATTERS CLINICALLY
              </ThemedText>
            </View>
            <ThemedText themeColor="textSecondary" style={styles.bodyText}>
              {term.clinicalRelevance}
            </ThemedText>

            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              COMMON CONDITIONS
            </ThemedText>
            {conditions.length > 0 ? (
              <View style={styles.chipRow}>
                {conditions.map((c) => (
                  <View key={c.id} style={[styles.chip, { borderColor: theme.border, backgroundColor: theme.background }]}>
                    <ThemedText style={styles.chipText}>{c.title}</ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.chipMeta}> · {c.category}</ThemedText>
                  </View>
                ))}
              </View>
            ) : (
              <ThemedText themeColor="textSecondary" style={styles.mutedText}>
                Not yet featured in a Clinical Case.
              </ThemedText>
            )}

            {relatedTerms.length > 0 && (
              <>
                <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
                  RELATED CONCEPTS
                </ThemedText>
                <View style={styles.chipRow}>
                  {relatedTerms.map((rt) => (
                    <Pressable
                      key={rt.id}
                      onPress={() => setCurrentId(rt.id)}
                      style={({ pressed }) => [styles.relatedChip, { backgroundColor: theme.primaryMuted }, pressed && styles.pressed]}>
                      <ThemedText themeColor="primary" style={styles.relatedChipText}>
                        {rt.term}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              YOUR FAMILIARITY
            </ThemedText>
            <View style={styles.familiarityRow}>
              {familiarityLevels.map(({ level, label, dotColor }) => {
                const active = progress?.confidence === level;
                const accent = theme[dotColor];
                const accentMuted = dotColor === 'rose' ? theme.roseMuted : dotColor === 'amber' ? theme.amberMuted : theme.primaryMuted;
                return (
                  <Pressable
                    key={level}
                    onPress={() => handleFamiliarity(level)}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityState={{ selected: active }}
                    style={({ pressed }) => [
                      styles.familiarityButton,
                      { borderColor: active ? accent : theme.border, backgroundColor: active ? accentMuted : theme.background },
                      pressed && styles.pressed,
                    ]}>
                    <View style={[styles.dot, { backgroundColor: accent }]} />
                    <ThemedText style={[styles.familiarityLabel, { color: active ? accent : theme.textSecondary }]}>{label}</ThemedText>
                  </Pressable>
                );
              })}
            </View>

            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              ACTIONS
            </ThemedText>
            <View style={styles.actionsGrid}>
              <Pressable
                onPress={() => toggleTermFavorite(currentId)}
                accessibilityRole="button"
                accessibilityLabel={favorited ? 'Unsave term' : 'Save term'}
                accessibilityState={{ selected: favorited }}
                style={({ pressed }) => [
                  styles.actionButton,
                  { borderColor: favorited ? theme.amber : theme.border, backgroundColor: favorited ? theme.amberMuted : theme.background },
                  pressed && styles.pressed,
                ]}>
                <Ionicons name={favorited ? 'bookmark' : 'bookmark-outline'} size={15} color={favorited ? theme.amber : theme.primary} />
                <ThemedText style={[styles.actionLabel, favorited && { color: theme.amber }]}>{favorited ? 'Saved' : 'Save term'}</ThemedText>
              </Pressable>

              <Pressable
                onPress={handleSaveFlashcard}
                accessibilityRole="button"
                accessibilityLabel="Create flashcard"
                style={({ pressed }) => [styles.actionButton, { borderColor: theme.border, backgroundColor: theme.background }, pressed && styles.pressed]}>
                <Ionicons name={flashcardSaved ? 'checkmark' : 'albums-outline'} size={15} color={theme.primary} />
                <ThemedText style={styles.actionLabel}>{flashcardSaved ? 'Added ✓' : 'Create flashcard'}</ThemedText>
              </Pressable>

              <Pressable
                onPress={handleQuizMe}
                accessibilityRole="button"
                accessibilityLabel="Quiz me on this"
                style={({ pressed }) => [styles.actionButton, { borderColor: theme.border, backgroundColor: theme.background }, pressed && styles.pressed]}>
                <Ionicons name={quizSaved ? 'checkmark' : 'help-circle-outline'} size={15} color={theme.primary} />
                <ThemedText style={styles.actionLabel}>{quizSaved ? 'Quiz created ✓' : 'Quiz me on this'}</ThemedText>
              </Pressable>

              <Pressable
                onPress={handleAskAI}
                accessibilityRole="button"
                accessibilityLabel="Ask Studium AI"
                style={({ pressed }) => [styles.actionButton, { borderColor: theme.border, backgroundColor: theme.background }, pressed && styles.pressed]}>
                <Ionicons name="sparkles" size={15} color={theme.primary} />
                <ThemedText style={styles.actionLabel}>Ask Studium AI</ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  panel: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '100%',
    borderRadius: Radius.xl,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  sectionLabelInline: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
  },
  calloutBox: {
    borderRadius: Radius.lg,
    padding: Spacing.three,
    marginTop: Spacing.three,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calloutLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  calloutText: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  mutedText: {
    fontSize: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chipMeta: {
    fontSize: 11,
    fontWeight: '500',
  },
  relatedChip: {
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  relatedChipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: Spacing.five,
  },
  familiarityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  familiarityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingVertical: 11,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  familiarityLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
});
