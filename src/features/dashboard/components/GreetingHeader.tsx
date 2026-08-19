import { StyleSheet, View } from 'react-native';

import { EyebrowPill } from '@/components/eyebrow-pill';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Matches app/dashboard/(main)/page.tsx's own greeting row: the shared
// `.eyebrow` teal pill + bold greeting. The current-path indicator that
// used to live inline here on the right is now the full-width PathChip
// (its own row above this one), matching the new mobile layout's
// sub-header — the header itself (logo, streak, avatar) already covers
// what the desktop's inline badge used to.
export function GreetingHeader({ name }: { name: string }) {
  return (
    <View style={styles.col}>
      <EyebrowPill label="Your Dashboard" />
      <ThemedText style={styles.greeting}>
        {getGreeting()}, {name} 👋
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    gap: Spacing.two,
  },
  greeting: {
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 29,
    letterSpacing: -0.3,
  },
});
