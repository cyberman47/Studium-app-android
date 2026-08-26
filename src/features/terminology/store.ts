import { useSyncExternalStore } from 'react';

import { loadPersisted, savePersisted } from '@/lib/persistedState';

import { termGlossary } from './data';

/**
 * Real, working, persisted per-term progress — mirrors the web app's own
 * two-part model (lib/terminology.ts there): pressing a term adds it to
 * the library immediately (inLibrary), independent of whether it's ever
 * rated; rating it (dont-know / somewhat / know-well) is a separate,
 * optional step layered on top. Genuinely empty until the student
 * actually taps through the glossary — same honesty as every other "no
 * real backend yet" feature this session.
 */

export type TermConfidence = 'dont-know' | 'somewhat' | 'know-well';

export type TermProgress = {
  inLibrary: boolean;
  confidence: TermConfidence | null;
};

// unknown: never pressed — the yellow "haven't looked at this yet" state.
// learning: pressed (in the library) but not rated "know-well" — still
// worth another look, so it stays visibly interactive, just not yellow.
// mastered: rated "know-well" — blends into normal reading text, but
// (per feedback) never becomes non-interactive — tapping it still
// reopens the same real definition/rating sheet.
export type MasteryTier = 'unknown' | 'learning' | 'mastered';

export function getMasteryTier(progress: TermProgress | undefined): MasteryTier {
  if (!progress?.inLibrary) return 'unknown';
  if (progress.confidence === 'know-well') return 'mastered';
  return 'learning';
}

const KEY = 'studium_terminology_progress';

let progressMap: Record<string, TermProgress> = {};
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

loadPersisted<Record<string, TermProgress>>(KEY, {}).then((loaded) => {
  progressMap = loaded;
  emit();
});

export function useTermProgressMap(): Record<string, TermProgress> {
  return useSyncExternalStore(subscribe, () => progressMap);
}

export function useTermProgress(id: string): TermProgress | undefined {
  return useTermProgressMap()[id];
}

// The "press moment" — opening a term's definition. Idempotent: pressing
// an already-in-library term again is a no-op, same as the web app's
// learnTerm(). This is what makes "tap a yellow word" alone enough to
// add it to your terminology, before any rating happens.
export function recordTermPressed(id: string) {
  const existing = progressMap[id];
  if (existing?.inLibrary) return;
  progressMap = { ...progressMap, [id]: { inLibrary: true, confidence: existing?.confidence ?? null } };
  emit();
  savePersisted(KEY, progressMap);
}

export function setTermConfidence(id: string, confidence: TermConfidence) {
  progressMap = { ...progressMap, [id]: { inLibrary: true, confidence } };
  emit();
  savePersisted(KEY, progressMap);
}

export function useTerminologyStats() {
  const map = useTermProgressMap();
  const learnedCount = termGlossary.filter((t) => map[t.id]?.confidence === 'know-well').length;
  return {
    learnedCount,
    toReviewCount: Math.max(0, termGlossary.length - learnedCount),
  };
}
