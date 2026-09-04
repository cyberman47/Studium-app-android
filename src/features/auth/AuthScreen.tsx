import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { WEBSITE_URL } from '@/lib/config';

import { fetchOnboardingComplete, signIn, signInWithGoogle, signUp } from './store';

// Real, deployed pages — the same Terms/Privacy the web app's own signup
// form links to (app/signup/page.tsx), opened in an in-app browser tab
// rather than a native Link since there's no in-app route for them here.

// Real, enforced requirement (checked live, not just on submit) so a
// student sees why the field is invalid before they hit Create account —
// same "surface it as you type" treatment the web signup form gives its
// password checklist. Letters, numbers, and underscores only: keeps a
// username safe to show elsewhere in the app (leaderboard, forum,
// community posts) without needing to sanitize it again at render time.
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

type Mode = 'signup' | 'login';

// The actual signup/login form, reached from WelcomeScreen's "Get Started"
// (mode=signup) or "I already have an account" (mode=login) — unlike that
// screen, this one keeps its back button, since you genuinely can return to
// the welcome screen from here. One screen, two modes toggled by the link
// at the bottom rather than two separate routes, since they share every
// field and only differ in heading/CTA copy. Real Supabase auth (features/
// auth/store.ts) — the same project studium-website uses — so an account
// created here is a genuine account there too.
//
// submit() decides Home vs Onboarding itself and navigates straight there
// — it used to always go to '/' and rely on the app-launch gate's own
// reactive listener to correct a fresh signup over to Onboarding a moment
// later, which was visible as a real flash of the dashboard for a split
// second first. A signup is always onboarding_complete=false (the
// profiles trigger defaults it, so there's nothing to check), and a login
// checks the real value directly before moving, so the correct screen is
// the first and only thing that ever renders.
export function AuthScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { mode: initialMode } = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<Mode>(initialMode === 'login' ? 'login' : 'signup');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Separate from `submitting` — Google's flow leaves this screen entirely
  // (the in-app browser tab) and comes back, so it needs its own loading
  // state rather than sharing the email/password form's.
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  // True once Supabase has actually sent a confirmation email and is
  // waiting on a click before issuing a session — real project setting
  // (this Supabase project requires email confirmation by default), not a
  // fabricated step. Mirrors the web app's own signup flow
  // (app/signup/page.tsx's awaitingConfirmation) since it's the same
  // project and the same setting.
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const isSignup = mode === 'signup';

  async function submit() {
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    if (!trimmedEmail || !password || (isSignup && !trimmedUsername)) {
      setError(isSignup ? 'Username, email, and password are required.' : 'Email and password are required.');
      return;
    }
    if (isSignup && !USERNAME_PATTERN.test(trimmedUsername)) {
      setError('Username must be 3–20 characters — letters, numbers, and underscores only.');
      return;
    }
    if (isSignup && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (isSignup && !agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      if (isSignup) {
        const { awaitingConfirmation: needsConfirmation } = await signUp(trimmedEmail, password, trimmedUsername);
        if (needsConfirmation) {
          setAwaitingConfirmation(true);
          return;
        }
        // A brand-new account is always onboarding_complete=false — no
        // need to ask, and asking would just be a slower way to arrive at
        // the same place.
        router.replace('/onboarding');
      } else {
        const { userId } = await signIn(trimmedEmail, password);
        const onboardingComplete = await fetchOnboardingComplete(userId);
        router.replace(onboardingComplete ? '/' : '/onboarding');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Doesn't navigate itself on success — signInWithGoogle's own doc comment
  // covers why: the auth-state listener every sign-in path already shares
  // (features/auth/store.ts) picks up the new session and the launch gate
  // (app/_layout.tsx's AuthGate) carries it from there, same as it would
  // for a page reload mid-session. This only needs to handle its own
  // loading state and surface a real failure (cancellation, or Google not
  // enabled for this project yet) if one happens.
  async function handleGoogleSignIn() {
    setError('');
    setGoogleSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setGoogleSubmitting(false);
    }
  }

  if (awaitingConfirmation) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={styles.inner}>
          <ScreenHeader title="Sign Up" />
          <View style={styles.header}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
              <Ionicons name="mail-outline" size={26} color={theme.primary} />
            </View>
            <ThemedText style={styles.title}>Check your inbox</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              We sent a confirmation link to {email.trim()}. Tap it to finish creating your account, then come back
              and log in.
            </ThemedText>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <ScreenHeader title={isSignup ? 'Sign Up' : 'Log In'} />

            <View style={styles.header}>
              <Image
                source={require('@/assets/images/studium-logo-full.png')}
                style={styles.logo}
                contentFit="contain"
                accessible
                accessibilityLabel="Studium"
              />
              <ThemedText style={styles.title}>{isSignup ? 'Create your Studium account' : 'Welcome back'}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                {isSignup ? 'Your personalized medical learning journey starts here.' : 'Log in to pick up right where you left off.'}
              </ThemedText>
            </View>

            <View style={[styles.cardShadow, Shadow.card]}>
              <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                {isSignup && (
                  <View style={styles.field}>
                    <ThemedText themeColor="textSecondary" style={styles.label}>
                      Username
                    </ThemedText>
                    <TextInput
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Pick a username"
                      placeholderTextColor={theme.textSecondary}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="username-new"
                      style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                    />
                  </View>
                )}

                <View style={styles.field}>
                  <ThemedText themeColor="textSecondary" style={styles.label}>
                    Email
                  </ThemedText>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor={theme.textSecondary}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  />
                </View>

                <View style={styles.field}>
                  <ThemedText themeColor="textSecondary" style={styles.label}>
                    Password
                  </ThemedText>
                  <View style={styles.passwordRow}>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder={isSignup ? 'Create a password' : 'Your password'}
                      placeholderTextColor={theme.textSecondary}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                      autoComplete={isSignup ? 'new-password' : 'current-password'}
                      style={[styles.input, styles.passwordInput, { color: theme.text, borderColor: theme.border }]}
                    />
                    <Pressable
                      onPress={() => setPasswordVisible(v => !v)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                      style={styles.eyeButton}>
                      <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={19} color={theme.textSecondary} />
                    </Pressable>
                  </View>
                </View>

                {isSignup && (
                  <Pressable
                    onPress={() => setAgreed(a => !a)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: agreed }}
                    accessibilityLabel="Agree to the Terms of Service and Privacy Policy"
                    style={styles.termsRow}>
                    <View
                      style={[
                        styles.checkbox,
                        { borderColor: agreed ? theme.accent : theme.border },
                        agreed && { backgroundColor: theme.accent },
                      ]}>
                      {agreed && <Ionicons name="checkmark" size={13} color={theme.white} />}
                    </View>
                    <ThemedText themeColor="textSecondary" style={styles.termsText}>
                      I agree to the{' '}
                      <ThemedText
                        themeColor="primary"
                        style={styles.termsLink}
                        onPress={() => openBrowserAsync(`${WEBSITE_URL}/terms`, { presentationStyle: WebBrowserPresentationStyle.AUTOMATIC })}>
                        Terms of Service
                      </ThemedText>{' '}
                      and{' '}
                      <ThemedText
                        themeColor="primary"
                        style={styles.termsLink}
                        onPress={() => openBrowserAsync(`${WEBSITE_URL}/privacy`, { presentationStyle: WebBrowserPresentationStyle.AUTOMATIC })}>
                        Privacy Policy
                      </ThemedText>
                    </ThemedText>
                  </Pressable>
                )}

                {error && <ThemedText themeColor="rose" style={styles.error}>{error}</ThemedText>}

                <Pressable
                  onPress={submit}
                  disabled={submitting}
                  accessibilityRole="button"
                  accessibilityLabel={isSignup ? 'Create account' : 'Log in'}
                  style={({ pressed }) => [
                    styles.submitButton,
                    { backgroundColor: theme.primary },
                    pressed && !submitting && styles.submitButtonPressed,
                    submitting && styles.submitButtonDisabled,
                  ]}>
                  <ThemedText style={styles.submitButtonText}>
                    {submitting ? (isSignup ? 'Creating account…' : 'Logging in…') : isSignup ? 'Create account' : 'Log in'}
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            {isSignup && (
              <>
                <View style={styles.dividerRow}>
                  <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                  <ThemedText themeColor="textSecondary" style={styles.dividerText}>
                    or
                  </ThemedText>
                  <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                </View>

                <Pressable
                  onPress={handleGoogleSignIn}
                  disabled={googleSubmitting}
                  accessibilityRole="button"
                  accessibilityLabel="Sign up with Google"
                  style={({ pressed }) => [
                    styles.googleButton,
                    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                    pressed && !googleSubmitting && styles.submitButtonPressed,
                    googleSubmitting && styles.submitButtonDisabled,
                  ]}>
                  <Ionicons name="logo-google" size={18} color={theme.text} />
                  <ThemedText style={styles.googleButtonText}>
                    {googleSubmitting ? 'Opening Google…' : 'Sign up with Google'}
                  </ThemedText>
                </Pressable>
              </>
            )}

            <Pressable
              onPress={() => {
                setError('');
                setMode(m => (m === 'signup' ? 'login' : 'signup'));
              }}
              accessibilityRole="button"
              style={styles.switchModeRow}>
              <ThemedText themeColor="textSecondary" style={styles.switchModeText}>
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <ThemedText themeColor="primary" style={styles.switchModeLink}>
                  {isSignup ? 'Log in' : 'Sign up'}
                </ThemedText>
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: Spacing.six,
  },
  inner: {
    width: '100%',
    maxWidth: 440,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.four,
  },
  header: {
    alignItems: 'center',
    gap: 6,
  },
  logo: {
    height: 32,
    aspectRatio: 779 / 303,
    marginBottom: Spacing.one,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 300,
  },
  cardShadow: {
    width: '100%',
    borderRadius: Radius.xl,
  },
  card: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
  input: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  passwordRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: 44,
    justifyContent: 'center',
  },
  error: {
    fontSize: 12,
    fontWeight: '700',
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    paddingVertical: 14,
    minHeight: 48,
    marginTop: 4,
  },
  submitButtonPressed: {
    opacity: 0.88,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  switchModeRow: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  switchModeText: {
    fontSize: 13,
  },
  switchModeLink: {
    fontSize: 13,
    fontWeight: '800',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  termsText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  termsLink: {
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  googleButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    minHeight: 48,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
