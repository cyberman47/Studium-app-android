import { useSyncExternalStore } from 'react';

import { loadPersisted, savePersisted } from '@/lib/persistedState';

/**
 * The one genuinely real, functional Settings control in this feature —
 * everything else under Reader/Review has no real feature behind it yet
 * (see readerStore.ts/reviewStore.ts), but Appearance is a small, safe
 * change that actually does something: hooks/use-theme.ts reads this
 * instead of blindly following the OS scheme, so picking Light/Dark here
 * genuinely overrides the system setting app-wide, immediately, and the
 * choice survives an app restart.
 */

export type AppearanceMode = 'system' | 'light' | 'dark';

const KEY = 'studium_appearance_mode';
const DEFAULT_MODE: AppearanceMode = 'system';

let mode: AppearanceMode = DEFAULT_MODE;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

loadPersisted(KEY, DEFAULT_MODE).then((loaded) => {
  mode = loaded;
  emit();
});

export function useAppearanceMode(): AppearanceMode {
  return useSyncExternalStore(subscribe, () => mode);
}

export function setAppearanceMode(next: AppearanceMode) {
  mode = next;
  emit();
  savePersisted(KEY, next);
}
