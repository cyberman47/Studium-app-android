import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

// A root Stack wrapping the (tabs) group (the 5-tab NativeTabs bar) so
// screens that live outside the bottom nav — Settings, Passport, Forum,
// Challenges, Study Groups, Contribute, More and its own children
// (Notifications, Invite, Help, About), Studium AI chat, and the
// note/flashcard creation + My Content screens reached from Home's "+" —
// have somewhere to push onto. NativeTabs alone (the previous
// setup here) has no concept of a screen outside its own declared
// triggers, so router.push('/settings') silently went nowhere before
// this existed. Every pushed screen hides the native header and renders
// its own ScreenHeader (src/components/screen-header.tsx) instead, for
// one consistent back-button style app-wide.
export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
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
      </Stack>
    </ThemeProvider>
  );
}
