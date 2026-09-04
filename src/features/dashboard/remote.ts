import { useEffect, useState } from 'react';

import { useAuthState } from '@/features/auth/store';
import { educationTrackEmoji, educationTrackLabel } from '@/lib/educationTrack';
import { getLevelInfo } from '@/lib/level';
import { supabase } from '@/lib/supabase';

/**
 * The genuinely-real subset of the Home dashboard — the fields actually
 * backed by a Supabase column or view today (profiles.name/total_kp/
 * current_streak/education_track/week_start/kp_at_week_start/created_at,
 * and the public.leaderboard view — see supabase/migrations/0001, 0002,
 * 0008 in the studium-website repo). Everything else on Home (Continue
 * Studying, Daily Case, Recommended, exam readiness/mastery %, days to
 * exam, study time) has no real per-user backend anywhere in the product
 * yet — not mobile, not studium-website either — so it stays mock; wiring
 * those is separate, later work once that backend actually exists.
 *
 * todayKP is always 0: total_kp/current_streak are the only progress
 * numbers synced to Supabase, and neither is broken down by day, so
 * "today's KP" has no real source yet — 0 is the honest value for an
 * account with no real KP-earning activity wired up yet, not a
 * placeholder standing in for a fake number.
 *
 * Also used by features/profile/ProfileScreen.tsx — the same identity/
 * level/streak/KP/joined-date facts the Profile tab shows are exactly
 * this hook's own fields, so it reuses this query instead of duplicating
 * it under a second name.
 */
export type RealDashboardStats = {
  name: string;
  avatarInitial: string;
  pathLabel: string;
  pathEmoji: string;
  streakDays: number;
  totalKP: number;
  todayKP: number;
  level: number;
  levelName: string;
  weeklyKPEarned: number;
  topLeaderboardRow: { id: string; name: string; totalKP: number; streak: number } | null;
  // "August 2026" style, from the real profiles.created_at — used by the
  // Profile tab's "Joined ..." line (features/profile/ProfileScreen.tsx),
  // which reuses this same hook rather than duplicating the query.
  joinedLabel: string;
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatJoinedLabel(createdAt: string | null | undefined): string {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function deriveInitial(name: string, email: string | null): string {
  const source = name.trim() || email?.split('@')[0] || 'S';
  return source.charAt(0).toUpperCase();
}

// Same Monday-of-the-ISO-week key studium-website's lib/leaderboardSync.ts
// uses, so "this week" means the same week on both apps.
function mondayKey(date: Date): string {
  const day = date.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - diffToMonday));
  return monday.toISOString().slice(0, 10);
}

export function useRealDashboardStats(): { loading: boolean; stats: RealDashboardStats | null } {
  const { status, userId, email } = useAuthState();
  const [stats, setStats] = useState<RealDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }
    if (status !== 'authenticated' || !userId) {
      setStats(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const [profileResult, leaderboardResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('name, total_kp, current_streak, education_track, week_start, kp_at_week_start, created_at')
          .eq('id', userId)
          .maybeSingle(),
        supabase.from('leaderboard').select('id, name, total_kp, current_streak').order('total_kp', { ascending: false }).limit(1),
      ]);
      if (cancelled) return;

      const profile = profileResult.data;
      const name = profile?.name?.trim() || email?.split('@')[0] || 'there';
      const totalKP = profile?.total_kp ?? 0;
      const thisMonday = mondayKey(new Date());
      const weeklyKPEarned = profile?.week_start === thisMonday ? Math.max(0, totalKP - (profile?.kp_at_week_start ?? 0)) : 0;
      const { level, levelName } = getLevelInfo(totalKP);
      const top = leaderboardResult.data?.[0];

      setStats({
        name,
        avatarInitial: deriveInitial(name, email),
        pathLabel: educationTrackLabel(profile?.education_track),
        pathEmoji: educationTrackEmoji(profile?.education_track),
        streakDays: profile?.current_streak ?? 0,
        totalKP,
        todayKP: 0,
        level,
        levelName,
        weeklyKPEarned,
        topLeaderboardRow: top ? { id: top.id, name: top.name, totalKP: top.total_kp, streak: top.current_streak } : null,
        joinedLabel: formatJoinedLabel(profile?.created_at),
      });
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [status, userId, email]);

  return { loading, stats };
}
