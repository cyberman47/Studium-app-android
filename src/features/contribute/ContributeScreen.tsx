import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The mobile equivalent of the web app's Community Contribute hub
// (app/dashboard/(main)/community/contribute) — a real hub into the
// Create system and Library's publish flow there, neither of which
// exist as mobile screens yet, so this stays an honest placeholder
// rather than a dead link pretending otherwise.
export function ContributeScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.inner}>
        <ScreenHeader title="Contribute" />
        <View style={styles.center}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
            <Ionicons name="sparkles-outline" size={28} color={theme.primary} />
          </View>
          <ThemedText style={styles.title}>Publishing is coming soon</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.description}>
            Publishing your own lessons and study guides for other students to discover will land here
            once Create and Library have mobile screens.
          </ThemedText>
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
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
