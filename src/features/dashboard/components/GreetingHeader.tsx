import { StyleSheet, View } from 'react-native';

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
// greeting on the left, a static path badge (today's path + its real
// emoji, no chevron) on the right — distinct from the header's PathChip
// dropdown above this, which is the actual path *switcher*.
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
  return (
    <View style={styles.row}>
      <View style={styles.col}>
        <EyebrowPill label="Your Dashboard" />
        <ThemedText style={styles.greeting}>
          {getGreeting()}, {name} 👋
        </ThemedText>
      </View>
      <View
        style={[
          styles.pathBadge,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          Shadow.card,
        ]}>
        <ThemedText style={styles.pathEmoji}>{pathEmoji}</ThemedText>
        <ThemedText style={styles.pathLabel} numberOfLines={1}>
          {pathLabel}
        </ThemedText>
      </View>
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
    maxWidth: 130,
    marginTop: 2,
  },
  pathEmoji: {
    fontSize: 12,
  },
  pathLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
});
