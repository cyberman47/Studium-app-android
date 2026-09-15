import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useResolvedThemeName, useTheme } from '@/hooks/use-theme';

import { AnatomyFlashcardSection, anatomyFlashcardSections, anatomyImageUri } from './flashcards';
import { sectionProgress, useAnatomyProgress } from './progressStore';

// The Anatomy path, rebuilt to match the web app's
// app/dashboard/(main)/courses/anatomy/page.tsx: anatomy is flashcards-
// only (no written lessons, none planned), so instead of a grid of topic
// tiles that go nowhere, this is the browsing/selecting step of a two-
// step flow. Sections are MULTI-select — a student studying Upper Limb and
// Lower Limb together builds one combined session, not two.
//
// Grid look matches a reference mockup the user supplied: a real circular
// photo per topic (not a generic icon), a colored completion-percent pill
// overlapping its top-right corner, the title underneath, then a plain
// "studied/total" count — no bordered card box anywhere, and no per-card
// progress bar. A pinned footer replaces the old "N cards in this set"
// copy with a running average-score bar across every section (studied or
// not) and a single Start Learning action.

type SectionIcon =
  | { lib: 'ion'; name: keyof typeof Ionicons.glyphMap }
  | { lib: 'mci'; name: keyof typeof MaterialCommunityIcons.glyphMap };

// Real representative photos for every section that has one in the asset
// set (site-relative, resolved against the deployed website — see
// anatomyImageUri) — a whole-bone render for the regions that have one,
// the same figure crop Terminology already used. Head & Neck has no
// suitable whole-structure shot in the set (only close-up skull
// landmarks, which read as unrecognizable fragments at this size), so it
// falls back to a plain tinted icon rather than a misleading photo.
const sectionThumbnails: Record<string, string> = {
  terminology: '/images/anatomy/terminology-header.png',
  'upper-limb': '/images/anatomy/bones/hand-carpals.png',
  'lower-limb': '/images/anatomy/bones/femur.png',
  'spine-back': '/images/anatomy/bones/spine-lumbar-vertabre.png',
  thorax: '/images/anatomy/bones/sternum.png',
  'abdomen-pelvis': '/images/anatomy/bones/pelvic.png',
};

// Icon fallback for any section without a real thumbnail above.
const sectionIcons: Record<string, SectionIcon> = {
  'head-neck': { lib: 'ion', name: 'happy-outline' },
};

// 0% is a plain neutral gray (never a mint/teal tint, which would read as
// "some progress" against this app's own brand-teal palette) — matches
// the reference's gray/amber/green three-tier read at a glance.
const NEUTRAL_TONE = {
  light: { bg: '#E2E8F0', fg: '#475569' },
  dark: { bg: 'rgba(148, 163, 184, 0.18)', fg: '#CBD5E1' },
};

function percentTone(theme: ReturnType<typeof useTheme>, isDark: boolean, percent: number) {
  if (percent <= 0) return isDark ? NEUTRAL_TONE.dark : NEUTRAL_TONE.light;
  if (percent < 70) return { bg: theme.amberMuted, fg: theme.amber };
  return { bg: theme.primaryMuted, fg: theme.primary };
}

// The colored pill overlapping the circle's top-right corner — the only
// place completion shows on this grid now (no in-tile progress bar).
function PercentBadge({ percent }: { percent: number }) {
  const theme = useTheme();
  const isDark = useResolvedThemeName() === 'dark';
  const tone = percentTone(theme, isDark, percent);
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
      <ThemedText style={[styles.badgeText, { color: tone.fg }]}>{percent}%</ThemedText>
    </View>
  );
}

// The circular photo (or, where no real photo exists, a tinted icon) at
// the top of every tile — one shared size/shape so the grid reads as one
// system. The ring around it IS the selection state: gray by default,
// colored and thicker when checked — there's no separate card background
// to change, so this circle is the entire toggle affordance.
function SectionIconCircle({
  sectionId,
  checked,
  percent,
}: {
  sectionId: string;
  checked: boolean;
  percent: number;
}) {
  const theme = useTheme();
  const ringStyle = {
    borderColor: checked ? theme.primary : theme.border,
    borderWidth: checked ? 3 : 2,
  };
  const thumbnail = sectionThumbnails[sectionId];

  return (
    <View style={styles.ringWrap}>
      {thumbnail ? (
        <Image
          source={{ uri: anatomyImageUri(thumbnail) }}
          style={[styles.iconCircle, ringStyle, { backgroundColor: theme.backgroundElement }]}
          contentFit={sectionId === 'terminology' ? 'cover' : 'contain'}
          contentPosition={sectionId === 'terminology' ? 'top' : 'center'}
          transition={150}
        />
      ) : (
        <View style={[styles.iconCircle, ringStyle, { backgroundColor: theme.primaryMuted }]}>
          {(() => {
            const icon = sectionIcons[sectionId] ?? { lib: 'mci', name: 'bone' as const };
            return icon.lib === 'ion' ? (
              <Ionicons name={icon.name} size={24} color={theme.primary} />
            ) : (
              <MaterialCommunityIcons name={icon.name} size={24} color={theme.primary} />
            );
          })()}
        </View>
      )}
      <PercentBadge percent={percent} />
    </View>
  );
}

