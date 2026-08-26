import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { toggleVocabularyKnown, toggleVocabularySaved, toggleVocabularyStudyList, useKnownVocabularyIds, useSavedVocabularyIds, useStudyListVocabularyIds } from '../store';
import { type VocabularyWord } from '../types';
import { addFlashcardSet } from '@/features/mycontent/store';

const COMPACT_HEIGHT = 420;
const DRAG_DISTANCE = 220; // px of finger travel that maps to the full 0→1 progress range
const RELEASE_DISTANCE_THRESHOLD = 70;
const RELEASE_VELOCITY_THRESHOLD = 0.6;

/**
 * "Encounter word → understand quickly → optionally explore deeply."
 *
 * One continuous Animated.View, not a card that navigates to a separate
 * screen or swaps for a Modal: `progress` (0 = compact, 1 = fully
 * expanded) drives its height, corner radius, and the cross-fade between
 * the compact-only content and the expanded sections, so a swipe up (or a
 * tap on the hint, or on the card itself) reads as one surface growing in
 * place rather than a page transition. The word/pronunciation header
 * never unmounts between states — it's pinned above the ScrollView the
 * whole time, which is what keeps it "anchored near the top" and keeps
 * the speaker button reachable in both states, per spec.
 *
 * Self-contained: the four save/study controls read and write their own
 * real, persisted state (features/vocabulary/store.ts) and — for Create
 * flashcard — the app's real My Content flashcard store, so this
 * component works correctly just by receiving a VocabularyWord, without
 * the parent screen having to wire anything.
 */
