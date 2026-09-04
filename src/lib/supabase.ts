// react-native-url-polyfill patches the URL global Supabase's client needs
// and that Hermes (RN's JS engine) doesn't fully provide — must be
// imported before @supabase/supabase-js touches anything.
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/**
 * The real backend — the same Supabase project studium-website (the web
 * app) uses, so an account created here is the same account, same
 * `profiles` row, same everything there. The anon key is safe to ship in
 * the client bundle by design (every table it can touch is protected by
 * real Row Level Security policies on the Supabase side, e.g.
 * supabase/migrations/0001_profiles.sql in the website repo) — never put
 * the service role key here or in any client-side code.
 *
 * AsyncStorage is the session-persistence adapter (RN has no localStorage);
 * without it a session wouldn't survive an app restart. detectSessionInUrl
 * is off because that's a web-only concern (parsing tokens out of the
 * *browser's own* location bar) — this app's OAuth redirect instead comes
 * back through a deep link (studiummobile://auth-callback), handled
 * manually in features/auth/store.ts's signInWithGoogle.
 *
 * flowType: 'pkce' — Supabase's own recommended flow for native apps.
 * Google's authorization step returns a single-use `code` in the redirect
 * URL instead of raw access/refresh tokens sitting in it, which
 * exchangeCodeForSession then swaps for a real session — safer than the
 * implicit flow's tokens-in-a-URL for a mobile deep link.
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY — check .env.local.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});
