import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { signIn, signUp } from './store';

type Mode = 'signup' | 'login';

// The actual signup/login form, reached from WelcomeScreen's "Get Started"
// (mode=signup) or "I already have an account" (mode=login) — unlike that
// screen, this one keeps its back button, since you genuinely can return to
// the welcome screen from here. One screen, two modes toggled by the link
// at the bottom rather than two separate routes, since they share every
// field and only differ in heading/CTA copy. Real Supabase auth (features/
// auth/store.ts) — the same project studium-website uses — so an account
// created here is a genuine account there too. On success the app-launch
// gate's own listener would eventually pick up the new session, but
// navigating to Home explicitly keeps this button's response immediate.
export function AuthScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { mode: initialMode } = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<Mode>(initialMode === 'login' ? 'login' : 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
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
    if (!trimmedEmail || !password) {
      setError('Email and password are required.');
      return;
    }
    if (isSignup && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      if (isSignup) {
        const { awaitingConfirmation: needsConfirmation } = await signUp(trimmedEmail, password);
        if (needsConfirmation) {
          setAwaitingConfirmation(true);
          return;
        }
      } else {
        await signIn(trimmedEmail, password);
      }
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
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
              <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
                <Ionicons name={isSignup ? 'sparkles' : 'log-in-outline'} size={26} color={theme.primary} />
              </View>
              <ThemedText style={styles.title}>{isSignup ? 'Create your Studium account' : 'Welcome back'}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                {isSignup ? 'Your personalized medical learning journey starts here.' : 'Log in to pick up right where you left off.'}
              </ThemedText>
            </View>

            <View style={[styles.cardShadow, Shadow.card]}>
              <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
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
});
