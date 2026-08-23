import { useEffect, useState } from 'react';

import { useAuthState } from '@/features/auth/store';
import type { LeaderboardRow } from '@/features/dashboard/data';
import { supabase } from '@/lib/supabase';

// The real public.leaderboard view (id/name/total_kp/current_streak —
// see supabase/migrations/0002_leaderboard.sql in the studium-website
// repo) — the same source Home's top-row glance reads from
// (dashboard/remote.ts), just the full ranked list instead of just the
// first row. RLS-safe, readable by any authenticated user.
export function useFullLeaderboard(): { loading: boolean; rows: LeaderboardRow[] } {
  const { status, userId } = useAuthState();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }
    if (status !== 'authenticated' || !userId) {
      setRows([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const { data } = await supabase
        .from('leaderboard')
        .select('id, name, total_kp, current_streak')
        .order('total_kp', { ascending: false })
        .limit(50);
      if (cancelled) return;

      setRows(
        (data ?? []).map((row) => ({
          id: row.id,
          name: row.name,
          totalKP: row.total_kp,
          streak: row.current_streak,
          isYou: row.id === userId,
        }))
      );
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [status, userId]);

  return { loading, rows };
}
