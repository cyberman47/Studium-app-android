/**
 * Progress tab data — Study Plan and Performance are the same underlying
 * picture of "how is studying going" as what Home already reads from
 * features/dashboard/data.ts, so this re-slices that same mock data
 * rather than duplicating it. Swapping either for real fetching later
 * should only mean this file (and dashboard/data.ts) change, not any
 * component that reads from it.
 */

import { mockDashboard } from '@/features/dashboard/data';

export const mockProgress = {
  daysToExam: mockDashboard.daysToExam,
  todayKP: mockDashboard.todayKP,
  targetKP: mockDashboard.targetKP,
  examReadinessPercent: mockDashboard.examReadinessPercent,
  overallMasteryPercent: mockDashboard.overallMasteryPercent,
  studyTimeToday: mockDashboard.studyTimeToday,
  studyTimeThisWeek: mockDashboard.studyTimeThisWeek,
  weeklyKP: mockDashboard.weeklyKP,
  weeklyActivity: mockDashboard.weeklyActivity,
  level: mockDashboard.level,
  levelName: mockDashboard.levelName,
  totalKP: mockDashboard.totalKP,
  focusAreas: mockDashboard.focusAreas,
};
