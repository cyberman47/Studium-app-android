import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { EyebrowPill } from '@/components/eyebrow-pill';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Matches the real desktop greeting row: "Your Dashboard" eyebrow pill +
// greeting on the left, the current-path badge on the right. This is now
// the only path indicator on the screen — the separate full-width PathChip
// row above it was a duplicate of the same "MCAT Preparation" label and
// got removed, so this badge is the real switcher now (hence the chevron).
export function GreetingHeader({
  name,
  pathLabel,
  pathEmoji,
}: {
  name: string;
  pathLabel: string;
  pathEmoji: string;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.row}>
      <View style={styles.col}>
        <EyebrowPill label="Your Dashboard" />
        <ThemedText style={styles.greeting}>
          {getGreeting()}, {name} 👋
        </ThemedText>
      </View>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityLabel={`Current learning path: ${pathLabel}`}
        accessibilityState={{ expanded: open }}
        style={({ pressed }) => [
          styles.pathBadge,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          Shadow.card,
          pressed && styles.pathBadgePressed,
        ]}>
        <ThemedText style={styles.pathEmoji}>{pathEmoji}</ThemedText>
        <ThemedText style={styles.pathLabel} numberOfLines={1}>
          {pathLabel}
        </ThemedText>
        <Ionicons
          name="chevron-down"
          size={13}
          color={theme.textSecondary}
          style={open ? styles.chevronOpen : undefined}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  col: {
    flex: 1,
    gap: Spacing.two,
  },
  greeting: {
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 29,
    letterSpacing: -0.3,
  },
  pathBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    maxWidth: 150,
    marginTop: 2,
    minHeight: 44,
  },
  pathBadgePressed: {
    opacity: 0.7,
  },
  pathEmoji: {
    fontSize: 12,
  },
  pathLabel: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: '800',
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
});
