import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { removeFlashcardSet, useMyContent } from './store';

// Where flashcard sets created via Home's "+" button actually live — a
// real accordion (same expand-in-place pattern as HelpScreen's FAQ) with
// a real delete, backed by the same store the create screen writes to.
// Reached from Library's "My Content" row. (Note-taking was dropped from
// Create per feedback, so this screen no longer has a notes section.)
export function MyContentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { flashcardSets } = useMyContent();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const isEmpty = flashcardSets.length === 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="My Content" />
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Flashcard sets you've added yourself.
          </ThemedText>

          {isEmpty && (
            <View style={[styles.emptyShadow, Shadow.card]}>
              <View style={[styles.emptyCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <View style={[styles.emptyIcon, { backgroundColor: theme.primaryMuted }]}>
                  <Ionicons name="add-circle-outline" size={26} color={theme.primary} />
                </View>
                <ThemedText style={styles.emptyTitle}>Nothing here yet</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.emptyDescription}>
                  Tap the + button on Home to add your first flashcard set.
                </ThemedText>
                <Pressable
                  onPress={() => router.push('/')}
                  accessibilityRole="button"
                  accessibilityLabel="Go to Home"
                  style={({ pressed }) => [
                    styles.emptyButton,
                    { backgroundColor: theme.primary },
                    pressed && styles.emptyButtonPressed,
                  ]}>
                  <ThemedText style={styles.emptyButtonText}>Go to Home</ThemedText>
                </Pressable>
              </View>
            </View>
          )}

          {flashcardSets.length > 0 && (
            <View style={styles.section}>
              <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
                FLASHCARD SETS
              </ThemedText>
              <View style={styles.list}>
                {flashcardSets.map((set) => {
                  const expanded = expandedId === set.id;
                  return (
                    <View key={set.id} style={[styles.itemShadow, Shadow.card]}>
                      <View style={[styles.itemCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                        <Pressable
                          onPress={() => toggle(set.id)}
                          accessibilityRole="button"
                          accessibilityState={{ expanded }}
                          accessibilityLabel={set.title}
                          style={styles.itemHeader}>
                          <View style={[styles.itemIcon, { backgroundColor: theme.amberMuted }]}>
                            <Ionicons name="albums-outline" size={15} color={theme.amber} />
                          </View>
                          <ThemedText numberOfLines={expanded ? undefined : 1} style={styles.itemTitle}>
                            {set.title}
                          </ThemedText>
                          <ThemedText themeColor="textSecondary" style={styles.itemCount}>
                            {set.cards.length}
                          </ThemedText>
                          <Ionicons
                            name={expanded ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={theme.textSecondary}
                          />
                        </Pressable>
                        {expanded && (
                          <View style={styles.itemBody}>
                            {set.cards.map((card, index) => (
                              <View key={index} style={[styles.cardRow, { borderColor: theme.border }]}>
                                <ThemedText style={styles.cardFront}>{card.front}</ThemedText>
                                <ThemedText themeColor="textSecondary" style={styles.cardBack}>
                                  {card.back}
                                </ThemedText>
                              </View>
                            ))}
                            <Pressable
                              onPress={() => removeFlashcardSet(set.id)}
                              accessibilityRole="button"
                              accessibilityLabel={`Delete ${set.title}`}
                              style={styles.deleteRow}>
                              <Ionicons name="trash-outline" size={14} color={theme.rose} />
                              <ThemedText themeColor="rose" style={styles.deleteText}>
                                Delete set
                              </ThemedText>
                            </Pressable>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingBottom: Spacing.six,
  },
  inner: {
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 14,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: -8,
  },
  emptyShadow: {
    borderRadius: Radius.lg,
  },
  emptyCard: {
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    gap: 8,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptyDescription: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 260,
  },
  emptyButton: {
    marginTop: Spacing.two,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: 11,
  },
  emptyButtonPressed: {
    opacity: 0.85,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    gap: Spacing.two,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  list: {
    gap: 10,
  },
  itemShadow: {
    borderRadius: Radius.lg,
  },
  itemCard: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 24,
  },
  itemIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
  },
  itemCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemBody: {
    marginTop: 10,
    gap: 10,
  },
  itemBodyText: {
    fontSize: 13,
    lineHeight: 19,
  },
  cardRow: {
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3,
  },
  cardFront: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardBack: {
    fontSize: 12,
    lineHeight: 17,
  },
  deleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
