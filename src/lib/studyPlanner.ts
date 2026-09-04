import AsyncStorage from '@react-native-async-storage/async-storage';

import { WEBSITE_URL } from './config';

/**
 * Real Study Planner backend — calls the exact same Gemini-backed API
 * route studium-website's own Study Planner uses
 * (app/api/study-plan/route.ts there), rather than duplicating an AI
 * pipeline (and a second Gemini API key) inside this app. That route
 * already does the real work: rate limiting, prompt construction, and
 * strict response validation — this module's job is just building a
 * correct request and persisting the result on-device.
 *
 * This is the MVP slice of studium-website's much larger planner
 * (lib/weeklyPlanner.ts there, ~600 lines): the wizard + a real
 * AI-generated current week. Deliberately not built yet: the longer-term
 * roadmap UI, weekly reviews, and end-of-week checks — the API response
 * already includes a roadmap phase skeleton (kept below for later), but
 * nothing here renders it yet.
 *
 * No local per-subject signal data (MCAT quadrants, UCAT progress, etc.)
 * exists on mobile the way it does on the web app yet, so `subjects` is
 * always sent empty — same honest fallback studium-website's own
 * lib/plannerGoals.ts uses for goals it has no structured data for
 * ("let the AI use its own real knowledge of this exam's structure"),
 * not a fabricated signal.
 */

export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export const weekdayOptions: { id: Weekday; label: string }[] = [
  { id: 'Mon', label: 'Mon' },
  { id: 'Tue', label: 'Tue' },
  { id: 'Wed', label: 'Wed' },
  { id: 'Thu', label: 'Thu' },
  { id: 'Fri', label: 'Fri' },
  { id: 'Sat', label: 'Sat' },
  { id: 'Sun', label: 'Sun' },
];

export type PlannerOnboarding = {
  goal: string;
  examDate: string; // yyyy-mm-dd
  confidence: number; // 1-10
  hoursPerWeek: number;
  preferredDays: Weekday[]; // empty = no preference
};

export type ActivityType =
  | 'learn' | 'active_recall' | 'flashcards' | 'practice_questions'
  | 'mistake_review' | 'cumulative_review' | 'timed_practice' | 'practice_exam'
  | 'clinical_case' | 'ai_tutoring';

export type PlanTask = {
  id: string;
  subject: string;
  topic: string;
  title: string;
  activityType: ActivityType;
  durationMinutes: number;
  objective: string;
  priority: 'high' | 'medium' | 'low';
};

export type PlanPriority = { subject: string; topic: string; reason: string };

export type RoadmapPhase = {
  phaseId: string;
  name: string;
  startDate: string;
  endDate: string;
  objective: string;
};

export type WeeklyPlan = {
  goal: string;
  examDate: string;
  generatedAt: string;
  weekStartDateKey: string; // yyyy-mm-dd of the Monday this plan covers, used as the task-completion storage key
  weeklyGoal: string;
  priorities: PlanPriority[];
  tasks: PlanTask[];
  tips: string[];
  roadmap: { totalWeeks: number; phases: RoadmapPhase[] };
};

const ONBOARDING_KEY = 'studium_study_planner_onboarding';
const PLAN_KEY = 'studium_study_planner_plan';
const TASK_PROGRESS_KEY = 'studium_study_planner_task_progress';

export async function getPlannerOnboarding(): Promise<PlannerOnboarding | null> {
  const raw = await AsyncStorage.getItem(ONBOARDING_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function setPlannerOnboarding(input: PlannerOnboarding): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(input));
}

export async function getCurrentWeeklyPlan(): Promise<WeeklyPlan | null> {
  const raw = await AsyncStorage.getItem(PLAN_KEY);
  return raw ? JSON.parse(raw) : null;
}

function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// The Monday on/before today — matches studium-website's own week-start
// convention (lib/weeklyPlanner.ts), so a plan generated any day this
// week is keyed to the same Monday.
function currentWeekStartKey(): string {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diffToMonday = day === 0 ? 6 : day - 1;
  now.setDate(now.getDate() - diffToMonday);
  return now.toISOString().slice(0, 10);
}