function SectionCard({
  section,
  checked,
  onToggle,
}: {
  section: AnatomyFlashcardSection;
  checked: boolean;
  onToggle: () => void;
}) {
  const progress = useAnatomyProgress();
  const { attemptedCount, percent } = sectionProgress(progress, section);

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={`${section.title}: ${attemptedCount} of ${section.cards.length} studied, ${percent}%`}
      style={styles.tile}>
      <SectionIconCircle sectionId={section.id} checked={checked} percent={percent} />
      <ThemedText numberOfLines={2} style={styles.cardTitle}>
        {section.title}
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.cardCount}>
        {attemptedCount}/{section.cards.length}
      </ThemedText>
    </Pressable>
  );
}

export function AnatomySectionsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const progress = useAnatomyProgress();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const selectedSections = useMemo(
    () => anatomyFlashcardSections.filter((s) => selectedIds.has(s.id)),
    [selectedIds]
  );
  const canStart = selectedSections.length > 0;

  // The average across whichever sections are currently selected — not
  // every section — so it reads as "how you're doing on what you're about
  // to study," and merges into one combined mean the moment a second
  // section joins the set. With nothing selected there's no set to
  // average, so it reads as 0 rather than falling back to a global figure.
  const averagePercent = useMemo(() => {
    if (selectedSections.length === 0) return 0;
    const percents = selectedSections.map((s) => sectionProgress(progress, s).percent);
    return Math.round(percents.reduce((sum, p) => sum + p, 0) / percents.length);
  }, [progress, selectedSections]);

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function startLearning() {
    if (!canStart) return;
    router.push({
      pathname: '/anatomy-quiz',
      params: { sections: selectedSections.map((s) => s.id).join(',') },
    });
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Anatomy" />

          <ThemedText style={styles.heading}>Choose your topics</ThemedText>

          <View style={styles.list}>
            {anatomyFlashcardSections.map((section) => (
              <View key={section.id} style={styles.gridItem}>
                <SectionCard
                  section={section}
                  checked={selectedIds.has(section.id)}
                  onToggle={() => toggle(section.id)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Pinned footer — outside the ScrollView so the average-score bar
          and Start Learning action are always reachable, padded by the
          real bottom inset so the button clears the gesture bar. */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.backgroundElement,
            borderTopColor: theme.border,
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}>
        <View style={styles.scoreRow}>
          <View style={styles.scoreLabel}>
            <MaterialCommunityIcons name="human-male-female" size={16} color={theme.textSecondary} />
            <ThemedText style={styles.scoreLabelText}>Average score</ThemedText>
          </View>
          <ThemedText style={styles.scoreValue}>{averagePercent}%</ThemedText>
        </View>
        <View style={[styles.scoreTrack, { backgroundColor: theme.backgroundSelected }]}>
          <View style={[styles.scoreFill, { backgroundColor: theme.primary, width: `${averagePercent}%` }]} />
        </View>

        <Pressable
          onPress={startLearning}
          disabled={!canStart}
          accessibilityRole="button"
          accessibilityLabel="Start learning"
          accessibilityState={{ disabled: !canStart }}
          style={({ pressed }) => [
            styles.startButton,
            { backgroundColor: theme.accent },
            !canStart && styles.disabled,
            pressed && canStart && styles.pressed,
          ]}>
          <ThemedText style={styles.startButtonText}>Start Learning</ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: Spacing.four,
  },
  inner: {
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 20,
  },
  heading: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  // A little 3-across grid. `gridItem` fixes each cell to ~1/3 of the row
  // (minus the row gap) so cells line up in threes regardless of how many
  // sections there are; a non-multiple-of-3 count just leaves the last
  // row short, same as any photo grid.
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 22,
    columnGap: 10,
  },
  gridItem: {
    width: '31%',
  },
  tile: {
    alignItems: 'center',
  },
  ringWrap: {
    width: 76,
    height: 76,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    borderRadius: Radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 10,
  },
  cardCount: {
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    marginTop: 2,
  },
  footer: {
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: 14,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreLabelText: {
    fontSize: 14,
    fontWeight: '800',
  },
  scoreValue: {
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  scoreTrack: {
    height: 8,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  startButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    minHeight: 50,
    marginTop: 2,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
});
