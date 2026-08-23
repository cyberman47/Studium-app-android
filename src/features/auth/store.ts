import { useSyncExternalStore } from 'react';

/**
 * A real (if backend-less) signed-in flag — same useSyncExternalStore
 * pattern as every other store in this app. Defaults to false: the
 * Welcome screen (features/auth/WelcomeScreen.tsx) is meant to be the
 * actual first thing anyone sees when they open the app (see the
 * launch-time gate in app/_layout.tsx), not something only reachable via
 * Log Out. There's no persistence layer behind this yet — no Supabase, no
 * token, nothing surviving a cold start — so every fresh launch honestly
 * starts signed out, same as every other mock-data piece of this app;
 * logIn()/logOut() just flip this in-memory flag for the rest of that
 * running session.
 */

let isLoggedIn = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useIsLoggedIn(): boolean {
  return useSyncExternalStore(subscribe, () => isLoggedIn);
}

export function logOut() {
  isLoggedIn = false;
  emit();
}

export function logIn() {
  isLoggedIn = true;
  emit();
}
