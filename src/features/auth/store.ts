import { useSyncExternalStore } from 'react';

import { supabase } from '@/lib/supabase';

/**
 * Real Supabase auth state — backed by the actual session (see
 * lib/supabase.ts), not an in-memory flag. `status` starts 'loading'
 * because restoring a persisted session from AsyncStorage is async; the
 * app-launch gate (app/_layout.tsx) waits for that to resolve before
 * deciding whether to show Home or the Welcome screen, so a returning,
 * still-logged-in student never gets bounced to Welcome just because the
 * check hadn't finished yet.
 *
 * onboardingComplete mirrors the real profiles.onboarding_complete column
 * (supabase/migrations/0001_profiles.sql in studium-website — it already
 * existed there, just unused until now). It's null until checked (fetched
 * the moment a session resolves to authenticated) so the launch gate can
 * tell "still checking" apart from "genuinely false" and doesn't bounce a
 * fully onboarded student to Onboarding just because the read hadn't
 * landed yet.
 */

type AuthState = {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  userId: string | null;
  email: string | null;
  onboardingComplete: boolean | null;
};

let state: AuthState = { status: 'loading', userId: null, email: null, onboardingComplete: null };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setFromSession(session: { user: { id: string; email?: string | null } } | null) {
  if (!session) {
    state = { status: 'unauthenticated', userId: null, email: null, onboardingComplete: null };
    emit();
    return;
  }
  state = { status: 'authenticated', userId: session.user.id, email: session.user.email ?? null, onboardingComplete: null };
  emit();
  const { id } = session.user;
  supabase
    .from('profiles')
    .select('onboarding_complete')
    .eq('id', id)
    .maybeSingle()
    .then(({ data }) => {
      // Ignore a stale response that lands after a different user has
      // since signed in (or signed out) — id-guard rather than a cancel
      // flag, since setFromSession itself doesn't carry a cleanup handle.
      if (state.userId !== id) return;
      state = { ...state, onboardingComplete: data?.onboarding_complete ?? false };
      emit();
    });
}

// Populates the initial state as soon as the persisted session (if any)
// finishes restoring, then keeps it live for every future change (sign in,
// sign out, token refresh) for the lifetime of the app.
supabase.auth.getSession().then(({ data }) => setFromSession(data.session));
supabase.auth.onAuthStateChange((_event, session) => setFromSession(session));

export function useAuthState(): AuthState {
  return useSyncExternalStore(subscribe, () => state);
}

// Called once the onboarding flow's completion screen fires (features/
// onboarding/store.ts) — flips the local copy immediately so the launch
// gate stops redirecting to Onboarding without waiting on a fresh fetch.
export function setOnboardingComplete() {
  state = { ...state, onboardingComplete: true };
  emit();
}

export function useIsLoggedIn(): boolean {
  return useAuthState().status === 'authenticated';
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  // No session means Supabase created the account but is waiting on an
  // email confirmation click before issuing one — same real project
  // setting the web app's signup flow already handles (see
  // app/signup/page.tsx's awaitingConfirmation state there).
  return { awaitingConfirmation: !data.session };
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function logOut() {
  await supabase.auth.signOut();
}
