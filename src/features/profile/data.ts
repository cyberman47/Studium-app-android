/**
 * Mock data for the Profile screen — shaped to mirror the real data the web
 * app's community profile page reads from lib/passport.ts (identity),
 * lib/achievements.ts + lib/communityAchievements.ts (the Passport), and
 * lib/community.ts (posts/reputation). Nothing here talks to Supabase yet;
 * swapping this module for real fetching later shouldn't require touching
 * any component below, since every component takes this same shape as
 * props — same pattern as features/dashboard/data.ts.
 */

export type ProfileData = {
  name: string;
  avatarInitial: string;
  pathLabel: string;
  pathEmoji: string;
  level: number;
  levelName: string;
  joinedLabel: string;
  totalKP: number;
  streakDays: number;
  topicsMasteredCount: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  hasPosts: boolean;
  hasCommunityActivity: boolean;
};

export const mockProfile: ProfileData = {
  name: 'thebest',
  avatarInitial: 'T',
  pathLabel: 'Medical School → Residency',
  pathEmoji: '🩺',
  level: 1,
  levelName: 'Beginner',
  joinedLabel: 'August 2026',
  totalKP: 110,
  streakDays: 0,
  topicsMasteredCount: 0,
  achievementsUnlocked: 0,
  // Matches the mock Passport list in features/passport/data.ts exactly
  // (2 achievements × 7 categories) — kept in sync by hand since these
  // are two different mock modules, same as the rest of this app.
  achievementsTotal: 14,
  hasPosts: false,
  hasCommunityActivity: false,
};
