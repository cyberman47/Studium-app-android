import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { termGlossary, type TermEntry } from '@/features/terminology/data';
import { getMasteryTier, useTerminologyStats, useTermProgressMap, type MasteryTier } from '@/features/terminology/store';
import { TermDetailSheet } from '@/features/terminology/components/TermDetailSheet';

// A starter medical glossary (features/terminology/data.ts — real terms,
// real definitions) with real, persisted per-term progress
// (features/terminology/store.ts: pressed → in library, then an optional
// dont-know/somewhat/know-well rating) — the mobile equivalent of the web
// app's much larger terminology feature, scoped down to what fits one
// panel. "Terms learned"/"to review" are genuinely 0 until the student
// actually taps through terms, not invented numbers. The definition
// sheet itself (TermDetailSheet) is shared with InteractiveText
// (components/interactive-text.tsx), so a term tapped here and the same
// term tapped from a Daily Case narrative are the same progress state.
const TIER_META: Record<MasteryTier, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  unknown: { icon: 'book-outline', label: '' },
  learning: { icon: 'time-outline', label: ', in progress' },
  mastered: { icon: 'checkmark', label: ', learned' },
};

function TermRow({ term, tier, onPress }: { term: TermEntry; tier: MasteryTier; onPress: () => void }) {
  const theme = useTheme();
  const meta = TIER_META[tier];
  const iconBg = tier === 'mastered' ? theme.primaryMuted : tier === 'learning' ? theme.roseMuted : theme.backgroundSelected;
  const iconColor = tier === 'mastered' ? theme.primary : tier === 'learning' ? theme.rose : theme.textSecondary;
  return (
    <View style={[styles.rowShadow, Shadow.card]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${term.term}, ${term.category}${meta.label}`}
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && { backgroundColor: theme.backgroundSelected },
        ]}>
        <View style={[styles.icon, { backgroundColor: iconBg }]}>
          <Ionicons name={meta.icon} size={16} color={iconColor} />
        </View>
        <View style={styles.rowText}>
          <ThemedText numberOfLines={1} style={styles.rowTitle}>
            {term.term}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.rowSubtitle}>
            {term.category}
          </ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
}

export function TerminologyPanel() {
  const theme = useTheme();
  const { learnedCount, toReviewCount } = useTerminologyStats();
  const progressMap = useTermProgressMap();
  const [query, setQuery] = useState('');
  const [openTerm, setOpenTerm] = useState<TermEntry | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return termGlossary;
    return termGlossary.filter((t) => t.term.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }, [query]);

  // Object key insertion order tracks press order (a term's key is created
  // once, on first press, and never re-created by a later rating), so this
  // reads as "most recently pressed" the same way the old array-append
  // model did.
  const recentlyActiveIds = Object.keys(progressMap).filter((id) => progressMap[id]?.inLibrary);
  const recentlySaved = recentlyActiveIds
    .map((id) => termGlossary.find((t) => t.id === id))
    .filter((t): t is TermEntry => !!t)
    .slice(-3)
    .reverse();

  return (
    <View style={styles.wrap}>
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        Build your medical vocabulary.
      </ThemedText>

      <View style={styles.statsRow}>
        <View style={[styles.statChip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText style={styles.statValue}>{learnedCount}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.statCaption}>
            Terms learned
          </ThemedText>
        </View>
        <View style={[styles.statChip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText style={styles.statValue}>{toReviewCount}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.statCaption}>
            Terms to review
          </ThemedText>
        </View>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Ionicons name="search" size={15} color={theme.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search terminology"
          placeholderTextColor={theme.textSecondary}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      {recentlySaved.length > 0 && !query && (
        <View>
          <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
            RECENTLY SAVED
          </ThemedText>
          <View style={styles.list}>
            {recentlySaved.map((t) => (
              <TermRow key={t.id} term={t} tier={getMasteryTier(progressMap[t.id])} onPress={() => setOpenTerm(t)} />
            ))}
          </View>
        </View>
      )}

      <View>
        <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
          {query ? `RESULTS FOR "${query.toUpperCase()}"` : 'ALL TERMS'}
        </ThemedText>
        {filtered.length === 0 ? (
          <ThemedText themeColor="textSecondary" style={styles.emptyText}>
            No terms match that search.
          </ThemedText>
        ) : (
          <View style={styles.list}>
            {filtered.map((t) => (
              <TermRow key={t.id} term={t} tier={getMasteryTier(progressMap[t.id])} onPress={() => setOpenTerm(t)} />
            ))}
          </View>
        )}
      </View>

      <TermDetailSheet term={openTerm} visible={openTerm !== null} onClose={() => setOpenTerm(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 18,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: -8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statChip: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
    minHeight: 64,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statCaption: {
    fontSize: 11,
    fontWeight: '500',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    marginBottom: Spacing.two,
  },
  emptyText: {
    fontSize: 13,
  },
  list: {
    gap: 10,
  },
  rowShadow: {
    borderRadius: Radius.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 60,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  rowSubtitle: {
    fontSize: 12,
  },
});
