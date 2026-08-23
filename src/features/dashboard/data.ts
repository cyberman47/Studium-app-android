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

export type WeeklyActivityDay = { label: string; kp: number; isToday?: boolean };

export type DashboardData = {
  name: string;
  avatarInitial: string;
  pathLabel: string;
  pathEmoji: string;
  streakDays: number;
  totalKP: number;
  todayKP: number;
  targetKP: number;
  level: number;
  levelName: string;
  nextLesson: { title: string; subject: string; completedCount: number; total: number };
  dailyCase: {
    title: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    stem: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  recommended: { subjectName: string; label: string; insight: string; kp: number; minutes: number };
  daysToExam: number;
  examReadinessPercent: number;
  overallMasteryPercent: number;
  studyTimeToday: string;
  studyTimeThisWeek: string;
  weeklyKP: { earned: number; target: number };
  weeklyActivity: WeeklyActivityDay[];
  leaderboard: LeaderboardRow[];
  focusAreas: FocusArea[];
};

export const mockDashboard: DashboardData = {
  name: 'Alex',
  avatarInitial: 'A',
  // Full label, matching lib/currentPath.ts's currentPathOptions[].label on
  // the web (e.g. "MCAT Preparation"), not the short "MCAT" form.
  pathLabel: 'MCAT Preparation',
  // Matches lib/currentPath.ts's pathEmoji map on the web (mcat: '🧬').
  pathEmoji: '🧬',
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
  // Real content, matching lib/clinicalCases.ts's "sudden-breathlessness-
  // postpartum" case on the web exactly (title, category, stem, question,
  // options, correctIndex, explanation) — not invented for the mobile app.
  dailyCase: {
    title: 'Sudden Breathlessness Postpartum',
    category: 'Pulmonology',
    difficulty: 'Intermediate',
    stem: 'A 34-year-old woman, 2 weeks postpartum, presents with sudden-onset pleuritic chest pain and shortness of breath. Heart rate is 118 bpm, and SpO2 is 91% on room air. She has unilateral calf swelling.',
    question: 'What is the most likely diagnosis?',
    options: ['Pulmonary embolism', 'Community-acquired pneumonia', 'Panic attack', 'Spontaneous pneumothorax'],
    correctIndex: 0,
    explanation:
      'The postpartum period is hypercoagulable. Pleuritic pain, tachycardia, hypoxia, and signs of a DVT (calf swelling) together point strongly to pulmonary embolism.',
  },
  recommended: {
    subjectName: 'Biology',
    label: 'Lesson Review',
    insight: 'Low confidence and low accuracy — major weakness',
    kp: 45,
    minutes: 25,
  },
  daysToExam: 395,
  examReadinessPercent: 28,
  overallMasteryPercent: 22,
  studyTimeToday: '30m',
  studyTimeThisWeek: '3h 5m',
  weeklyKP: { earned: 62, target: 105 },
  weeklyActivity: [
    { label: 'M', kp: 20 },
    { label: 'T', kp: 12 },
    { label: 'W', kp: 0 },
    { label: 'T', kp: 30, isToday: true },
    { label: 'F', kp: 0 },
    { label: 'S', kp: 0 },
    { label: 'S', kp: 0 },
  ],
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
