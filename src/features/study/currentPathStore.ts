import { useSyncExternalStore } from 'react';

import { type PathId, pathOptions } from '@/constants/paths';
import { loadPersisted, savePersisted } from '@/lib/persistedState';

/**
 * The one "currently studying" selection, shared across every screen that
 * shows or reads it — Home's and Learn's CurrentPathBadge (display-only),
 * Settings > General's real picker (the only place it can be changed —
 * see features/settings/GeneralScreen.tsx), and the Courses grid's
 * relevance filter (tracks.ts's relevantTracksForPath). Centralizing it
 * here (same useSyncExternalStore + AsyncStorage pattern as
 * appearanceStore.ts) is what makes "what am I studying" one real,
 * consistent answer everywhere instead of independent guesses.
 *
 * Mirrors the web's lib/currentPath.ts CURRENT_PATH_KEY/localStorage
 * pattern: persists locally so it survives a restart, and (like the web)
 * a real profile-derived label still wins on a fresh app open — see
 * seedFromProfileLabel below — right up until the student makes an
 * explicit choice, which then sticks for the rest of the session no
 * matter how many times a profile fetch resolves elsewhere.
 */

const KEY = 'studium_current_learning_path';
const DEFAULT_ID: PathId = 'mcat';

let pathId: PathId = DEFAULT_ID;
const listeners = new Set<() => void>();

// In-memory only (not persisted) — deliberately reset on every cold start
// so a fresh app open still trusts the real profile-derived path once,
// same as before this store existed. Sticks for the rest of the running
// session the moment the student picks something themselves, wherever
// that pick happens (Home or Learn).
let userChanged = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

loadPersisted<PathId>(KEY, DEFAULT_ID).then((loaded) => {
  pathId = loaded;
  emit();
});

export function useCurrentPathId(): PathId {
  return useSyncExternalStore(subscribe, () => pathId);
}

export function setCurrentPathId(id: PathId) {
  userChanged = true;
  pathId = id;
  emit();
  savePersisted(KEY, id);
}

// Called by CurrentPathBadge once its real profile-derived pathLabel
// resolves — a no-op once the student has made an explicit choice (in
// Settings > General) this session.
export function seedCurrentPathFromLabel(label: string) {
  if (userChanged) return;
  const match = pathOptions.find((p) => p.label === label);
  if (!match || match.id === pathId) return;
  pathId = match.id;
  emit();
}
