import { clinicalCases, type ClinicalCase } from './data';

// Same deterministic day-index rotation as the web app's getCaseOfTheDay
// (lib/clinicalCases.ts) — every device landing on this screen on the
// same calendar day would see the same case, with no server round-trip
// needed. Returns null now that clinicalCases.ts is intentionally empty
// (see that file) — every caller (DailyCaseCard, DailyCaseScreen) is
// expected to handle that as "no case today" rather than assuming one
// always exists.
//
// This is the one place a future Supabase-backed rewrite plugs in: swap
// this for a real query against a `clinical_cases` table (none exists
// yet — see the repo's supabase/migrations, which only cover profiles/
// social/leaderboard/planner data, nothing content-shaped) keyed by
// today's date or the same deterministic rotation, and the two screens
// below don't need to change at all since they already treat "no case"
// as a normal, handled state rather than an error.
export function getCaseOfTheDay(date: Date = new Date()): ClinicalCase | null {
  if (clinicalCases.length === 0) return null;
  const dayIndex = Math.floor(date.getTime() / 86400000);
  const index = ((dayIndex % clinicalCases.length) + clinicalCases.length) % clinicalCases.length;
  return clinicalCases[index];
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function getTodayDateKey(): string {
  return toDateKey(new Date());
}

// ---- KP reward tiers ----
// Rewards diagnosing with less of the story revealed — proportional to
// how much of the real narrative was shown before committing to an
// answer, same formula as the web app.
export type CaseRewardTier = 'highest' | 'high' | 'moderate' | 'minimal';

export function getCaseRewardTier(beatsRevealed: number, totalBeats: number): CaseRewardTier {
  if (totalBeats <= 0) return 'highest';
  const fraction = beatsRevealed / totalBeats;
  if (fraction <= 0.25) return 'highest';
  if (fraction <= 0.5) return 'high';
  if (fraction <= 0.75) return 'moderate';
  return 'minimal';
}

const REWARD_KP: Record<CaseRewardTier, number> = { highest: 60, high: 45, moderate: 30, minimal: 15 };
const REWARD_LABEL: Record<CaseRewardTier, string> = {
  highest: 'Minimal information used',
  high: 'Some information used',
  moderate: 'Moderate information used',
  minimal: 'Full information used',
};

export function getCaseRewardKP(beatsRevealed: number, totalBeats: number): number {
  return REWARD_KP[getCaseRewardTier(beatsRevealed, totalBeats)];
}

export function getCaseRewardLabel(tier: CaseRewardTier): string {
  return REWARD_LABEL[tier];
}
