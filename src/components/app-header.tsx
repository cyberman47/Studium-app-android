import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AvatarMenu } from '@/components/avatar-menu';
import { StreakBadge } from '@/components/streak-badge';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The phone equivalent of the web app's persistent top header
// (app/dashboard/layout.tsx: <Logo />, <StudyStreak />, <UserMenu /> — same
// cluster, same order) — same wordmark asset, reflowed for a narrow
// screen. Sits above the scroll content, not inside it, so it stays put
// the way the web header does.
export function AppHeader({
  name,
  avatarInitial,
  streakDays,
  todayKP,
  targetKP,
}: {
  name: string;
  avatarInitial: string;
  streakDays: number;
  todayKP: number;
  targetKP: number;
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
        <View style={styles.right}>
          <StreakBadge streakDays={streakDays} todayKP={todayKP} targetKP={targetKP} />
          <AvatarMenu name={name} avatarInitial={avatarInitial} />
        </View>
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
