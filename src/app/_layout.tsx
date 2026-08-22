import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

// A root Stack wrapping the (tabs) group (the 5-tab NativeTabs bar) so
// screens that live outside the bottom nav — Settings, Passport, Forum,
// Challenges, Study Groups, Contribute, all reached via router.push from
// Profile — have somewhere to push onto. NativeTabs alone (the previous
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
      </Stack>
    </ThemeProvider>
  );
}
