import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ListRowSkeleton } from '@/components/list-row-skeleton';
import { useTheme } from '@/hooks/use-theme';
import type { LeaderboardRow } from '../data';

// Replaces three separate full-height cards (Leaderboard, Recommended,
// Performance) with one grouped white list, iOS-Settings style — same
// information at a glance, a fraction of the vertical space. Leaderboard
// and Recommended still have fuller, more detailed components
// (LeaderboardCard, RecommendedTodayCard) that aren't rendered anywhere
// yet but are kept around for future dedicated detail screens. The
// Performance row's chevron already routes somewhere real: the Progress
// tab, where features/progress/components/PerformanceCard shows the full
// detail this row summarizes. The Leaderboard row's chevron now routes
// somewhere real too: /leaderboard, a full ranked list (see
// features/leaderboard/LeaderboardScreen.tsx).
//
// `loading` skeletons the Leaderboard and Performance rows only —
// they're the two backed by the real Supabase fetch (dashboard/
// remote.ts); Recommended has no real backend anywhere yet, so it's
// mock-but-instant and never has anything to wait for.
export function HomeListSection({
  topLeaderboardRow,
  recommended,
  performance,
  loading = false,
  onPressLeaderboard,
  onPressRecommended,
  onPressPerformance,
}: {
  topLeaderboardRow: LeaderboardRow;
  recommended: { subjectName: string; label: string; kp: number; minutes: number };
  performance: { level: number; levelName: string; totalKP: number };
  loading?: boolean;
  onPressLeaderboard?: () => void;
  onPressRecommended?: () => void;
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
          title="Leaderboard"
          subtitle={`${topLeaderboardRow.name} · ${topLeaderboardRow.totalKP.toLocaleString()} KP`}
          onPress={onPressLeaderboard}
        />
      )}
      <ListRow
        icon="flash"
        iconColor={theme.primary}
        iconBackground={theme.primaryMuted}
        title={`Recommended: ${recommended.subjectName}`}
        subtitle={`${recommended.label} · +${recommended.kp} KP · ~${recommended.minutes} min`}
        onPress={onPressRecommended}
      />
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
