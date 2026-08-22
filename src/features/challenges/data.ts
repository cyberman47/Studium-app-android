/**
 * Mock challenges — the real seed data from
 * supabase/migrations/0010_challenges.sql, copied verbatim (title,
 * description, metric, target) rather than invented. Progress is mocked
 * against the same 110 lifetime KP / 0-day streak the rest of the mock
 * profile uses, so the numbers stay honest relative to each other.
 */

import type { Ionicons } from '@expo/vector-icons';

export type ChallengeMetric = 'kp_gained' | 'streak_days' | 'flashcards_mastered' | 'quizzes_completed' | 'lessons_completed';

export const metricIcons: Record<ChallengeMetric, keyof typeof Ionicons.glyphMap> = {
  kp_gained: 'flash-outline',
  streak_days: 'flame-outline',
  flashcards_mastered: 'layers-outline',
  quizzes_completed: 'checkbox-outline',
  lessons_completed: 'book-outline',
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  metric: ChallengeMetric;
  targetValue: number;
  currentValue: number;
  joined: boolean;
};

export const mockChallenges: Challenge[] = [
  { id: '7-day-study-streak', title: '7-Day Study Challenge', description: 'Build a 7-day study streak.', metric: 'streak_days', targetValue: 7, currentValue: 0, joined: false },
  { id: '30-day-study-streak', title: '30-Day Study Streak', description: 'Build a 30-day study streak.', metric: 'streak_days', targetValue: 30, currentValue: 0, joined: false },
  { id: '1000-kp-challenge', title: '1,000 Knowledge Points Challenge', description: 'Earn 1,000 Knowledge Points from wherever you are studying.', metric: 'kp_gained', targetValue: 1000, currentValue: 110, joined: true },
  { id: '100-flashcards-challenge', title: '100 Flashcards Challenge', description: 'Master 100 flashcards across any of your decks.', metric: 'flashcards_mastered', targetValue: 100, currentValue: 0, joined: false },
  { id: 'mcat-biology-challenge', title: 'MCAT Biology Challenge', description: 'Complete 10 lessons in MCAT → Biology.', metric: 'lessons_completed', targetValue: 10, currentValue: 5, joined: true },
  { id: 'community-quiz-challenge', title: 'Community Quiz Challenge', description: 'Complete 25 AI-generated quizzes.', metric: 'quizzes_completed', targetValue: 25, currentValue: 0, joined: false },
];
