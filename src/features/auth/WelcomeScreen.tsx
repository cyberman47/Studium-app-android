import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The actual first thing anyone sees when they open the app (see the
// launch-time gate in app/_layout.tsx: an unauthenticated session lands
// here, not on Home) — and also where Log Out (More > Account) returns to.
// Deliberately no back button/header: there's nothing behind this screen to
// go back to. "Get Started" and "I already have an account" both push into
// AuthScreen (features/auth/AuthScreen.tsx) — the one real form — in
// signup vs login mode; that screen keeps its own back button since you
// genuinely can return here from it.
export function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.inner}>
        <View style={styles.top}>
          <Image
            source={require('@/assets/images/studium-logo-full.png')}
            style={styles.logo}
            contentFit="contain"
            accessible
            accessibilityLabel="Studium"
          />
        </View>

        <View style={styles.center}>
          <View style={[styles.glow, { backgroundColor: theme.primaryMuted }]} />
          <ThemedText style={styles.tagline}>Medical learning, accessible to everyone.</ThemedText>
        </View>

        <View style={styles.bottom}>
          <Pressable
            onPress={() => router.push({ pathname: '/auth', params: { mode: 'signup' } })}
            accessibilityRole="button"
            accessibilityLabel="Get Started"
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: theme.primary },
              pressed && styles.primaryButtonPressed,
            ]}>
            <ThemedText style={styles.primaryButtonText}>Get Started</ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.push({ pathname: '/auth', params: { mode: 'login' } })}
            accessibilityRole="button"
            accessibilityLabel="I already have an account"
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}>
            <ThemedText themeColor="textSecondary" style={styles.secondaryButtonText}>
              I already have an account
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.four,
  },
  top: {
    alignItems: 'center',
    paddingTop: Spacing.three,
  },
  logo: {
    height: 34,
    aspectRatio: 779 / 303,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.6,
  },
  tagline: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  bottom: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    paddingVertical: 16,
    minHeight: 52,
  },
  primaryButtonPressed: {
    opacity: 0.88,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    minHeight: 44,
  },
  secondaryButtonPressed: {
    opacity: 0.6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
