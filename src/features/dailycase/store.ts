import { useSyncExternalStore } from 'react';

import { loadPersisted, savePersisted } from '@/lib/persistedState';

import { getTodayDateKey } from './logic';

/**
 * Real, persisted "did I solve today's case" state — port of the web
 * app's CASE_PROGRESS_KEY map (lib/clinicalCases.ts), keyed by date so
 * it naturally resets once a new day's case rotates in, same as there.
 */
export type CaseAttempt = {
  caseId: string;
  selectedIndex: number;
  correct: boolean;
  beatsRevealed: number;
  kpAwarded: number;
};

const KEY = 'studium_case_progress';

let progressMap: Record<string, CaseAttempt> = {};
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

loadPersisted<Record<string, CaseAttempt>>(KEY, {}).then((loaded) => {
  progressMap = loaded;
  emit();
});

export function useTodayCaseAttempt(): CaseAttempt | null {
  const map = useSyncExternalStore(subscribe, () => progressMap);
  return map[getTodayDateKey()] ?? null;
}

export function submitCaseDiagnosis(caseId: string, selectedIndex: number, correct: boolean, beatsRevealed: number, kpAwarded: number): CaseAttempt {
  const attempt: CaseAttempt = { caseId, selectedIndex, correct, beatsRevealed, kpAwarded };
  progressMap = { ...progressMap, [getTodayDateKey()]: attempt };
  emit();
  savePersisted(KEY, progressMap);
  return attempt;
}
