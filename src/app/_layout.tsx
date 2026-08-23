import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useAuthState } from '@/features/auth/store';

SplashScreen.preventAutoHideAsync();

// Launch-time auth gate: an unauthenticated session gets bounced to the
// Welcome screen (features/auth/WelcomeScreen.tsx, at /signup) instead of
// landing on Home. Reacts to real Supabase auth state (features/auth/
// store.ts) rather than checking once — status starts 'loading' while a
// persisted session restores from AsyncStorage (async, so it can't be
// known synchronously at mount), and only resolves to 'authenticated' or
// 'unauthenticated' once that finishes; this effect only acts on the
// resolved 'unauthenticated' case; being reactive (not a one-shot check)
// also means it correctly bounces the student out if a session ever gets
// invalidated later during the app's lifetime, not just at launch.
// AnimatedSplashOverlay's ~600ms+ cover window above this gives that
// restore comfortably enough time to resolve before anything's visible.
function AuthGate() {
  const router = useRouter();
  const { status } = useAuthState();

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/signup');
  }, [status, router]);

  return null;
}

// A root Stack wrapping the (tabs) group (the 5-tab NativeTabs bar) so
// screens that live outside the bottom nav — Settings, Passport, Forum,
// Challenges, Study Groups, Contribute, More and its own children
// (Notifications, Invite, Help, About), Studium AI chat, the note/flashcard
// creation + My Content screens reached from Home's "+", and the Welcome/
// Auth screens — have somewhere to push onto. NativeTabs alone (the
// previous setup here) has no concept of a screen outside its own declared
// triggers, so router.push('/settings') silently went nowhere before
// this existed. Every pushed screen hides the native header and renders
// its own ScreenHeader (src/components/screen-header.tsx) instead, for
// one consistent back-button style app-wide.
export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" options={{ presentation: 'card' }} />
        <Stack.Screen name="passport" options={{ presentation: 'card' }} />
        <Stack.Screen name="forum" options={{ presentation: 'card' }} />
        <Stack.Screen name="challenges" options={{ presentation: 'card' }} />
        <Stack.Screen name="study-groups" options={{ presentation: 'card' }} />
        <Stack.Screen name="contribute" options={{ presentation: 'card' }} />
        <Stack.Screen name="track/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="libraryitem/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="more" options={{ presentation: 'card' }} />
        <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
        <Stack.Screen name="invite" options={{ presentation: 'card' }} />
        <Stack.Screen name="help" options={{ presentation: 'card' }} />
        <Stack.Screen name="about" options={{ presentation: 'card' }} />
        <Stack.Screen name="ai-chat" options={{ presentation: 'card' }} />
        <Stack.Screen name="ai-chat-history" options={{ presentation: 'card' }} />
        <Stack.Screen name="ai-chat-settings" options={{ presentation: 'card' }} />
        <Stack.Screen name="ai-settings" options={{ presentation: 'card' }} />
        <Stack.Screen name="new-note" options={{ presentation: 'card' }} />
        <Stack.Screen name="new-flashcards" options={{ presentation: 'card' }} />
        <Stack.Screen name="my-content" options={{ presentation: 'card' }} />
        <Stack.Screen name="signup" options={{ presentation: 'card' }} />
        <Stack.Screen name="auth" options={{ presentation: 'card' }} />
      </Stack>
    </ThemeProvider>
  );
}
