import { useSyncExternalStore } from 'react';

import { loadPersisted, savePersisted } from '@/lib/persistedState';

// Language has no real i18n system behind it yet — the app only ever
// renders English strings — so this is honestly a local preference with
// nothing wired to it, same as reader/reviewStore.ts, not a working
// translation switch. Kept here (not in reader/reviewStore) since it's
// the one "General" app-level preference outside of Appearance.
export const languageOptions = ['English', 'Spanish', 'Dutch'];

const KEY = 'studium_language';
const DEFAULT_LANGUAGE = 'English';

let language = DEFAULT_LANGUAGE;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

loadPersisted(KEY, DEFAULT_LANGUAGE).then((loaded) => {
  language = loaded;
  emit();
});

export function useLanguage(): string {
  return useSyncExternalStore(subscribe, () => language);
}

export function setLanguage(next: string) {
  language = next;
  emit();
  savePersisted(KEY, next);
}
