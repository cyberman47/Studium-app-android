import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

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
// No avatar/account dropdown here anymore — the account menu (Profile /
// Settings / Logout) is removed per feedback; Profile already has its
// own full bottom tab, and Settings/Logout live under Profile's gear
// icon, so nothing it offered is actually gone. The streak/KP pill is a
// real button now, opening Progress — see onPressStreak.
//
// `loading` skeletons just the streak badge — the one piece that comes
// from the real Supabase fetch (see dashboard/remote.ts) — the logo is a
// static asset, never a placeholder.
export function AppHeader({
  streakDays,
  todayKP,
  targetKP,
  loading = false,
  onPressStreak,
}: {
  streakDays: number;
  todayKP: number;
  targetKP: number;
  loading?: boolean;
  onPressStreak?: () => void;
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
          <Skeleton width={72} height={28} radius={Radius.pill} />
        ) : (
          <Animated.View entering={FadeIn.duration(220)}>
            <StreakBadge streakDays={streakDays} todayKP={todayKP} targetKP={targetKP} onPress={onPressStreak} />
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
});
