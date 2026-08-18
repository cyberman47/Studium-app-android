/**
 * Mock data for the Home dashboard — shaped to mirror the real data the web
 * app's dashboard reads from lib/progress.ts, lib/clinicalCases.ts, and
 * lib/leaderboardSync.ts. Nothing here talks to Supabase yet; swapping this
 * module for real fetching later shouldn't require touching any component
 * below, since every component takes this same shape as props.
 */

export type FocusArea = { label: string; accuracy: number };

export type LeaderboardRow = {
  id: string;
  name: string;
  totalKP: number;
  streak: number;
  isYou?: boolean;
};

export type DashboardData = {
  name: string;
  pathLabel: string;
  streakDays: number;
  totalKP: number;
  todayKP: number;
  targetKP: number;
  level: number;
  levelName: string;
  nextLesson: { title: string; subject: string; completedCount: number; total: number };
  dailyCase: { title: string; category: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced' };
  leaderboard: LeaderboardRow[];
  focusAreas: FocusArea[];
};

export const mockDashboard: DashboardData = {
  name: 'Alex',
  pathLabel: 'MCAT',
  streakDays: 12,
  totalKP: 2840,
  todayKP: 35,
  targetKP: 50,
  level: 6,
  levelName: 'Rising Clinician',
  nextLesson: {
    title: 'Cell Membrane & Transport',
    subject: 'Biology',
    completedCount: 5,
    total: 9,
  },
  dailyCase: {
    title: 'Sudden Breathlessness Postpartum',
    category: 'Cardiology',
    difficulty: 'Intermediate',
  },
  leaderboard: [
    { id: '1', name: 'Priya S.', totalKP: 4210, streak: 21 },
    { id: '2', name: 'Marcus T.', totalKP: 3860, streak: 9 },
    { id: 'you', name: 'You', totalKP: 2840, streak: 12, isYou: true },
    { id: '4', name: 'Elena R.', totalKP: 2510, streak: 4 },
  ],
  focusAreas: [
    { label: 'Biochemistry', accuracy: 54 },
    { label: 'Organic Chemistry', accuracy: 68 },
    { label: 'Physics', accuracy: 77 },
  ],
};
