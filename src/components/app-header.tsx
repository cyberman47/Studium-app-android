import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AvatarMenu } from '@/components/avatar-menu';
import { Skeleton } from '@/components/skeleton';
import { StreakBadge } from '@/components/streak-badge';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The phone equivalent of the web app's persistent top header
// (app/dashboard/layout.tsx: <Logo />, <StudyStreak />, <UserMenu /> — same
// cluster, same order) — same wordmark asset, reflowed for a narrow
// screen. Sits above the scroll content, not inside it, so it stays put
// the way the web header does.
//
// `loading` skeletons just the streak badge + avatar — the two pieces
// that come from the real Supabase fetch (see dashboard/remote.ts) — the
// logo is a static asset, never a placeholder.
export function AppHeader({
  name,
  avatarInitial,
  streakDays,
  todayKP,
  targetKP,
  loading = false,
}: {
  name: string;
  avatarInitial: string;
  streakDays: number;
  todayKP: number;
  targetKP: number;
  loading?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <View style={styles.inner}>
        <Image
          source={require('@/assets/images/studium-logo-full.png')}
          style={styles.logo}
          contentFit="contain"
          accessible
          accessibilityLabel="Studium"
        />
        {loading ? (
          <View style={styles.right}>
            <Skeleton width={72} height={28} radius={Radius.pill} />
            <Skeleton width={32} height={32} radius={16} />
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(220)} style={styles.right}>
            <StreakBadge streakDays={streakDays} todayKP={todayKP} targetKP={targetKP} />
            <AvatarMenu name={name} avatarInitial={avatarInitial} />
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Tailwind px-4 py-3.
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
  },
  logo: {
    height: 28,
    aspectRatio: 779 / 303,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
