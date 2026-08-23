import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { Card } from '@/features/dashboard/components/Card';
import { LeaderboardCard } from '@/features/dashboard/components/LeaderboardCard';
import { useTheme } from '@/hooks/use-theme';

import { LeaderboardRowSkeleton } from './components/LeaderboardRowSkeleton';
import { useFullLeaderboard } from './remote';

const SKELETON_ROWS = 8;

// What the Home dashboard's Leaderboard row now actually opens — a real
// full ranked list from the same public.leaderboard view Home's own top
// row reads from (see remote.ts). Previously this row had no onPress at
// all; tapping it did nothing.
export function LeaderboardScreen() {
  const theme = useTheme();
  const { loading, rows } = useFullLeaderboard();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Leaderboard" />

          {loading ? (
            <Card>
              <View style={styles.header}>
                <Ionicons name="trophy" size={13} color={theme.amber} />
                <ThemedText themeColor="textSecondary" style={styles.headerText}>
                  THIS WEEK
                </ThemedText>
              </View>
              <View style={styles.skeletonList}>
                {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <LeaderboardRowSkeleton key={i} />
                ))}
              </View>
            </Card>
          ) : rows.length === 0 ? (
            <Card>
              <ThemedText themeColor="textSecondary" style={styles.empty}>
                No one's on the leaderboard yet — earn some Knowledge Points and be the first.
              </ThemedText>
            </Card>
          ) : (
            <Animated.View entering={FadeIn.duration(240)}>
              <LeaderboardCard rows={rows} />
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: 800, paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: 12 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.two,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  skeletonList: {
    gap: 2,
  },
  empty: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    paddingVertical: Spacing.two,
  },
});
