import { useSyncExternalStore } from 'react';

import { loadPersisted, savePersisted } from '@/lib/persistedState';

/**
 * The student's own saved word/definition list — built either by typing
 * a word and its definition directly, or by saving a real hit from
 * Studium's terminology database (lib/glossary.ts). Same local-persisted
 * useSyncExternalStore pattern as every other "my own stuff" store in
 * this app (features/mycontent/store.ts, features/terminology/store.ts).
 */

export type MyWord = {
  id: string;
  term: string;
  definition: string;
  source: 'manual' | 'nursing' | 'ucat';
  savedAt: number;
};

const KEY = 'studium_my_words';

let words: MyWord[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

loadPersisted<MyWord[]>(KEY, []).then((loaded) => {
  words = loaded;
  emit();
});

export function useMyWords(): MyWord[] {
  return useSyncExternalStore(subscribe, () => words);
}

export function addMyWord(term: string, definition: string, source: MyWord['source'] = 'manual', id?: string) {
  const wordId = id ?? `word-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  if (words.some((w) => w.id === wordId)) return; // already saved
  const word: MyWord = { id: wordId, term, definition, source, savedAt: Date.now() };
  words = [word, ...words];
  emit();
  savePersisted(KEY, words);
}

export function removeMyWord(id: string) {
  words = words.filter((w) => w.id !== id);
  emit();
  savePersisted(KEY, words);
}

export function useIsWordSaved(id: string): boolean {
  return useMyWords().some((w) => w.id === id);
}
