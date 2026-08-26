import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, PanResponder, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { addFlashcardSet } from '@/features/mycontent/store';
import { addQuiz, type QuizQuestion } from '@/features/review/quizStore';

import { termGlossary, type TermEntry } from '../data';
import { getConditionsForTerm } from '../conditions';
import {
  recordTermPressed,
  setTermConfidence,
  toggleTermFavorite,
  useIsTermFavorited,
  useTermProgress,
  type TermConfidence,
} from '../store';

// The definition popup a yellow term opens into — shared by Review >
// Terminology and InteractiveText (components/interactive-text.tsx), so a
// term tapped from a case narrative or a lesson and a term tapped from the
// Terminology browse list are the exact same progress state, not two
// parallel systems.
//
// Same continuous-transform architecture as the "New Word" vocabulary card
// (features/vocabulary/components/VocabularyWordCard.tsx) rather than the
// two-modal (quick popup + separate "Expand" modal) design this replaces:
// one Animated.View, driven by a single `progress` value (0 = compact,
// 1 = fully expanded), grows in place — right where the word was tapped,
// inside the lesson or Daily Case text — instead of navigating away.
// Swipe up (a real PanResponder drag, live-following the finger) or a tap
// on the "Swipe up for more" hint both expand it; the pinned header (term
// name, speaker icon, definition) never remounts between states, which is
// what keeps it anchored near the top and keeps the speaker reachable in
// both states.
const LEVELS: { level: TermConfidence; label: string; symbol: string | null; icon?: 'checkmark' }[] = [
  { level: 'dont-know', label: "Don't know", symbol: '1' },
  { level: 'somewhat', label: 'Somewhat', symbol: '2' },
  { level: 'know-well', label: 'Know well', symbol: null, icon: 'checkmark' },
];

const familiarityLevels: { level: TermConfidence; label: string; dotColor: 'rose' | 'amber' | 'primary' }[] = [
  { level: 'dont-know', label: 'Unfamiliar', dotColor: 'rose' },
  { level: 'somewhat', label: 'Learning', dotColor: 'amber' },
  { level: 'know-well', label: 'Know', dotColor: 'primary' },
];

const COMPACT_HEIGHT = 480;
const DRAG_DISTANCE = 220;
const RELEASE_DISTANCE_THRESHOLD = 70;
const RELEASE_VELOCITY_THRESHOLD = 0.6;
const COMPACT_RATING_BLOCK_HEIGHT = 106;

