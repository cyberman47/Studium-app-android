import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
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

// username is passed as auth metadata, not written to `profiles` directly
// — the same handle_new_user trigger that already backfills a name/avatar
// from OAuth metadata (supabase/migrations/0001_profiles.sql in
// studium-website) reads raw_user_meta_data->>'username' for this exact
// field, falling back to the email's own local-part if it's ever omitted
// (e.g. a Google sign-up, which has no username field to fill in).
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
  if (error) throw error;
  // No session means Supabase created the account but is waiting on an
  // email confirmation click before issuing one — same real project
  // setting the web app's signup flow already handles (see
  // app/signup/page.tsx's awaitingConfirmation state there).
  return { awaitingConfirmation: !data.session };
}

// Real Google OAuth, not a placeholder button — same Supabase project as
// studium-website, whose own Google sign-in is built but still paused on
// whitelisting its redirect URL there (see that repo's own notes). This
// will surface that identical "not configured yet" error honestly if
// Google isn't enabled for this project rather than pretending to work.
//
// Supabase's browser client normally finishes an OAuth redirect itself by
// reading tokens straight out of the page's own URL (detectSessionInUrl) —
// there's no such URL here, only a deep link the OS hands back to the app,
// so this does that step by hand: open the provider's consent screen in an
// in-app browser tab (WebBrowser.openAuthSessionAsync, not the OS
// browser — required for the redirect back to actually reach this app),
// wait for it to redirect to this app's own studiummobile:// scheme, then
// exchange the `code` that redirect carries for a real session
// (exchangeCodeForSession — the PKCE flow lib/supabase.ts's client is
// configured for). Once that call succeeds, supabase.auth.onAuthStateChange
// (subscribed once, above) picks up the new session on its own — same
// listener signIn/signUp already rely on — so there's nothing further to
// do here to actually log the student in.
export async function signInWithGoogle() {
  const redirectTo = Linking.createURL('auth-callback');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data.url) throw new Error('Could not start Google sign-in.');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success' || !result.url) {
    throw new Error('Google sign-in was cancelled.');
  }

  const { queryParams } = Linking.parse(result.url);
  const code = typeof queryParams?.code === 'string' ? queryParams.code : null;
  const oauthError = typeof queryParams?.error_description === 'string' ? queryParams.error_description : null;
  if (oauthError) throw new Error(oauthError);
  if (!code) throw new Error('Google sign-in did not return an authorization code.');

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) throw exchangeError;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { userId: data.user.id };
}

// A direct, one-off read — deliberately not routed through the reactive
// `state.onboardingComplete` above. AuthScreen calls this right after
// signIn/signUp to decide where to navigate *before* it moves at all;
// waiting on the reactive value instead would mean landing on Home first
// and only correcting to Onboarding once that background fetch resolved
// a moment later — a real, visible flash of the dashboard that used to
// happen here.
export async function fetchOnboardingComplete(userId: string): Promise<boolean> {
  const { data } = await supabase.from('profiles').select('onboarding_complete').eq('id', userId).maybeSingle();
  return data?.onboarding_complete ?? false;
}

export async function logOut() {
  await supabase.auth.signOut();
}
