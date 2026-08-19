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

// Matches app/dashboard/(main)/page.tsx's own greeting row: the shared
// `.eyebrow` teal pill + bold greeting on the left, and the current
// learning-path badge on the right — white card surface with a hairline
// border and soft shadow, heading-colored text, the path's own emoji
// (lib/currentPath.ts's pathEmoji map), no icon or chevron, since on the
// real page this exact badge is a static indicator, not the header's
// separate LearningPathSwitcher dropdown.
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
      <View style={styles.textCol}>
        <EyebrowPill label="Your Dashboard" />
        <ThemedText style={styles.greeting}>
          {getGreeting()}, {name} 👋
        </ThemedText>
      </View>
      <View
        style={[
          styles.pathPill,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          Shadow.card,
        ]}>
        <ThemedText style={styles.pathEmoji}>{pathEmoji}</ThemedText>
        <ThemedText style={styles.pathText}>{pathLabel}</ThemedText>
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
  textCol: {
    flex: 1,
    gap: Spacing.two,
  },
  greeting: {
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 29,
    letterSpacing: -0.3,
  },
  pathPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pathEmoji: {
    fontSize: 13,
  },
  pathText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
