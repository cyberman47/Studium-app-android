import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useMyContent } from '@/features/mycontent/store';
import { useTheme } from '@/hooks/use-theme';

// Real data only — features/mycontent/store.ts's flashcardSets are the
// only actual flashcard content anywhere in this app (built via Create >
// New Flashcards). There's no spaced-repetition scheduler here yet, so
// "due today" isn't a real number; this honestly shows the real total
// card count instead of inventing a due-date algorithm to back a number
// that isn't real.
export function FlashcardsPanel() {
  const theme = useTheme();
  const router = useRouter();
  const { flashcardSets } = useMyContent();
  const totalCards = flashcardSets.reduce((sum, set) => sum + set.cards.length, 0);

  return (
    <View style={styles.wrap}>
      <View style={[styles.summaryShadow, Shadow.card]}>
        <View style={[styles.summaryCard, { backgroundColor: theme.primaryMuted, borderColor: theme.border }]}>
          <ThemedText themeColor="primary" style={styles.summaryEyebrow}>
            YOUR CARDS
          </ThemedText>
          <ThemedText themeColor="primary" style={styles.summaryValue}>
            {totalCards}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.summaryCaption}>
            {flashcardSets.length} deck{flashcardSets.length === 1 ? '' : 's'} · no spaced-repetition scheduling yet, so nothing is marked "due"
          </ThemedText>
          <Pressable
            onPress={() => router.push('/my-content')}
            disabled={flashcardSets.length === 0}
            accessibilityRole="button"
            accessibilityLabel="Review now"
            style={({ pressed }) => [
              styles.reviewButton,
              { backgroundColor: theme.primary },
              flashcardSets.length === 0 && styles.disabled,
              pressed && flashcardSets.length > 0 && styles.pressed,
            ]}>
            <Ionicons name="play" size={13} color="#FFFFFF" />
            <ThemedText style={styles.reviewButtonText}>Review now</ThemedText>
          </Pressable>
        </View>
      </View>

      <View>
        <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
          YOUR DECKS
        </ThemedText>
        {flashcardSets.length === 0 ? (
          <View style={[styles.emptyShadow, Shadow.card]}>
            <View style={[styles.emptyCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                You haven't created any flashcards yet.
              </ThemedText>
            </View>
          </View>
        ) : (
          <View style={styles.deckList}>
            {flashcardSets.map((set) => (
              <View key={set.id} style={[styles.deckShadow, Shadow.card]}>
                <Pressable
                  onPress={() => router.push('/my-content')}
                  accessibilityRole="button"
                  accessibilityLabel={`${set.title}: ${set.cards.length} cards`}
                  style={({ pressed }) => [
                    styles.deckRow,
                    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                    pressed && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  <View style={[styles.deckIcon, { backgroundColor: theme.primaryMuted }]}>
                    <Ionicons name="albums-outline" size={18} color={theme.primary} />
                  </View>
                  <View style={styles.deckText}>
                    <ThemedText numberOfLines={1} style={styles.deckTitle}>
                      {set.title}
                    </ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.deckSubtitle}>
                      {set.cards.length} card{set.cards.length === 1 ? '' : 's'}
                    </ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

      <Pressable
        onPress={() => router.push('/new-flashcards')}
        accessibilityRole="button"
        accessibilityLabel="Create flashcards"
        style={({ pressed }) => [styles.createLink, pressed && styles.pressed]}>
        <ThemedText themeColor="primary" style={styles.createLinkText}>
          Create flashcards
        </ThemedText>
        <Ionicons name="arrow-forward" size={13} color={theme.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 20,
  },
  summaryShadow: {
    borderRadius: Radius.lg,
  },
  summaryCard: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  summaryEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  summaryValue: {
    fontSize: 34,
    fontWeight: '800',
    marginTop: 4,
  },
  summaryCaption: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    borderRadius: Radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: Spacing.three,
    minHeight: 44,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
  reviewButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    marginBottom: Spacing.two,
  },
  emptyShadow: {
    borderRadius: Radius.lg,
  },
  emptyCard: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
  deckList: {
    gap: 10,
  },
  deckShadow: {
    borderRadius: Radius.lg,
  },
  deckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 60,
  },
  deckIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  deckTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  deckSubtitle: {
    fontSize: 12,
  },
  createLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    minHeight: 32,
  },
  createLinkText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