export function TermDetailSheet({ term, visible, onClose }: { term: TermEntry | null; visible: boolean; onClose: () => void }) {
  const theme = useTheme();
  const router = useRouter();
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const expandedHeight = windowHeight - insets.top - insets.bottom - Spacing.three;

  const [currentId, setCurrentId] = useState(term?.id ?? '');
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [flashcardAdded, setFlashcardAdded] = useState(false);
  const [quizAdded, setQuizAdded] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const activeTerm = termGlossary.find((t) => t.id === currentId) ?? term;
  const termProgress = useTermProgress(currentId);
  const confidence = termProgress?.confidence ?? null;
  const favorited = useIsTermFavorited(currentId);

  // The "press moment" — matches web's togglePopup() → learnTerm(). Fires
  // whenever a term's sheet becomes visible, and again whenever the
  // student browses to a different term in place via a Related Concepts
  // chip, independent of any rating.
  useEffect(() => {
    if (visible && term) {
      setCurrentId(term.id);
      recordTermPressed(term.id);
    }
    if (!visible) {
      progress.setValue(0);
      setExpanded(false);
    }
  }, [visible, term]);

  useEffect(() => {
    if (currentId) recordTermPressed(currentId);
  }, [currentId]);

  useEffect(() => {
    if (!speaking) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.22, duration: 360, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 360, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [speaking, pulse]);

  function animateTo(target: 0 | 1) {
    Animated.spring(progress, { toValue: target, useNativeDriver: false, friction: 9, tension: 60 }).start(({ finished }) => {
      if (finished) setExpanded(target === 1);
    });
  }

  const compactPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => !expanded && Math.abs(g.dy) > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy < 0) progress.setValue(Math.min(1, -g.dy / DRAG_DISTANCE));
      },
      onPanResponderRelease: (_, g) => {
        animateTo(g.dy < -RELEASE_DISTANCE_THRESHOLD || g.vy < -RELEASE_VELOCITY_THRESHOLD ? 1 : 0);
      },
      onPanResponderTerminate: () => animateTo(0),
    }),
  ).current;

  const handlePan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => expanded && Math.abs(g.dy) > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) progress.setValue(Math.max(0, 1 - g.dy / DRAG_DISTANCE));
      },
      onPanResponderRelease: (_, g) => {
        animateTo(g.dy > RELEASE_DISTANCE_THRESHOLD || g.vy > RELEASE_VELOCITY_THRESHOLD ? 0 : 1);
      },
      onPanResponderTerminate: () => animateTo(1),
    }),
  ).current;

  if (!activeTerm) return null;

  const height = progress.interpolate({ inputRange: [0, 1], outputRange: [COMPACT_HEIGHT, expandedHeight] });
  const borderRadius = progress.interpolate({ inputRange: [0, 1], outputRange: [Radius.xl, 0] });
  const compactOnlyOpacity = progress.interpolate({ inputRange: [0, 0.35], outputRange: [1, 0], extrapolate: 'clamp' });
  const compactRatingHeight = progress.interpolate({ inputRange: [0, 0.35], outputRange: [COMPACT_RATING_BLOCK_HEIGHT, 0], extrapolate: 'clamp' });
  const expandedOnlyOpacity = progress.interpolate({ inputRange: [0.35, 1], outputRange: [0, 1], extrapolate: 'clamp' });
  const expandedOnlyRise = progress.interpolate({ inputRange: [0.35, 1], outputRange: [14, 0], extrapolate: 'clamp' });
  const hintOpacity = progress.interpolate({ inputRange: [0, 0.2], outputRange: [1, 0], extrapolate: 'clamp' });

  const relatedTerms = activeTerm.relatedTermIds.map((id) => termGlossary.find((t) => t.id === id)).filter((t): t is TermEntry => !!t);
  const conditions = getConditionsForTerm(activeTerm);

  // Not wired to real pronunciation yet — a plain press pulse, no audio
  // call, per feedback. The button and its visual "speaking" state are
  // still real and in place so wiring in real TTS later is just filling
  // in this one function.
  function handleSpeak() {
    setSpeaking(true);
    setTimeout(() => setSpeaking(false), 500);
  }

  function handleSaveFlashcard() {
    addFlashcardSet(activeTerm!.term, [{ front: activeTerm!.term, back: activeTerm!.definition }]);
    setFlashcardAdded(true);
    setTimeout(() => setFlashcardAdded(false), 1500);
  }

  // A real, freshly-generated single-question quiz — not a fabricated
  // score: the question and 3 wrong-answer distractors are pulled from
  // this same real glossary, then added through the same addQuiz() the
  // Create > New Quiz screen uses, so it shows up for real under
  // Review > Quizzes afterward.
  function handleQuizMe() {
    const distractors = termGlossary
      .filter((t) => t.id !== activeTerm!.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((t) => t.definition);
    const options = [activeTerm!.definition, ...distractors].sort(() => Math.random() - 0.5);
    const question: QuizQuestion = {
      question: `What is the definition of "${activeTerm!.term}"?`,
      options,
      correctIndex: options.indexOf(activeTerm!.definition),
    };
    addQuiz(`${activeTerm!.term} — Quick Quiz`, activeTerm!.category, [question]);
    setQuizAdded(true);
    setTimeout(() => {
      setQuizAdded(false);
      onClose();
      router.push({ pathname: '/review', params: { section: 'quizzes' } });
    }, 700);
  }

  function handleAskAI() {
    onClose();
    router.push({ pathname: '/ai-chat', params: { term: activeTerm!.term } });
  }

  const levelColor = (level: TermConfidence) => {
    if (level === 'dont-know') return theme.amber;
    if (level === 'somewhat') return theme.rose;
    return theme.primary;
  };
  const levelMutedColor = (level: TermConfidence) => {
    if (level === 'dont-know') return theme.amberMuted;
    if (level === 'somewhat') return theme.roseMuted;
    return theme.primaryMuted;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.overlayPressable, { backgroundColor: 'rgba(15, 23, 42, 0.45)' }]} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} style={styles.cardOuter}>
          <Animated.View
            style={[styles.card, Shadow.raised, { height, borderRadius, backgroundColor: theme.backgroundElement }]}
            {...(!expanded ? compactPan.panHandlers : null)}>
            {expanded && (
              <View {...handlePan.panHandlers} style={styles.handleWrap}>
                <Pressable onPress={() => animateTo(0)} accessibilityRole="button" accessibilityLabel="Show less" hitSlop={10}>
                  <View style={[styles.handleBar, { backgroundColor: theme.border }]} />
                </Pressable>
              </View>
            )}

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              style={({ pressed }) => [styles.closeButton, { backgroundColor: theme.backgroundSelected }, pressed && styles.pressed]}>
              <Ionicons name="close" size={16} color={theme.textSecondary} />
            </Pressable>

            {/* Pinned header — present in both states, never remounts. */}
            <View style={styles.header}>
              <View style={[styles.tag, { backgroundColor: theme.primaryMuted }]}>
                <ThemedText themeColor="primary" style={styles.tagText}>
                  {activeTerm.category}
                </ThemedText>
              </View>

              <View style={styles.termRow}>
                <ThemedText style={styles.termTitle}>{activeTerm.term}</ThemedText>
                <Pressable
                  onPress={handleSpeak}
                  accessibilityRole="button"
                  accessibilityLabel={`Pronounce ${activeTerm.term}`}
                  hitSlop={10}
                  style={({ pressed }) => [styles.speakerButton, { backgroundColor: theme.primaryMuted }, pressed && styles.pressed]}>
                  <Animated.View style={{ transform: [{ scale: pulse }] }}>
                    <Ionicons name={speaking ? 'volume-high' : 'volume-medium-outline'} size={16} color={theme.primary} />
                  </Animated.View>
                </Pressable>
              </View>

              <ThemedText themeColor="textSecondary" style={styles.termDefinition}>
                {activeTerm.definition}
              </ThemedText>
            </View>

            {/* Compact-only: the confidence rating row — collapses its own
                height in step with its opacity so the expanded content
                below doesn't inherit a dead gap once it's gone. */}
            <Animated.View style={{ height: compactRatingHeight, opacity: compactOnlyOpacity, overflow: 'hidden' }}>
              <View style={styles.understandingBlock}>
                <ThemedText themeColor="textSecondary" style={styles.understandingLabel}>
                  HOW WELL DO YOU KNOW THIS?
                </ThemedText>
                <View style={styles.levelsRow}>
                  {LEVELS.map(({ level, label, symbol, icon }) => {
                    const active = confidence === level;
                    const color = levelColor(level);
                    return (
                      <Pressable
                        key={level}
                        onPress={() => setTermConfidence(currentId, level)}
                        accessibilityRole="button"
                        accessibilityLabel={label}
                        accessibilityState={{ selected: active }}
                        style={({ pressed }) => [
                          styles.levelButton,
                          { backgroundColor: active ? color : levelMutedColor(level), borderColor: color },
                          pressed && styles.pressed,
                        ]}>
                        {icon === 'checkmark' ? (
                          <Ionicons name="checkmark" size={18} color={active ? '#FFFFFF' : color} />
                        ) : (
                          <ThemedText style={[styles.levelSymbol, { color: active ? '#FFFFFF' : color }]}>{symbol}</ThemedText>
                        )}
                        <ThemedText style={[styles.levelLabel, { color: active ? '#FFFFFF' : color }]}>{label}</ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </Animated.View>

            {/* Compact-only: the subtle swipe-up affordance. */}
            <Animated.View
              pointerEvents={expanded ? 'none' : 'auto'}
              style={[styles.hintWrap, { opacity: Animated.multiply(compactOnlyOpacity, hintOpacity) }]}>
              <Pressable onPress={() => animateTo(1)} accessibilityRole="button" accessibilityLabel="Show more details" hitSlop={10} style={styles.hintPressable}>
                <Ionicons name="chevron-up" size={16} color={theme.textSecondary} />
                <ThemedText themeColor="textSecondary" style={styles.hintText}>
                  Swipe up for more
                </ThemedText>
              </Pressable>
            </Animated.View>

            {/* Expanded-only: the full dictionary-style content. */}
            <Animated.View
              style={[styles.expandedWrap, { opacity: expandedOnlyOpacity, transform: [{ translateY: expandedOnlyRise }] }]}
              pointerEvents={expanded ? 'auto' : 'none'}>
              <Animated.ScrollView
                scrollEnabled={expanded}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                // Android's default view-recycling optimization here
                // fights the parent card's animated height/transform and
                // leaves a stale, ghosted duplicate of scrolled-past text
                // behind — confirmed via the accessibility tree that the
                // real content only exists once; this was purely a
                // compositing artifact of the optimization, not a data bug.
                removeClippedSubviews={false}>

                <View style={[styles.calloutBox, { backgroundColor: theme.backgroundSelected }]}>
                  <View style={styles.calloutHeader}>
                    <Ionicons name="color-wand-outline" size={13} color={theme.primary} />
                    <ThemedText themeColor="primary" style={styles.calloutLabel}>
                      Simple Explanation
                    </ThemedText>
                  </View>
                  <ThemedText themeColor="textSecondary" style={styles.calloutText}>
                    {activeTerm.aiExplanation}
                  </ThemedText>
                </View>

                <View style={styles.sectionLabelRow}>
                  <Ionicons name="medkit-outline" size={13} color={theme.textSecondary} />
                  <ThemedText themeColor="textSecondary" style={styles.sectionLabelInline}>
                    WHY THIS MATTERS CLINICALLY
                  </ThemedText>
                </View>
                <ThemedText themeColor="textSecondary" style={styles.bodyText}>
                  {activeTerm.clinicalRelevance}
                </ThemedText>

                <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
                  COMMON CONDITIONS
                </ThemedText>
                {conditions.length > 0 ? (
                  <View style={styles.chipRow}>
                    {conditions.map((c) => (
                      <View key={c.id} style={[styles.chip, { borderColor: theme.border, backgroundColor: theme.background }]}>
                        <ThemedText style={styles.chipText}>{c.title}</ThemedText>
                        <ThemedText themeColor="textSecondary" style={styles.chipMeta}>
                          {' '}
                          · {c.category}
                        </ThemedText>
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
                    const active = confidence === level;
                    const accent = theme[dotColor];
                    const accentMuted = dotColor === 'rose' ? theme.roseMuted : dotColor === 'amber' ? theme.amberMuted : theme.primaryMuted;
                    return (
                      <Pressable
                        key={level}
                        onPress={() => setTermConfidence(currentId, level)}
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
                    <Ionicons name={flashcardAdded ? 'checkmark' : 'albums-outline'} size={15} color={theme.primary} />
                    <ThemedText style={styles.actionLabel} numberOfLines={2}>
                      {flashcardAdded ? 'Added ✓' : 'Create flashcard'}
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    onPress={handleQuizMe}
                    accessibilityRole="button"
                    accessibilityLabel="Quiz me on this"
                    style={({ pressed }) => [styles.actionButton, { borderColor: theme.border, backgroundColor: theme.background }, pressed && styles.pressed]}>
                    <Ionicons name={quizAdded ? 'checkmark' : 'help-circle-outline'} size={15} color={theme.primary} />
                    <ThemedText style={styles.actionLabel} numberOfLines={2}>
                      {quizAdded ? 'Quiz created ✓' : 'Quiz me on this'}
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    onPress={handleAskAI}
                    accessibilityRole="button"
                    accessibilityLabel="Ask Studium AI"
                    style={({ pressed }) => [styles.actionButton, { borderColor: theme.border, backgroundColor: theme.background }, pressed && styles.pressed]}>
                    <Ionicons name="sparkles" size={15} color={theme.primary} />
                    <ThemedText style={styles.actionLabel} numberOfLines={2}>
                      Ask Studium AI
                    </ThemedText>
                  </Pressable>
                </View>
              </Animated.ScrollView>
            </Animated.View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayPressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  cardOuter: {
    width: '100%',
    maxWidth: 460,
  },
  card: {
    width: '100%',
    overflow: 'hidden',
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: Radius.pill,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.three,
    right: Spacing.three,
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: 6,
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    maxWidth: '78%',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: Spacing.two,
  },
  termTitle: {
    fontSize: 22,
    fontWeight: '800',
    flexShrink: 1,
  },
  speakerButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termDefinition: {
    fontSize: 14,
    lineHeight: 21,
  },
  understandingBlock: {
    paddingHorizontal: Spacing.four,
  },
  understandingLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  levelsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    paddingVertical: 12,
    minHeight: 48,
  },
  levelSymbol: {
    fontSize: 15,
    fontWeight: '800',
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  hintWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Spacing.three,
    alignItems: 'center',
  },
  hintPressable: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  hintText: {
    fontSize: 11,
    fontWeight: '600',
  },
  expandedWrap: {
    flex: 1,
    marginTop: Spacing.two,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: 4,
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
