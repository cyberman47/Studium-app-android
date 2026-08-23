// There's no real "level" concept anywhere in this product yet — not in
// this app, not in studium-website (checked: no getLevel/levelName exists
// there either). This is a small, consistent formula invented for the
// mobile dashboard's "Level N · Title" row so it's genuinely driven by a
// student's real total_kp (features/dashboard/remote.ts) rather than a
// second invented number — the thresholds/titles themselves just aren't
// backed by any server-side definition to match against.
const LEVEL_KP_STEP = 500;
const LEVEL_TITLES = [
  'Beginner',
  'Learner',
  'Focused Student',
  'Dedicated Scholar',
  'Rising Clinician',
  'Skilled Practitioner',
  'Advanced Scholar',
  'Master Clinician',
];

export function getLevelInfo(totalKP: number): { level: number; levelName: string } {
  const level = Math.max(1, Math.floor(Math.max(totalKP, 0) / LEVEL_KP_STEP) + 1);
  const levelName = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1];
  return { level, levelName };
}
