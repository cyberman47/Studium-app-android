import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ListRowSkeleton } from '@/components/list-row-skeleton';
import { useTheme } from '@/hooks/use-theme';
import type { LeaderboardRow } from '../data';

// The compact "Leaderboard / Performance" pairing from the new Home
// hierarchy — Recommended for Today moved out to its own full
// RecommendedTodayCard section (it's substantial enough on the desktop
// dashboard to earn its own card, not a third line in this list).
// Leaderboard's chevron routes to /leaderboard (a full ranked list);
// Performance's routes to /progress, where
// features/progress/components/PerformanceCard shows the full detail
// this row summarizes.
//
// `loading` skeletons both rows — they're backed by the real Supabase
// fetch (dashboard/remote.ts).
export function HomeListSection({
  topLeaderboardRow,
  performance,
  loading = false,
  onPressLeaderboard,
  onPressPerformance,
}: {
  topLeaderboardRow: LeaderboardRow;
  performance: { level: number; levelName: string; totalKP: number };
  loading?: boolean;
  onPressLeaderboard?: () => void;
  onPressPerformance?: () => void;
}) {
  const theme = useTheme();
  return (
    <GroupedList>
      {loading ? (
        <ListRowSkeleton />
      ) : (
        <ListRow
          icon="trophy"
          iconColor={theme.amber}
          iconBackground={theme.amberMuted}
          title="Weekly Leaderboard"
          subtitle={`${topLeaderboardRow.name} · ${topLeaderboardRow.totalKP.toLocaleString()} KP`}
          onPress={onPressLeaderboard}
        />
      )}
      {loading ? (
        <ListRowSkeleton />
      ) : (
        <ListRow
          icon="trending-up"
          iconColor={theme.primary}
          iconBackground={theme.primaryMuted}
          title={`Level ${performance.level} · ${performance.levelName}`}
          subtitle={`${performance.totalKP.toLocaleString()} KP earned`}
          onPress={onPressPerformance}
        />
      )}
    </GroupedList>
  );
}