export function VocabularyWordCard({
  word,
  initiallyExpanded = false,
  maxExpandedHeight,
  style,
}: {
  word: VocabularyWord;
  initiallyExpanded?: boolean;
  /** Overrides the computed "fill the screen" height for the expanded state — for embedding this card below other chrome instead of full-bleed. */
  maxExpandedHeight?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const expandedHeight = maxExpandedHeight ?? windowHeight - insets.top - insets.bottom - Spacing.three;

  const progress = useRef(new Animated.Value(initiallyExpanded ? 1 : 0)).current;
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [speaking, setSpeaking] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  const savedIds = useSavedVocabularyIds();
  const knownIds = useKnownVocabularyIds();
  const studyListIds = useStudyListVocabularyIds();
  const isSaved = savedIds.includes(word.id);
  const isKnown = knownIds.includes(word.id);
  const onStudyList = studyListIds.includes(word.id);
  const [flashcardAdded, setFlashcardAdded] = useState(false);

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

  const height = progress.interpolate({ inputRange: [0, 1], outputRange: [COMPACT_HEIGHT, expandedHeight] });
  const borderRadius = progress.interpolate({ inputRange: [0, 1], outputRange: [Radius.xl, 0] });
  const compactOnlyOpacity = progress.interpolate({ inputRange: [0, 0.35], outputRange: [1, 0], extrapolate: 'clamp' });
  const expandedOnlyOpacity = progress.interpolate({ inputRange: [0.35, 1], outputRange: [0, 1], extrapolate: 'clamp' });
  const expandedOnlyRise = progress.interpolate({ inputRange: [0.35, 1], outputRange: [14, 0], extrapolate: 'clamp' });
  const hintOpacity = progress.interpolate({ inputRange: [0, 0.2], outputRange: [1, 0], extrapolate: 'clamp' });

  // Not wired to real pronunciation yet — deliberately left as a plain
  // press pulse (no expo-speech, no other audio call) per feedback,
  // rather than half-wiring something that isn't ready. The button, its
  // pulse animation, and the `speaking` visual state are still real and
  // in place so wiring in real TTS later is just filling in this one
  // function.
  function handleSpeak() {
    setSpeaking(true);
    setTimeout(() => setSpeaking(false), 500);
  }

  function handleCreateFlashcard() {
    addFlashcardSet(word.word, [{ front: word.word, back: word.primaryTranslation }]);
    setFlashcardAdded(true);
    setTimeout(() => setFlashcardAdded(false), 1500);
  }

  const shortPartOfSpeech = word.partOfSpeech.split('·')[0].trim();

  return (
    <Animated.View
      style={[
        styles.card,
        Shadow.raised,
        { height, borderRadius, backgroundColor: theme.backgroundElement },
        style,
      ]}
      {...(!expanded ? compactPan.panHandlers : null)}>
      {/* Drag handle — only meaningfully interactive once expanded (swipe
          down here to collapse); a tap also collapses, for anyone who'd
          rather not drag. */}
      {expanded && (
        <View {...handlePan.panHandlers} style={styles.handleWrap}>
          <Pressable onPress={() => animateTo(0)} accessibilityRole="button" accessibilityLabel="Show less" hitSlop={10}>
            <View style={[styles.handleBar, { backgroundColor: theme.border }]} />
          </Pressable>
        </View>
      )}

      {/* Pinned header — present in both states, never remounts, which is
          what keeps the word/speaker anchored near the top through the
          whole transition. */}
      <View style={styles.header}>
        <View style={[styles.langChip, { backgroundColor: theme.primaryMuted }]}>
          <ThemedText themeColor="primary" style={styles.langChipText}>
            {word.language} · {shortPartOfSpeech}
          </ThemedText>
        </View>

        <View style={styles.wordRow}>
          <ThemedText style={styles.word}>{word.word}</ThemedText>
          <Pressable
            onPress={handleSpeak}
            accessibilityRole="button"
            accessibilityLabel={`Pronounce ${word.word}`}
            hitSlop={10}
            style={({ pressed }) => [styles.speakerButton, { backgroundColor: theme.primaryMuted }, pressed && styles.pressed]}>
            <Animated.View style={{ transform: [{ scale: pulse }] }}>
              <Ionicons name={speaking ? 'volume-high' : 'volume-medium-outline'} size={18} color={theme.primary} />
            </Animated.View>
          </Pressable>
        </View>

        {!!word.pronunciation && (
          <Animated.Text style={[styles.pronunciation, { color: theme.textSecondary, opacity: expandedOnlyOpacity }]}>
            {word.pronunciation}
          </Animated.Text>
        )}

        <ThemedText themeColor="textSecondary" style={styles.primaryTranslation}>
          {word.primaryTranslation}
        </ThemedText>
      </View>

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

      {/* Expanded-only: the full dictionary-style content, scrollable only
          once fully expanded so it never fights the drag-to-expand
          gesture mid-transition. */}
      <Animated.View style={[styles.expandedWrap, { opacity: expandedOnlyOpacity, transform: [{ translateY: expandedOnlyRise }] }]} pointerEvents={expanded ? 'auto' : 'none'}>
        <Animated.ScrollView scrollEnabled={expanded} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Section label="Definitions" theme={theme}>
            <View style={styles.definitionsList}>
              {word.definitions.map((def, i) => (
                <View key={i} style={styles.definitionRow}>
                  <View style={[styles.definitionIndex, { backgroundColor: theme.primaryMuted }]}>
                    <ThemedText themeColor="primary" style={styles.definitionIndexText}>
                      {i + 1}
                    </ThemedText>
                  </View>
                  <View style={styles.definitionTextWrap}>
                    <ThemedText style={styles.definitionText}>{def.meaning}</ThemedText>
                    {!!def.partOfSpeech && (
                      <ThemedText themeColor="textSecondary" style={styles.definitionPos}>
                        {def.partOfSpeech}
                      </ThemedText>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </Section>

          <Section label="Part of speech" theme={theme}>
            <View style={[styles.posTag, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText style={styles.posTagText}>{word.partOfSpeech}</ThemedText>
            </View>
          </Section>

          {word.examples.length > 0 && (
            <Section label="Examples" theme={theme}>
              <View style={styles.examplesList}>
                {word.examples.map((ex, i) => (
                  <View key={i} style={[styles.exampleCard, { borderColor: theme.border }]}>
                    <ThemedText style={styles.exampleSentence}>{ex.sentence}</ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.exampleTranslation}>
                      {ex.translation}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </Section>
          )}

          {word.grammar.length > 0 && (
            <Section label="Grammar" theme={theme}>
              <View style={[styles.grammarCard, { borderColor: theme.border }]}>
                {word.grammar.map((fact, i) => (
                  <View key={i} style={[styles.grammarRow, i > 0 && { borderTopColor: theme.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
                    <ThemedText themeColor="textSecondary" style={styles.grammarLabel}>
                      {fact.label}
                    </ThemedText>
                    <ThemedText style={styles.grammarValue}>{fact.value}</ThemedText>
                  </View>
                ))}
              </View>
            </Section>
          )}

          {(word.synonyms.length > 0 || word.relatedWords.length > 0) && (
            <Section label="Related vocabulary" theme={theme}>
              {word.synonyms.length > 0 && (
                <View style={styles.relatedGroup}>
                  <ThemedText themeColor="textSecondary" style={styles.relatedGroupLabel}>
                    Synonyms
                  </ThemedText>
                  <View style={styles.chipRow}>
                    {word.synonyms.map((s) => (
                      <View key={s} style={[styles.relatedChip, { backgroundColor: theme.primaryMuted }]}>
                        <ThemedText themeColor="primary" style={styles.relatedChipText}>
                          {s}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {word.relatedWords.length > 0 && (
                <View style={styles.relatedGroup}>
                  <ThemedText themeColor="textSecondary" style={styles.relatedGroupLabel}>
                    Word family
                  </ThemedText>
                  <View style={styles.chipRow}>
                    {word.relatedWords.map((s) => (
                      <View key={s} style={[styles.relatedChip, { backgroundColor: theme.backgroundSelected }]}>
                        <ThemedText style={styles.relatedChipText}>{s}</ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </Section>
          )}

          {!!word.contextSentence && (
            <Section label="Context" theme={theme}>
              <View style={[styles.contextCard, { backgroundColor: theme.backgroundSelected }]}>
                <Ionicons name="chatbox-ellipses-outline" size={14} color={theme.primary} style={styles.contextIcon} />
                <ThemedText style={styles.contextSentence}>{word.contextSentence}</ThemedText>
                {!!word.contextTranslation && (
                  <ThemedText themeColor="textSecondary" style={styles.contextTranslation}>
                    {word.contextTranslation}
                  </ThemedText>
                )}
              </View>
            </Section>
          )}

          <Section label="Save & study" theme={theme}>
            <View style={styles.actionsGrid}>
              <ActionButton
                theme={theme}
                icon={isSaved ? 'bookmark' : 'bookmark-outline'}
                label={isSaved ? 'Saved' : 'Add to Terminology'}
                active={isSaved}
                accent="primary"
                onPress={() => toggleVocabularySaved(word.id)}
              />
              <ActionButton
                theme={theme}
                icon={flashcardAdded ? 'checkmark' : 'albums-outline'}
                label={flashcardAdded ? 'Added ✓' : 'Create flashcard'}
                active={false}
                accent="primary"
                onPress={handleCreateFlashcard}
              />
              <ActionButton
                theme={theme}
                icon={isKnown ? 'checkmark-circle' : 'checkmark-circle-outline'}
                label={isKnown ? 'Known' : 'Mark as known'}
                active={isKnown}
                accent="primary"
                onPress={() => toggleVocabularyKnown(word.id)}
              />
              <ActionButton
                theme={theme}
                icon={onStudyList ? 'list-circle' : 'list-outline'}
                label={onStudyList ? 'On study list' : 'Add to study list'}
                active={onStudyList}
                accent="amber"
                onPress={() => toggleVocabularyStudyList(word.id)}
              />
            </View>
          </Section>
        </Animated.ScrollView>
      </Animated.View>
    </Animated.View>
  );
}

function Section({ label, theme, children }: { label: string; theme: ReturnType<typeof useTheme>; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
        {label.toUpperCase()}
      </ThemedText>
      {children}
    </View>
  );
}

function ActionButton({
  theme,
  icon,
  label,
  active,
  accent,
  onPress,
}: {
  theme: ReturnType<typeof useTheme>;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  accent: 'primary' | 'amber';
  onPress: () => void;
}) {
  const accentColor = accent === 'amber' ? theme.amber : theme.primary;
  const accentMuted = accent === 'amber' ? theme.amberMuted : theme.primaryMuted;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.actionButton,
        { borderColor: active ? accentColor : theme.border, backgroundColor: active ? accentMuted : theme.background },
        pressed && styles.pressed,
      ]}>
      <Ionicons name={icon} size={15} color={active ? accentColor : theme.primary} />
      <ThemedText style={[styles.actionLabel, active && { color: accentColor }]} numberOfLines={2}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: 6,
  },
  langChip: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  langChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: Spacing.two,
  },
  word: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  speakerButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  pronunciation: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  primaryTranslation: {
    fontSize: 19,
    fontWeight: '600',
    marginTop: 4,
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
    marginTop: Spacing.four,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: 4,
  },
  section: {
    marginBottom: Spacing.four,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: Spacing.two,
  },
  definitionsList: {
    gap: 12,
  },
  definitionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  definitionIndex: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  definitionIndexText: {
    fontSize: 11,
    fontWeight: '800',
  },
  definitionTextWrap: {
    flex: 1,
    gap: 2,
  },
  definitionText: {
    fontSize: 14,
    lineHeight: 21,
  },
  definitionPos: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  posTag: {
    alignSelf: 'flex-start',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  posTagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  examplesList: {
    gap: 10,
  },
  exampleCard: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 4,
  },
  exampleSentence: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  exampleTranslation: {
    fontSize: 13,
    lineHeight: 19,
  },
  grammarCard: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  grammarRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3,
  },
  grammarLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  grammarValue: {
    fontSize: 13,
    lineHeight: 19,
  },
  relatedGroup: {
    marginBottom: Spacing.two,
  },
  relatedGroupLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relatedChip: {
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  relatedChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  contextCard: {
    borderRadius: Radius.md,
    padding: 12,
    gap: 6,
  },
  contextIcon: {
    marginBottom: 2,
  },
  contextSentence: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  contextTranslation: {
    fontSize: 13,
    lineHeight: 19,
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
