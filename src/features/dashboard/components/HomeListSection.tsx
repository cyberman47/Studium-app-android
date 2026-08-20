import { StyleSheet, View } from 'react-native';

import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { LeaderboardRow } from '../data';

import { ListRow } from './ListRow';

// Replaces three separate full-height cards (Leaderboard, Recommended,
// Performance) with one grouped white list, iOS-Settings style — same
// information at a glance, a fraction of the vertical space. Each of
// these still has a fuller, more detailed component (LeaderboardCard,
// RecommendedTodayCard, PerformanceCard) that isn't rendered on Home
// anymore but is kept around for a future dedicated detail screen, which
// is what each row's chevron implies it leads to.
export function HomeListSection({
  topLeaderboardRow,
  recommended,
  performance,
  onPressLeaderboard,
  onPressRecommended,
  onPressPerformance,
}: {
  topLeaderboardRow: LeaderboardRow;
  recommended: { subjectName: string; label: string; kp: number; minutes: number };
  performance: { level: number; levelName: string; totalKP: number };
  onPressLeaderboard?: () => void;
  onPressRecommended?: () => void;
  onPressPerformance?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.shadowWrap, Shadow.card]}>
      <View style={[styles.group, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <ListRow
          icon="trophy"
          iconColor={theme.amber}
          iconBackground={theme.amberMuted}
          title="Leaderboard"
          subtitle={`${topLeaderboardRow.name} · ${topLeaderboardRow.totalKP.toLocaleString()} KP`}
          onPress={onPressLeaderboard}
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <ListRow
          icon="flash"
          iconColor={theme.primary}
          iconBackground={theme.primaryMuted}
          title={`Recommended: ${recommended.subjectName}`}
          subtitle={`${recommended.label} · +${recommended.kp} KP · ~${recommended.minutes} min`}
          onPress={onPressRecommended}
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <ListRow
          icon="trending-up"
          iconColor={theme.primary}
          iconBackground={theme.primaryMuted}
          title={`Level ${performance.level} · ${performance.levelName}`}
          subtitle={`${performance.totalKP.toLocaleString()} KP earned`}
          onPress={onPressPerformance}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  group: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
