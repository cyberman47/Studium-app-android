import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { AnatomyFlashcard, anatomyFlashcardSections, anatomyImageUri } from './flashcards';
import { isWeakConcept, logAnatomyAttempt, useAnatomyProgress } from './progressStore';

// The study-runner for anatomy flashcards — the phone's version of the
// web's components/anatomy-flashcard-quiz.tsx. The interaction is "see
// the structure, pick the name" (not "read the term, pick the
// definition"), so the header copy, option labels, and result strings are
// written for that rather than borrowed from a generic MCQ runner. Always
// launched fullscreen from the section picker's Start Testing, always
// left via the header's X or the summary's Done.
//
// What's carried over from the web, all real: image prompt (or text
// definition fallback), four lettered choices with correct/incorrect
// reveal and the chosen option's explanation, per-card attempt logging,
// the correct-answer celebration beat, the occasional teaching slide
// (every 5th card, or any concept the student has real logged trouble
// with), a tap-to-zoom overlay, and the end-of-set summary. Left out on
// purpose: browser speech synthesis, the personal-flashcard bookmark
// (that store has no image field, and the phone's My Content store is
// deck-shaped, not card-shaped), and the docked AI tutor panel — Studium
// AI has its own screen here.

// Each card carries the section it came from — a session can mix several
// multi-selected sections, so this is real context for the header pill
// and for attempt logging, not something guessed from the id.
type StudyCard = AnatomyFlashcard & { sectionId: string; sectionTitle: string };

// Fisher–Yates. The order cards appear in a session is fine to vary run
// to run; it's each card's OWN option order that must stay stable (and
// does — that's baked into the data).
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LETTERS = ['A', 'B', 'C', 'D'];

function buildSession(sectionIds: string[]): { cards: StudyCard[]; label: string } {
  const selected = anatomyFlashcardSections.filter((s) => sectionIds.includes(s.id));
  const cards = selected.flatMap((s) =>
    s.cards.map((c) => ({ ...c, sectionId: s.id, sectionTitle: s.title }))
  );
  const label = selected.length === 1 ? selected[0].title : `${selected.length} sections`;
  return { cards: shuffle(cards), label };
}

