import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Deliberately minimal: just the greeting and the path switcher stacked
// underneath it. No "YOUR DASHBOARD" label — the user is obviously on the
// dashboard, so that pill was pure noise above the one thing that matters.
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
    <View style={styles.col}>
      <ThemedText style={styles.greeting}>
        {getGreeting()}, {name} 👋
      </ThemedText>
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
  col: {
    gap: Spacing.two,
    alignItems: 'flex-start',
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
    maxWidth: 200,
    minHeight: 36,
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
