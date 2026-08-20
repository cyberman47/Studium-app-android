import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { StudyingPathsSection } from './components/StudyingPathsSection';

// The mobile equivalent of the web app's Learning Paths page
// (app/dashboard/(main)/learning-paths/page.tsx) — starts with just the
// "Browse Paths" grid; a "Continue" card for whichever track has real
// per-lesson progress (MCAT → Biology on the web) is the natural next
// addition here once the mobile app reads real lesson content.
export function StudyScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Study</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              A guided route through what to study next.
            </ThemedText>
          </View>

          <StudyingPathsSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: BottomTabInset + Spacing.five,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 12,
  },
  header: {
    gap: 2,
    marginBottom: 2,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 29,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
});
