import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { termGlossary, type TermEntry } from '@/features/terminology/data';
import { toggleTermLearned, useLearnedTermIds, useTerminologyStats } from '@/features/terminology/store';

// A starter medical glossary (features/terminology/data.ts — real terms,
// real definitions) with real, persisted per-term "learned" state
// (features/terminology/store.ts) — the mobile equivalent of the web
// app's much larger terminology feature, scoped down to what fits one
// panel. "Terms learned"/"to review" are genuinely 0 until the student
// actually taps through terms, not invented numbers.
function TermRow({ term, learned, onPress }: { term: TermEntry; learned: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <View style={[styles.rowShadow, Shadow.card]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${term.term}, ${term.category}${learned ? ', learned' : ''}`}
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && { backgroundColor: theme.backgroundSelected },
        ]}>
        <View style={[styles.icon, { backgroundColor: learned ? theme.primaryMuted : theme.backgroundSelected }]}>
          <Ionicons name={learned ? 'checkmark' : 'book-outline'} size={16} color={learned ? theme.primary : theme.textSecondary} />
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
  const learnedIds = useLearnedTermIds();
  const [query, setQuery] = useState('');
  const [openTerm, setOpenTerm] = useState<TermEntry | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return termGlossary;
    return termGlossary.filter((t) => t.term.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }, [query]);

  const recentlySaved = [...termGlossary].filter((t) => learnedIds.includes(t.id)).slice(-3).reverse();

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
              <TermRow key={t.id} term={t} learned onPress={() => setOpenTerm(t)} />
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
              <TermRow key={t.id} term={t} learned={learnedIds.includes(t.id)} onPress={() => setOpenTerm(t)} />
            ))}
          </View>
        )}
      </View>

      <Modal visible={openTerm !== null} transparent animationType="fade" onRequestClose={() => setOpenTerm(null)}>
        <Pressable style={styles.overlay} onPress={() => setOpenTerm(null)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[styles.sheet, { backgroundColor: theme.backgroundElement }]}>
            {openTerm && (
              <>
                <View style={styles.grabber} />
                <View style={[styles.tag, { backgroundColor: theme.primaryMuted }]}>
                  <ThemedText themeColor="primary" style={styles.tagText}>
                    {openTerm.category}
                  </ThemedText>
                </View>
                <ThemedText style={styles.termTitle}>{openTerm.term}</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.termDefinition}>
                  {openTerm.definition}
                </ThemedText>
                <Pressable
                  onPress={() => toggleTermLearned(openTerm.id)}
                  accessibilityRole="button"
                  accessibilityLabel={learnedIds.includes(openTerm.id) ? 'Mark as not learned' : 'Mark as learned'}
                  style={({ pressed }) => [
                    styles.learnedButton,
                    {
                      backgroundColor: learnedIds.includes(openTerm.id) ? theme.primaryMuted : theme.primary,
                      borderColor: theme.primary,
                    },
                    pressed && styles.pressed,
                  ]}>
                  <Ionicons
                    name={learnedIds.includes(openTerm.id) ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={16}
                    color={learnedIds.includes(openTerm.id) ? theme.primary : '#FFFFFF'}
                  />
                  <ThemedText
                    style={[styles.learnedButtonText, { color: learnedIds.includes(openTerm.id) ? theme.primary : '#FFFFFF' }]}>
                    {learnedIds.includes(openTerm.id) ? 'Learned' : 'Mark as learned'}
                  </ThemedText>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
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
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
    gap: 4,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(15, 23, 42, 0.15)',
    alignSelf: 'center',
    marginBottom: Spacing.three,
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  termTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: Spacing.two,
  },
  termDefinition: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: Spacing.two,
  },
  learnedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    paddingVertical: 13,
    marginTop: Spacing.four,
    minHeight: 48,
  },
  pressed: {
    opacity: 0.85,
  },
  learnedButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