export function getDaysRemaining(examDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${examDate}T00:00:00`);
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000));
}

export type RequestPlanResult = { ok: true; plan: WeeklyPlan } | { ok: false; error: string };

// Real network call, real failure modes surfaced honestly (rate limit,
// validation failure, network error) — never a fabricated plan on error.
export async function requestWeeklyPlan(onboarding: PlannerOnboarding): Promise<RequestPlanResult> {
  const currentDate = todayDateKey();
  const daysRemaining = getDaysRemaining(onboarding.examDate);

  try {
    const res = await fetch(`${WEBSITE_URL}/api/study-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        goal: onboarding.goal,
        examDate: onboarding.examDate,
        currentDate,
        daysRemaining,
        confidence: onboarding.confidence,
        hoursPerWeek: onboarding.hoursPerWeek,
        preferredDays: onboarding.preferredDays,
        subjects: [],
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { ok: false, error: (body && typeof body.error === 'string' && body.error) || `The planner couldn't generate a plan right now (${res.status}).` };
    }

    const data = await res.json();
    const plan: WeeklyPlan = {
      goal: onboarding.goal,
      examDate: onboarding.examDate,
      generatedAt: new Date().toISOString(),
      weekStartDateKey: currentWeekStartKey(),
      weeklyGoal: data.currentWeek.weeklyGoal,
      priorities: data.currentWeek.priorities ?? [],
      tasks: data.currentWeek.tasks ?? [],
      tips: data.currentWeek.tips ?? [],
      roadmap: data.roadmap ?? { totalWeeks: 0, phases: [] },
    };
    await AsyncStorage.setItem(PLAN_KEY, JSON.stringify(plan));
    // A freshly generated plan starts with a clean completion slate for
    // this week's tasks.
    await AsyncStorage.setItem(TASK_PROGRESS_KEY, JSON.stringify({ [plan.weekStartDateKey]: {} }));
    return { ok: true, plan };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Something went wrong. Please try again.' };
  }
}

// ---- Local-only task completion (mirrors studium-website's own
// getTaskCompletion/toggleTaskDone) — never sent to the AI, purely a
// per-device checklist state. ----

async function readAllTaskProgress(): Promise<Record<string, Record<string, boolean>>> {
  const raw = await AsyncStorage.getItem(TASK_PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function getTaskCompletion(weekStartDateKey: string): Promise<Record<string, boolean>> {
  const all = await readAllTaskProgress();
  return all[weekStartDateKey] ?? {};
}

export async function toggleTaskDone(weekStartDateKey: string, taskId: string): Promise<Record<string, boolean>> {
  const all = await readAllTaskProgress();
  const week = { ...(all[weekStartDateKey] ?? {}) };
  week[taskId] = !week[taskId];
  all[weekStartDateKey] = week;
  await AsyncStorage.setItem(TASK_PROGRESS_KEY, JSON.stringify(all));
  return week;
}

export type PlannerHomeSnapshot = {
  daysToExam: number;
  planKpEarned: number;
  planKpTarget: number;
};

// What Home's "days to exam" / KP chips read (features/dashboard/
// DashboardScreen.tsx) — real numbers pulled from the student's own real
// generated plan, not the app's separate daily-streak KP system (which
// has no real per-day backend anywhere yet — see dashboard/remote.ts's
// own honest comment on that). "Plan KP" here is deliberately simple and
// transparent rather than a fabricated point value: one real AI-generated
// task = one KP, so the number always means exactly "tasks done / tasks
// in this week's real plan," nothing invented on top of it. Returns null
// when there's no real plan yet, so the caller can fall back to mock
// rather than showing a real-looking 0/0.
export async function getPlannerHomeSnapshot(): Promise<PlannerHomeSnapshot | null> {
  const plan = await getCurrentWeeklyPlan();
  if (!plan) return null;
  const completion = await getTaskCompletion(plan.weekStartDateKey);
  return {
    daysToExam: getDaysRemaining(plan.examDate),
    planKpEarned: plan.tasks.filter((t) => completion[t.id]).length,
    planKpTarget: plan.tasks.length,
  };
}
