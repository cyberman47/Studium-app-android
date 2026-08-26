import { useSyncExternalStore } from 'react';

import { loadPersisted, savePersisted } from '@/lib/persistedState';

/**
 * Real, working, persisted state for the three save/study controls on a
 * VocabularyWordCard that don't already have a home in another feature
 * (Create flashcard reuses features/mycontent's real addFlashcardSet
 * directly instead of tracking its own copy here). Genuinely empty until
 * a student actually taps one of these — same honesty as every other
 * "no real backend yet" feature this session. Three independent id sets
 * rather than one status enum: a word can be on the study list AND
 * already marked known at the same time, same as it can in real life.
 */

const KEY = 'studium_vocabulary_saved';

let savedIds: string[] = [];
const savedListeners = new Set<() => void>();

function emitSaved() {
  savedListeners.forEach((l) => l());
}
function subscribeSaved(listener: () => void) {
  savedListeners.add(listener);
  return () => savedListeners.delete(listener);
}
loadPersisted<string[]>(KEY, []).then((loaded) => {
  savedIds = loaded;
  emitSaved();
});

export function useSavedVocabularyIds(): string[] {
  return useSyncExternalStore(subscribeSaved, () => savedIds);
}
export function toggleVocabularySaved(id: string): boolean {
  const now = !savedIds.includes(id);
  savedIds = now ? [...savedIds, id] : savedIds.filter((i) => i !== id);
  emitSaved();
  savePersisted(KEY, savedIds);
  return now;
}

const KNOWN_KEY = 'studium_vocabulary_known';

let knownIds: string[] = [];
const knownListeners = new Set<() => void>();

function emitKnown() {
  knownListeners.forEach((l) => l());
}
function subscribeKnown(listener: () => void) {
  knownListeners.add(listener);
  return () => knownListeners.delete(listener);
}
loadPersisted<string[]>(KNOWN_KEY, []).then((loaded) => {
  knownIds = loaded;
  emitKnown();
});

export function useKnownVocabularyIds(): string[] {
  return useSyncExternalStore(subscribeKnown, () => knownIds);
}
export function toggleVocabularyKnown(id: string): boolean {
  const now = !knownIds.includes(id);
  knownIds = now ? [...knownIds, id] : knownIds.filter((i) => i !== id);
  emitKnown();
  savePersisted(KNOWN_KEY, knownIds);
  return now;
}

const STUDY_LIST_KEY = 'studium_vocabulary_study_list';

let studyListIds: string[] = [];
const studyListListeners = new Set<() => void>();

function emitStudyList() {
  studyListListeners.forEach((l) => l());
}
function subscribeStudyList(listener: () => void) {
  studyListListeners.add(listener);
  return () => studyListListeners.delete(listener);
}
loadPersisted<string[]>(STUDY_LIST_KEY, []).then((loaded) => {
  studyListIds = loaded;
  emitStudyList();
});

export function useStudyListVocabularyIds(): string[] {
  return useSyncExternalStore(subscribeStudyList, () => studyListIds);
}
export function toggleVocabularyStudyList(id: string): boolean {
  const now = !studyListIds.includes(id);
  studyListIds = now ? [...studyListIds, id] : studyListIds.filter((i) => i !== id);
  emitStudyList();
  savePersisted(STUDY_LIST_KEY, studyListIds);
  return now;
}
