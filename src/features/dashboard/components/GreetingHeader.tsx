import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { PathSwitcher } from '@/components/path-switcher';
import { Skeleton } from '@/components/skeleton';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Deliberately minimal: just the greeting and the path switcher stacked
// underneath it. No "YOUR DASHBOARD" label — the user is obviously on the
// dashboard, so that pill was pure noise above the one thing that matters.
//
// The path badge itself is PathSwitcher (components/path-switcher.tsx) —
// shared with the Learn tab's header so both show/change the same track
// picker rather than Learn inventing a second copy.
//
// `loading` skeletons the greeting name and the path badge — both come
// from the real Supabase fetch (dashboard/remote.ts), and Home renders
// this component immediately with mock-fallback values while that's in
// flight, so without a loading state a student would briefly see a
// stranger's mock name/path before it corrects itself.
export function GreetingHeader({
  name,
  pathLabel,
  pathEmoji,
  loading = false,
}: {
  name: string;
  pathLabel: string;
  pathEmoji: string;
  loading?: boolean;
}) {
  return (
    <View style={styles.col}>
      {loading ? (
        <Skeleton width={200} height={23} radius={6} />
      ) : (
        <Animated.View entering={FadeIn.duration(220)}>
          <ThemedText style={styles.greeting}>
            {getGreeting()}, {name} 👋
          </ThemedText>
        </Animated.View>
      )}
      {loading ? (
        <Skeleton width={120} height={32} radius={Radius.pill} />
      ) : (
        <Animated.View entering={FadeIn.duration(220)}>
          <PathSwitcher pathLabel={pathLabel} pathEmoji={pathEmoji} loading={loading} />
        </Animated.View>
      )}
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
});
