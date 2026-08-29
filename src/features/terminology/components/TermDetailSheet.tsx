import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Modal, PanResponder, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
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
// A real tooltip, not a centered modal card: `anchor` (the screen-space
// point the word/row was actually tapped at, captured by the caller from
// the press event) decides where the compact popup appears — directly
// under the word by default, or above it when there isn't enough room
// below the tap point before the screen edge. Tapping anywhere outside it
// closes it, same as any tooltip. Swiping up (or tapping the "Swipe up
// for more" hint) grows it in place into the full dictionary-style view;
// a single `progress` Animated.Value (0 = compact, 1 = expanded) drives
// position, size, corner radius, and content cross-fade together, so it
// reads as one surface expanding rather than a page transition.
const LEVELS: { level: TermConfidence; symbol: string | null; icon?: 'checkmark'; label: string }[] = [
  { level: 'dont-know', symbol: '1', label: "Don't know" },
  { level: 'somewhat', symbol: '2', label: 'Somewhat' },
  { level: 'know-well', symbol: null, icon: 'checkmark', label: 'Know well' },
];

const familiarityLevels: { level: TermConfidence; label: string; dotColor: 'rose' | 'amber' | 'primary' }[] = [
  { level: 'dont-know', label: 'Unfamiliar', dotColor: 'rose' },
  { level: 'somewhat', label: 'Learning', dotColor: 'amber' },
  { level: 'know-well', label: 'Know', dotColor: 'primary' },
];

const COMPACT_WIDTH_FALLBACK = 320;
const COMPACT_HEIGHT_FALLBACK = 230; // used only for the first frame, before the real content is measured
const MARGIN = 16;
const ANCHOR_GAP = 10;
const DRAG_DISTANCE = 220;
const RELEASE_DISTANCE_THRESHOLD = 70;
const RELEASE_VELOCITY_THRESHOLD = 0.6;
// Fixed-size expand handle above the measured content block (see
// onCompactLayout) — not itself measured, so its own known height is
// added on top rather than left to silently overflow the card's bounds.
const EXPAND_HANDLE_HEIGHT = 26;

