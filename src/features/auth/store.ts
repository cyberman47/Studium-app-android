import { useSyncExternalStore } from 'react';

/**
 * A real (if backend-less) signed-in flag — same useSyncExternalStore
 * pattern as every other store in this app. Defaults to true so the app
 * keeps opening straight to Home like it always has; Log Out (More >
 * Account) is what actually flips it, and the Sign Up/Log In screen
 * (features/auth/AuthScreen.tsx) flips it back. There's no real backend
 * behind this yet — no Supabase, no token — so "logged out" here means
 * "showing the signed-out screen", not an enforced gate on the rest of the
 * app; that's the same honesty this app already applies to its other
 * mock-data screens (Notifications, AI chat, etc.).
 */

let isLoggedIn = true;
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
