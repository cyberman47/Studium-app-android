import { useEffect, useState } from 'react';

import { useAuthState } from '@/features/auth/store';
import type { LeaderboardRow } from '@/features/dashboard/data';
import { supabase } from '@/lib/supabase';

type LeaderboardRpcRow = { id: string; name: string; total_kp: number; current_streak: number };

// public.leaderboard used to be a real Postgres view (id/name/total_kp/
// current_streak — see supabase/migrations/0002_leaderboard.sql in the
// studium-website repo), but it was replaced by the get_leaderboard() RPC
// function in 0032_fix_leaderboard_security_definer.sql (same shared
// Supabase project as studium-website — a security-advisor fix there
// silently broke this call until this edit). Same source Home's top-row
// glance reads from (dashboard/remote.ts), just the full ranked list
// instead of just the first row. RLS-safe, callable by any authenticated
// user.
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
      const { data } = await supabase.rpc('get_leaderboard');
      if (cancelled) return;

      setRows(
        ((data ?? []) as LeaderboardRpcRow[]).slice(0, 50).map((row) => ({
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
