import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Matches the web mobile dashboard's Quick Access row: small tappable
// shortcut tiles in a horizontal scroll, not full-width desktop-sized
// buttons. Same five real destinations, same order.
const items: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Flashcards', icon: 'layers-outline' },
  { label: 'Quizzes', icon: 'checkbox-outline' },
  { label: 'Library', icon: 'library-outline' },
  { label: 'Planner', icon: 'calendar-outline' },
  { label: 'Progress', icon: 'trending-up-outline' },
];

export function QuickAccess({ onPress }: { onPress?: (label: string) => void }) {
  const theme = useTheme();
  return (
    <View>
      <ThemedText themeColor="textSecondary" style={styles.label}>
        QUICK ACCESS
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {items.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => onPress?.(item.label)}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            style={({ pressed }) => [
              styles.item,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              pressed && styles.itemPressed,
            ]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
              <Ionicons name={item.icon} size={17} color={theme.primary} />
            </View>
            <ThemedText style={styles.itemLabel} numberOfLines={1}>
              {item.label}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: Spacing.two + 2,
  },
  row: {
    gap: Spacing.three,
    paddingRight: Spacing.four,
  },
  item: {
    width: 80,
    minHeight: 44,
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  itemPressed: {
    opacity: 0.7,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});