export function TermDetailSheet({
  term,
  visible,
  anchor,
  onClose,
}: {
  term: TermEntry | null;
  visible: boolean;
  /** Screen-space point (e.g. from the press event's pageX/pageY) the popup should appear next to. Falls back to screen-centered if omitted. */
  anchor?: { x: number; y: number } | null;
  onClose: () => void;
}) {
  const theme = useTheme();
  const router = useRouter();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [currentId, setCurrentId] = useState(term?.id ?? '');
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [flashcardAdded, setFlashcardAdded] = useState(false);
  const [quizAdded, setQuizAdded] = useState(false);
  const [measuredCompactHeight, setMeasuredCompactHeight] = useState(0);
  const [measuredRatingHintHeight, setMeasuredRatingHintHeight] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  // Layout measurements only need to happen once per term — after that,
  // the collapse animation itself keeps changing the rendered height, and
  // re-measuring mid-animation would feed that back into the animation's
  // own target and corrupt it. Frozen per-id rather than a one-shot
  // boolean so browsing to a different term via a Related Concepts chip
  // (no remount, just a currentId change) measures fresh again.
  const measuredCompactForId = useRef<string | null>(null);
  const measuredRatingHintForId = useRef<string | null>(null);

  const activeTerm = termGlossary.find((t) => t.id === currentId) ?? term;
  const termProgress = useTermProgress(currentId);
  const confidence = termProgress?.confidence ?? null;
  const favorited = useIsTermFavorited(currentId);

  useEffect(() => {
    if (visible && term) {
      setCurrentId(term.id);
      recordTermPressed(term.id);
    }
    if (!visible) {
      progress.setValue(0);
      setExpanded(false);
      setMeasuredCompactHeight(0);
      setMeasuredRatingHintHeight(0);
      measuredCompactForId.current = null;
      measuredRatingHintForId.current = null;
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

  // Compact geometry: sized to its actual measured content (see
  // onCompactLayout below) rather than a guessed constant, so a short
  // definition never leaves a dead gap and a long one never gets clipped.
  const compactWidth = Math.min(COMPACT_WIDTH_FALLBACK, windowWidth - MARGIN * 2);
  const compactHeight = (measuredCompactHeight || COMPACT_HEIGHT_FALLBACK) + EXPAND_HANDLE_HEIGHT;

  let compactLeft: number;
  let compactTop: number;
  if (anchor) {
    compactLeft = Math.min(Math.max(anchor.x - compactWidth / 2, MARGIN), windowWidth - compactWidth - MARGIN);
    const spaceBelow = windowHeight - insets.bottom - MARGIN - (anchor.y + ANCHOR_GAP);
    compactTop =
      spaceBelow >= compactHeight
        ? anchor.y + ANCHOR_GAP
        : Math.max(insets.top + MARGIN, anchor.y - ANCHOR_GAP - compactHeight);
  } else {
    compactLeft = (windowWidth - compactWidth) / 2;
    compactTop = (windowHeight - compactHeight) / 2;
  }

  const expandedWidth = Math.min(460, windowWidth - MARGIN * 2);
  const expandedHeight = windowHeight - insets.top - insets.bottom - Spacing.three;
  const expandedLeft = (windowWidth - expandedWidth) / 2;
  const expandedTop = insets.top + Spacing.three;

  const left = progress.interpolate({ inputRange: [0, 1], outputRange: [compactLeft, expandedLeft] });
  const top = progress.interpolate({ inputRange: [0, 1], outputRange: [compactTop, expandedTop] });
  const width = progress.interpolate({ inputRange: [0, 1], outputRange: [compactWidth, expandedWidth] });
  const height = progress.interpolate({ inputRange: [0, 1], outputRange: [compactHeight, expandedHeight] });
  const borderRadius = progress.interpolate({ inputRange: [0, 1], outputRange: [Radius.lg, Radius.xl] });
  const backdropOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.55], extrapolate: 'clamp' });
  const compactOnlyOpacity = progress.interpolate({ inputRange: [0, 0.35], outputRange: [1, 0], extrapolate: 'clamp' });
  const ratingHintHeight = progress.interpolate({
    inputRange: [0, 0.35],
    outputRange: [measuredRatingHintHeight || 80, 0],
    extrapolate: 'clamp',
  });
  const expandedOnlyOpacity = progress.interpolate({ inputRange: [0.35, 1], outputRange: [0, 1], extrapolate: 'clamp' });
  const expandedOnlyRise = progress.interpolate({ inputRange: [0.35, 1], outputRange: [14, 0], extrapolate: 'clamp' });

  const relatedTerms = activeTerm.relatedTermIds.map((id) => termGlossary.find((t) => t.id === id)).filter((t): t is TermEntry => !!t);
  const conditions = getConditionsForTerm(activeTerm);

  // Each measured only once per term (see the refs above) — the outer
  // measurement covers the pinned header plus the rating/hint block at
  // its natural (uncollapsed) size, giving the true compact card height;
  // the inner one covers just the rating/hint block on its own, which is
  // what the collapse animation above needs as its "fully open" starting
  // height. Measuring the inner block from a plain, unanimated child
  // (rather than the Animated.View doing the collapsing) means its
  // reported size is never itself a product of the animation in progress.
  function onCompactLayout(e: LayoutChangeEvent) {
    if (measuredCompactForId.current === currentId) return;
    const h = Math.ceil(e.nativeEvent.layout.height);
    if (h > 0) {
      measuredCompactForId.current = currentId;
      setMeasuredCompactHeight(h);
    }
  }

  function onRatingHintLayout(e: LayoutChangeEvent) {
    if (measuredRatingHintForId.current === currentId) return;
    const h = Math.ceil(e.nativeEvent.layout.height);
    if (h > 0) {
      measuredRatingHintForId.current = currentId;
      setMeasuredRatingHintHeight(h);
    }
  }

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
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <Animated.View pointerEvents="none" style={[styles.backdrop, { opacity: backdropOpacity }]} />

        <Animated.View
          style={[styles.card, Shadow.raised, { left, top, width, height, borderRadius, backgroundColor: theme.backgroundElement }]}
          {...(!expanded ? compactPan.panHandlers : null)}>
          {expanded ? (
            <View {...handlePan.panHandlers} style={styles.handleWrap}>
              <Pressable onPress={() => animateTo(0)} accessibilityRole="button" accessibilityLabel="Show less" hitSlop={10}>
                <View style={[styles.handleBar, { backgroundColor: theme.border }]} />
              </Pressable>
            </View>
          ) : (
            // Mirrors the expanded state's own handle, one level up: a
            // visible expand cue sitting above everything else in the
            // popup, not just the "Swipe up for more" text buried below
            // the rating row — so the option to go deeper is obvious
            // before reading any of the compact content.
            <Pressable
              onPress={() => animateTo(1)}
              accessibilityRole="button"
              accessibilityLabel="Expand for more detail"
              hitSlop={10}
              style={({ pressed }) => [styles.expandHandleWrap, pressed && styles.pressed]}>
              <View style={[styles.expandHandleChevron, { backgroundColor: theme.backgroundSelected }]}>
                <Ionicons name="chevron-up" size={14} color={theme.textSecondary} />
              </View>
            </Pressable>
          )}

          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={8}
            style={({ pressed }) => [styles.closeButton, { backgroundColor: theme.backgroundSelected }, pressed && styles.pressed]}>
            <Ionicons name="close" size={14} color={theme.textSecondary} />
          </Pressable>

          {/* Everything below is what gets measured for the compact
              height — always rendered (never conditionally unmounted),
              so remeasuring on a term/content change is automatic. */}
          <View onLayout={onCompactLayout}>
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
                    <Ionicons name={speaking ? 'volume-high' : 'volume-medium-outline'} size={14} color={theme.primary} />
                  </Animated.View>
                </Pressable>
              </View>

              <ThemedText themeColor="textSecondary" style={styles.termDefinition}>
                {activeTerm.definition}
              </ThemedText>
            </View>

            {/* Compact-only: small circular confidence rating + hint.
                The outer Animated.View collapses its own height in step
                with its fade, so the expanded content right after it
                never inherits a dead gap once this is gone; the inner
                plain View is what's actually measured (see
                onRatingHintLayout) — it always reports its true natural
                size, never the outer wrapper's currently-clipped one. */}
            <Animated.View style={{ height: ratingHintHeight, opacity: compactOnlyOpacity, overflow: 'hidden' }}>
              <View onLayout={onRatingHintLayout}>
                <View style={styles.understandingRow}>
                  <ThemedText themeColor="textSecondary" style={styles.understandingLabel}>
                    HOW WELL DO YOU KNOW THIS?
                  </ThemedText>
                  <View style={styles.circleRow}>
                    {LEVELS.map(({ level, symbol, icon, label }) => {
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
                            styles.circleButton,
                            { backgroundColor: active ? color : levelMutedColor(level), borderColor: color },
                            pressed && styles.pressed,
                          ]}>
                          {icon === 'checkmark' ? (
                            <Ionicons name="checkmark" size={15} color={active ? '#FFFFFF' : color} />
                          ) : (
                            <ThemedText style={[styles.circleSymbol, { color: active ? '#FFFFFF' : color }]}>{symbol}</ThemedText>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <Pressable onPress={() => animateTo(1)} accessibilityRole="button" accessibilityLabel="Show more details" hitSlop={8} style={styles.hintPressable}>
                  <Ionicons name="chevron-up" size={13} color={theme.textSecondary} />
                  <ThemedText themeColor="textSecondary" style={styles.hintText}>
                    Swipe up for more
                  </ThemedText>
                </Pressable>
              </View>
            </Animated.View>
          </View>

          {/* Expanded-only: the full dictionary-style content. */}
          <Animated.View
            style={[styles.expandedWrap, { opacity: expandedOnlyOpacity, transform: [{ translateY: expandedOnlyRise }] }]}
            pointerEvents={expanded ? 'auto' : 'none'}>
            <Animated.ScrollView
              scrollEnabled={expanded}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              // Android's default view-recycling optimization here fights
              // the parent card's animated height/transform and leaves a
              // stale, ghosted duplicate of scrolled-past text behind —
              // confirmed via the accessibility tree that the real
              // content only exists once; a compositing artifact, not a
              // data bug.
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F172A',
  },
  card: {
    position: 'absolute',
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
  expandHandleWrap: {
    alignItems: 'center',
    paddingTop: Spacing.two,
    paddingBottom: 2,
  },
  expandHandleChevron: {
    width: 26,
    height: 16,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    width: 24,
    height: 24,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: 5,
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    maxWidth: '72%',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  termTitle: {
    fontSize: 18,
    fontWeight: '800',
    flexShrink: 1,
  },
  speakerButton: {
    width: 26,
    height: 26,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termDefinition: {
    fontSize: 13,
    lineHeight: 19,
  },
  understandingRow: {
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.three,
  },
  understandingLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  circleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  circleButton: {
    width: 30,
    height: 30,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleSymbol: {
    fontSize: 13,
    fontWeight: '800',
  },
  hintPressable: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  hintText: {
    fontSize: 10,
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
