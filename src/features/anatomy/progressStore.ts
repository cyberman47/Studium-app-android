import { useSyncExternalStore } from 'react';

import { loadPersisted, savePersisted } from '@/lib/persistedState';

import type { AnatomyFlashcard, AnatomyFlashcardSection } from './flashcards';

// Real, persisted attempt history for the anatomy flashcards — the phone's
// equivalent of the web app's lib/practiceHistory.ts, scoped to just this
// feature. It backs two real numbers on the section picker (cards studied
// per section, and the % that gives) and one real signal in the quiz (a
// concept the student keeps missing gets a teaching slide before the
// question). Nothing here is a placeholder: every count is derived from
// answers the student actually gave.
//
// Two maps, deliberately, because the two readers want different shapes:
//  - `latest` keeps the most recent attempt per card. A card counts as
//    "studied" once it's been answered at all, right or wrong — same
//    dedupe rule the web's getMasteryStatus uses, so the two apps agree
//    on what a section's % means.
//  - `concepts` tallies hits/misses per (section, concept) across every
//    attempt, since "weak concept" is a running record, not a latest-state
//    question — matching the web's getWeakConcepts rule (missed at least
//    twice, and misses ≥ hits).

type LatestAttempt = { correct: boolean; at: number };
type ConceptTally = { hits: number; misses: number };

export type AnatomyProgress = {
  latest: Record<string, LatestAttempt>;
  concepts: Record<string, ConceptTally>;
};

const STORAGE_KEY = 'studium_anatomy_progress';
const EMPTY: AnatomyProgress = { latest: {}, concepts: {} };

let state: AnatomyProgress = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Hydrate once at module load. Until the read resolves the store reports
// nothing studied, which is the honest empty state rather than a guess —
// the AsyncStorage round-trip is a few ms, well inside the section picker's
// first paint.
loadPersisted<AnatomyProgress>(STORAGE_KEY, EMPTY).then((saved) => {
  if (saved && saved.latest && saved.concepts) {
    state = saved;
    emit();
  }
});

export function useAnatomyProgress(): AnatomyProgress {
  return useSyncExternalStore(subscribe, () => state);
}

function conceptKey(sectionId: string, concept: string) {
  return `${sectionId}|${concept}`;
}

export function logAnatomyAttempt(card: AnatomyFlashcard, sectionId: string, correct: boolean) {
  const key = conceptKey(sectionId, card.concept);
  const tally = state.concepts[key] ?? { hits: 0, misses: 0 };
  state = {
    latest: { ...state.latest, [card.id]: { correct, at: Date.now() } },
    concepts: {
      ...state.concepts,
      [key]: correct ? { ...tally, hits: tally.hits + 1 } : { ...tally, misses: tally.misses + 1 },
    },
  };
  savePersisted(STORAGE_KEY, state);
  emit();
}

export function sectionProgress(progress: AnatomyProgress, section: AnatomyFlashcardSection) {
  const attemptedCount = section.cards.reduce((n, card) => n + (progress.latest[card.id] ? 1 : 0), 0);
  const percent = section.cards.length > 0 ? Math.round((attemptedCount / section.cards.length) * 100) : 0;
  return { attemptedCount, percent };
}

export function isWeakConcept(progress: AnatomyProgress, sectionId: string, concept: string): boolean {
  const tally = progress.concepts[conceptKey(sectionId, concept)];
  if (!tally) return false;
  return tally.misses >= 2 && tally.misses >= tally.hits;
}