export function AnatomyQuizScreen({ sectionIds }: { sectionIds: string[] }) {
  const theme = useTheme();
  const router = useRouter();
  const progress = useAnatomyProgress();
  const { width } = useWindowDimensions();

  // Built once per mount — a re-render must never reshuffle mid-session.
  const session = useMemo(() => buildSession(sectionIds), [sectionIds]);
  const { cards } = session;
  const title = `Anatomy Flashcards · ${session.label}`;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  // "Which index already had its intro dismissed" rather than a phase
  // that resets on every index change — so tapping Next never re-shows an
  // intro for a card already tested this session.
  const [introDismissedIndex, setIntroDismissedIndex] = useState<number | null>(null);
  // The correct-answer celebration — a brief reward, not persistent state.
  // Fired a beat AFTER the option's own color reveal so the two don't
  // animate over each other, cleared on its own ~0.9s later, and cancelled
  // outright on any card change so it can never bleed into the next card.
  const [celebrating, setCelebrating] = useState(false);
  const celebrationDelay = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!celebrating) return;
    const t = setTimeout(() => setCelebrating(false), 900);
    return () => clearTimeout(t);
  }, [celebrating]);

  useEffect(() => {
    setCelebrating(false);
    return () => {
      if (celebrationDelay.current) clearTimeout(celebrationDelay.current);
    };
  }, [index]);

  function exit() {
    router.back();
  }

  if (cards.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyCard, Shadow.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <ThemedText style={styles.emptyTitle}>Nothing to study yet.</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyText}>
              Select at least one section to build a study set.
            </ThemedText>
            <Pressable onPress={exit} accessibilityRole="button" style={[styles.pillButton, { backgroundColor: theme.accent }]}>
              <ThemedText style={styles.pillButtonText}>Back</ThemedText>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const card = cards[index];
  const selected = answers[index] ?? null;
  const answered = selected !== null;
  const isMilestoneCard = (index + 1) % 5 === 0;
  const isHardConcept = isWeakConcept(progress, card.sectionId, card.concept);
  const showIntro = (isMilestoneCard || isHardConcept) && introDismissedIndex !== index;

  const correctCount = cards.filter((c, i) => answers[i] === c.correctIndex).length;
  const answeredCount = Object.keys(answers).length;
  const percentDone = Math.round(((index + 1) / cards.length) * 100);

  function choose(i: number) {
    if (answered) return;
    const correct = i === card.correctIndex;
    setAnswers((a) => ({ ...a, [index]: i }));
    logAnatomyAttempt(card, card.sectionId, correct);
    if (correct) celebrationDelay.current = setTimeout(() => setCelebrating(true), 220);
  }

  function next() {
    if (index + 1 < cards.length) {
      setIndex((i) => i + 1);
      return;
    }
    setShowSummary(true);
  }

  const header = (
    <View style={[styles.header, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.border }]}>
      <Pressable onPress={exit} hitSlop={8} accessibilityRole="button" accessibilityLabel="Exit" style={styles.headerButton}>
        <Ionicons name="close" size={22} color={theme.textSecondary} />
      </Pressable>
      <View style={styles.headerCenter}>
        <ThemedText numberOfLines={1} style={styles.headerTitle}>
          {title}
        </ThemedText>
        {!showSummary && (
          <ThemedText numberOfLines={1} themeColor="textSecondary" style={styles.headerSubtitle}>
            {card.sectionTitle} · {card.concept}
          </ThemedText>
        )}
      </View>
      <View style={styles.headerButton}>
        {!showSummary && (
          <ThemedText themeColor="textSecondary" style={styles.headerCount}>
            {index + 1} / {cards.length}
          </ThemedText>
        )}
      </View>
    </View>
  );

  // Shared between the question view and the teaching slide — same image,
  // same zoom control — so the intro isn't a second, drifting copy.
  // Square, because every source illustration is 1024×1024; sized off the
  // real screen width so it stays genuinely big without overflowing.
  const imageSize = Math.min(width - Spacing.four * 2 - 24, 420);
  const imagePanel = (
    <View style={[styles.panel, Shadow.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      {card.imageUrl ? (
        <View style={styles.imageWrap}>
          <Pressable onPress={() => setZoomed(true)} accessibilityRole="imagebutton" accessibilityLabel="Zoom image">
            <Image
              source={{ uri: anatomyImageUri(card.imageUrl) }}
              style={[styles.image, { width: imageSize, height: imageSize }]}
              contentFit="contain"
              transition={150}
            />
          </Pressable>
          <Pressable
            onPress={() => setZoomed(true)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Zoom image"
            style={[styles.zoomButton, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Ionicons name="search-outline" size={16} color={theme.textSecondary} />
          </Pressable>
        </View>
      ) : (
        <View style={[styles.noImage, { borderColor: theme.border }]}>
          <View style={[styles.noImageIcon, { backgroundColor: theme.background }]}>
            <Ionicons name="image-outline" size={17} color={theme.textSecondary} />
          </View>
          <View style={styles.noImageText}>
            <View style={[styles.eyebrowPill, { backgroundColor: theme.amberMuted }]}>
              <ThemedText style={[styles.eyebrowText, { color: theme.amber }]}>IMAGE COMING SOON</ThemedText>
            </View>
            {/* On the intro slide this same definition is already the main
                event just below — showing it twice in one breath read badly. */}
            {!showIntro && <ThemedText style={styles.prompt}>{card.prompt}</ThemedText>}
          </View>
        </View>
      )}
    </View>
  );

  if (showSummary) {
    const pct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {header}
        <View style={styles.summaryWrap}>
          <View style={[styles.summaryIcon, { backgroundColor: theme.primaryMuted }]}>
            <Ionicons name="sparkles" size={26} color={theme.primary} />
          </View>
          <ThemedText style={styles.summaryTitle}>Study set complete</ThemedText>
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

  if (showIntro) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {header}
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {/* A text-only card's "image coming soon" box is just an empty
              dashed frame here (the definition it would hold is the main
              event right below) — on a phone that's half a screen of
              nothing, so the panel only appears when there's a picture. */}
          {card.imageUrl ? imagePanel : null}
          <View style={[styles.panel, styles.textPanel, Shadow.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <View style={[styles.eyebrowPill, styles.eyebrowRow, { backgroundColor: isHardConcept ? theme.amberMuted : theme.primaryMuted }]}>
              <Ionicons name={isHardConcept ? 'bulb-outline' : 'sparkles-outline'} size={12} color={isHardConcept ? theme.amber : theme.primary} />
              <ThemedText style={[styles.eyebrowText, { color: isHardConcept ? theme.amber : theme.primary }]}>
                {isHardConcept ? 'WORTH A CLOSER LOOK' : 'QUICK STUDY'}
              </ThemedText>
            </View>
            <ThemedText style={styles.introTerm}>{card.term}</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.introPrompt}>
              {card.prompt}
            </ThemedText>
            <Pressable
              onPress={() => setIntroDismissedIndex(index)}
              accessibilityRole="button"
              accessibilityLabel="Test me on this"
              style={({ pressed }) => [styles.pillButton, styles.fullButton, { backgroundColor: theme.accent }, pressed && styles.pressed]}>
              <ThemedText style={styles.pillButtonText}>Test me on this</ThemedText>
              <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
            </Pressable>
          </View>
        </ScrollView>
        {zoomed && card.imageUrl && <ZoomOverlay uri={anatomyImageUri(card.imageUrl)} onClose={() => setZoomed(false)} />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {header}
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {imagePanel}

        {/* A self-contained card: question heading, the choices, then its
            own footer with the progress bar and Next — right where the
            thumb already is, not a disconnected bar pinned to the very
            bottom of the screen. */}
        <View style={[styles.panel, styles.textPanel, Shadow.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText style={styles.question}>What structure is this?</ThemedText>

          <View style={styles.options}>
            {card.options.map((opt, i) => {
              const isCorrect = i === card.correctIndex;
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
                  {/* Only the chosen option's line prints, and it names which
                      structure is which — never the definition again. */}
                  {answered && isSelected && (
                    <ThemedText themeColor={isCorrect ? 'primary' : 'textSecondary'} style={styles.explanation}>
                      {card.optionExplanations[i]}
                    </ThemedText>
                  )}
                </View>
              );
            })}

            {/* The reward beat: a checkmark card over just the answers the
                instant a correct pick lands, gone on its own a moment
                later. Scoped to the options block — the heading and
                footer never dim — and never blocks Next. */}
            {celebrating && (
              <Animated.View
                pointerEvents="none"
                entering={FadeIn.duration(180)}
                exiting={FadeOut.duration(150)}
                style={styles.celebration}>
                {/* The near-opaque wash lives on its own inner view: Reanimated's
                    layout animations drive the outer view's opacity, so a
                    static opacity there would be overwritten (and warns). */}
                <View style={[styles.celebrationWash, { backgroundColor: theme.backgroundElement }]} />
                <Animated.View entering={ZoomIn.springify().stiffness(420).damping(16).mass(0.6)} style={styles.celebrationInner}>
                  <View style={[styles.celebrationBadge, { backgroundColor: theme.primary }]}>
                    <Ionicons name="checkmark" size={32} color="#FFFFFF" />
                  </View>
                  <ThemedText themeColor="primary" style={styles.celebrationText}>
                    Correct!
                  </ThemedText>
                </Animated.View>
              </Animated.View>
            )}
          </View>

          <View style={[styles.panelFooter, { borderTopColor: theme.border }]}>
            <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
              <View style={[styles.progressFill, { backgroundColor: theme.primary, width: `${percentDone}%` }]} />
            </View>
            <Pressable
              onPress={next}
              disabled={!answered}
              accessibilityRole="button"
              accessibilityLabel={index + 1 < cards.length ? 'Next' : 'See results'}
              accessibilityState={{ disabled: !answered }}
              style={({ pressed }) => [
                styles.pillButton,
                styles.nextButton,
                { backgroundColor: theme.accent },
                !answered && styles.disabled,
                pressed && answered && styles.pressed,
              ]}>
              <ThemedText style={styles.pillButtonText}>{index + 1 < cards.length ? 'Next' : 'See Results'}</ThemedText>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {zoomed && card.imageUrl && <ZoomOverlay uri={anatomyImageUri(card.imageUrl)} onClose={() => setZoomed(false)} />}
    </SafeAreaView>
  );
}

// Full-size zoom — its own modal layer rather than resizing the inline
// image in place, so zooming never reflows the question underneath. Tap
// anywhere (backdrop or image) or the X to dismiss.
function ZoomOverlay({ uri, onClose }: { uri: string; onClose: () => void }) {
  const { width, height } = useWindowDimensions();
  const size = Math.min(width, height) - 24;
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.zoomBackdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close zoomed image">
        <Image source={{ uri }} style={[styles.zoomImage, { width: size, height: size }]} contentFit="contain" />
        <View style={styles.zoomClose}>
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </View>
      </Pressable>
    </Modal>
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
  body: {
    padding: Spacing.four,
    paddingTop: Spacing.three,
    gap: 14,
    alignItems: 'center',
  },
  panel: {
    width: '100%',
    maxWidth: 800,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
  },
  textPanel: {
    padding: 18,
  },
  imageWrap: {
    alignItems: 'center',
  },
  image: {
    borderRadius: Radius.lg,
  },
  zoomButton: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 16,
    minHeight: 140,
  },
  noImageIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    flex: 1,
    minWidth: 0,
    gap: 10,
  },
  eyebrowPill: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  prompt: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  question: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
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
  celebration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Radius.lg,
    opacity: 0.96,
  },
  celebrationInner: {
    alignItems: 'center',
    gap: 10,
  },
  celebrationBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationText: {
    fontSize: 14,
    fontWeight: '800',
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
  fullButton: {
    marginTop: 18,
    minHeight: 46,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
  introTerm: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    marginTop: 12,
  },
  introPrompt: {
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
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
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 28,
    alignItems: 'center',
    gap: 6,
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
  zoomBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomImage: {
    borderRadius: Radius.xl,
    backgroundColor: '#FFFFFF',
  },
  zoomClose: {
    position: 'absolute',
    top: 52,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
