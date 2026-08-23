import { useSyncExternalStore } from 'react';

import { loadPersisted, savePersisted } from '@/lib/persistedState';

/**
 * Every Review (flashcard session) setting the spec asks for, genuinely
 * persisted — but there's no real flashcard review session engine in this
 * app yet for any of it to actually configure (Library's "My Decks" is
 * still mock content). Same honesty as readerStore.ts: real typed shape,
 * real persistence, nothing behind it to govern yet.
 */

export type ReviewMode = 'Standard' | 'Quick Review' | 'Difficult Cards' | 'Due Cards' | 'New Cards' | 'Mixed Review';
export type ReviewOrder = 'Recommended' | 'Random' | 'Oldest first' | 'Most difficult first' | 'Recently incorrect first';

export type ReviewSettings = {
  cardsPerSession: number;
  cardsPerSessionCustom: boolean;
  reviewMode: ReviewMode;
  included: string[];
  questionTypes: string[];
  reviewOrder: ReviewOrder;
  showAnswerAfterSelection: boolean;
  requireSelfRating: boolean;
  showExplanation: boolean;
  autoContinue: boolean;
};

export const cardsPerSessionPresets = [10, 20, 30, 50, 75, 100];
export const reviewModeOptions: ReviewMode[] = ['Standard', 'Quick Review', 'Difficult Cards', 'Due Cards', 'New Cards', 'Mixed Review'];
export const includedOptions = ['New cards', 'Due cards', 'Difficult cards', 'Previously mastered cards', 'Recently incorrect cards'];
// No real session engine renders any format yet, so none is more
// "supported" than another — unlike Reader's Text Style, there's nothing
// real to filter this list against, so every format the spec lists stays
// selectable rather than guessing which one might ship first.
export const questionTypeOptions = ['Basic question & answer', 'Multiple choice', 'Image-based questions', 'Fill in the blank', 'Clinical cases'];
export const reviewOrderOptions: ReviewOrder[] = ['Recommended', 'Random', 'Oldest first', 'Most difficult first', 'Recently incorrect first'];

const KEY = 'studium_review_settings';

export const defaultReviewSettings: ReviewSettings = {
  cardsPerSession: 20,
  cardsPerSessionCustom: false,
  reviewMode: 'Standard',
  included: ['New cards', 'Due cards'],
  questionTypes: ['Basic question & answer', 'Multiple choice'],
  reviewOrder: 'Recommended',
  showAnswerAfterSelection: true,
  requireSelfRating: true,
  showExplanation: true,
  autoContinue: false,
};

let state: ReviewSettings = defaultReviewSettings;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

loadPersisted(KEY, defaultReviewSettings).then((loaded) => {
  state = { ...defaultReviewSettings, ...loaded };
  emit();
});

export function useReviewSettings(): ReviewSettings {
  return useSyncExternalStore(subscribe, () => state);
}

export function updateReviewSettings(patch: Partial<ReviewSettings>) {
  state = { ...state, ...patch };
  emit();
  savePersisted(KEY, state);
}
