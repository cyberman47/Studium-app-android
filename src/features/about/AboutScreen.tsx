import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const websiteUrl = 'https://studium-website-three.vercel.app';

export function AboutScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.inner}>
        <ScreenHeader title="About Studium" />

        <View style={styles.center}>
          <Image
            source={require('@/assets/images/studium-logo-full.png')}
            style={styles.logo}
            contentFit="contain"
            accessible
            accessibilityLabel="Studium"
          />
          <ThemedText themeColor="textSecondary" style={styles.tagline}>
            Real progress tracking for medical, nursing, and pre-health students.
          </ThemedText>

          <View style={styles.versionRow}>
            <ThemedText themeColor="textSecondary" style={styles.versionLabel}>
              Version
            </ThemedText>
            <ThemedText style={styles.versionValue}>1.0.0</ThemedText>
          </View>

          <Pressable
            onPress={() => Linking.openURL(websiteUrl)}
            accessibilityRole="button"
            accessibilityLabel="Visit the Studium website"
            style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]}>
            <Ionicons name="globe-outline" size={16} color={theme.primary} />
            <ThemedText themeColor="primary" style={styles.linkText}>
              studium-website-three.vercel.app
            </ThemedText>
            <Ionicons name="open-outline" size={14} color={theme.primary} />
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
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  logo: {
    height: 32,
    aspectRatio: 779 / 303,
    marginBottom: Spacing.two,
  },
  tagline: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 280,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.four,
  },
  versionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  versionValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.three,
  },
  linkRowPressed: {
    opacity: 0.7,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
