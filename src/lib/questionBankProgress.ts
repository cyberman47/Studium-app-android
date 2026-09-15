import { useSyncExternalStore } from 'react';

import { loadPersisted, savePersisted } from './persistedState';
import type { BankTrack } from './contentBank';

/**
 * Real, persisted attempt history for the question banks (MCAT/Nursing) —
 * the same local-only pattern as features/anatomy/progressStore.ts, since
 * there's no Supabase progress table for this content (nothing else in the
 * app has one either; profiles/leaderboard are the only tables the app
 * writes to). A lesson counts as "done" once every one of its questions
 * has been answered at least once, right or wrong — same dedupe rule
 * anatomy's store uses for a card.
 */

type LatestAttempt = { correct: boolean; at: number };

export type QuestionBankProgress = {
  latest: Record<string, LatestAttempt>; // key: `${track}|${lessonId}|${questionId}`
};

const STORAGE_KEY = 'studium_question_bank_progress';
const EMPTY: QuestionBankProgress = { latest: {} };

let state: QuestionBankProgress = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

loadPersisted<QuestionBankProgress>(STORAGE_KEY, EMPTY).then((saved) => {
  if (saved && saved.latest) {
    state = saved;
    emit();
  }
});

export function useQuestionBankProgress(): QuestionBankProgress {
  return useSyncExternalStore(subscribe, () => state);
}

function questionKey(track: BankTrack, lessonId: string, questionId: string) {
  return `${track}|${lessonId}|${questionId}`;
}

function lessonKeyPrefix(track: BankTrack, lessonId: string) {
  return `${track}|${lessonId}|`;
}

export function logQuestionAttempt(track: BankTrack, lessonId: string, questionId: string, correct: boolean) {
  const key = questionKey(track, lessonId, questionId);
  state = { latest: { ...state.latest, [key]: { correct, at: Date.now() } } };
  savePersisted(STORAGE_KEY, state);
  emit();
}

export function lessonAttemptedCount(progress: QuestionBankProgress, track: BankTrack, lessonId: string): number {
  const prefix = lessonKeyPrefix(track, lessonId);
  return Object.keys(progress.latest).filter((k) => k.startsWith(prefix)).length;
}

export function lessonCompletion(
  progress: QuestionBankProgress,
  track: BankTrack,
  lessonId: string,
  totalQuestions: number,
): { attempted: number; percent: number; done: boolean } {
  const attempted = lessonAttemptedCount(progress, track, lessonId);
  const percent = totalQuestions > 0 ? Math.round((attempted / totalQuestions) * 100) : 0;
  return { attempted, percent, done: totalQuestions > 0 && attempted >= totalQuestions };
}
