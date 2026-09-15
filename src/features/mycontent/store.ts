import { useSyncExternalStore } from 'react';

/**
 * What the Home screen's "+" import button actually creates — flashcard
 * sets a student types in themselves (there's no file-import pipeline
 * wired up, so "import" here means "add your own", the same way "profile
 * picture" in Settings means "pick a color", not a photo upload). Same
 * plain module-level useSyncExternalStore pattern as features/profile/
 * store.ts — only Home (create) and My Content (list/delete) ever need
 * this, so a state library would be overkill. Read by Library's "My
 * Content" row and the My Content screen; written by NewFlashcardScreen.
 * (Note-taking was dropped from Create per feedback — this store used to
 * also hold a `notes` list for it.)
 */

export type FlashcardSet = {
  id: string;
  title: string;
  cards: { front: string; back: string }[];
  createdAt: number;
};

type MyContent = {
  flashcardSets: FlashcardSet[];
};

let state: MyContent = {
  flashcardSets: [],
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getState(): MyContent {
  return state;
}

export function useMyContent(): MyContent {
  return useSyncExternalStore(subscribe, getState);
}

export function addFlashcardSet(title: string, cards: { front: string; back: string }[]) {
  const set: FlashcardSet = { id: `deck-${Date.now()}`, title, cards, createdAt: Date.now() };
  state = { ...state, flashcardSets: [set, ...state.flashcardSets] };
  emit();
}

export function removeFlashcardSet(id: string) {
  state = { ...state, flashcardSets: state.flashcardSets.filter((s) => s.id !== id) };
  emit();
}
