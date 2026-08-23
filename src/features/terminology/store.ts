import { useSyncExternalStore } from 'react';

import { loadPersisted, savePersisted } from '@/lib/persistedState';

import { termGlossary } from './data';

/**
 * Real, working, persisted state for which terms this student has marked
 * learned — genuinely empty until they actually tap through the
 * glossary, same honesty as every other "no real backend yet" feature
 * this session (Settings' Reader/Review, mycontent's notes/flashcards).
 * "Terms to review" is just glossary.length minus this, not a second
 * tracked number, so the two can never drift out of sync.
 */

const KEY = 'studium_terminology_learned';

let learnedIds: string[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

loadPersisted<string[]>(KEY, []).then((loaded) => {
  learnedIds = loaded;
  emit();
});

export function useLearnedTermIds(): string[] {
  return useSyncExternalStore(subscribe, () => learnedIds);
}

export function toggleTermLearned(id: string) {
  learnedIds = learnedIds.includes(id) ? learnedIds.filter((t) => t !== id) : [...learnedIds, id];
  emit();
  savePersisted(KEY, learnedIds);
}

export function useTerminologyStats() {
  const learned = useLearnedTermIds();
  return {
    learnedCount: learned.length,
    toReviewCount: Math.max(0, termGlossary.length - learned.length),
  };
}
