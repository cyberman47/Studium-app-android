import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { StudyingPathsSection } from './components/StudyingPathsSection';

// The mobile equivalent of the web app's Learning Paths page
// (app/dashboard/(main)/learning-paths/page.tsx) — starts with just the
// "Browse Paths" grid; a "Continue" card for whichever track has real
// per-lesson progress (MCAT → Biology on the web) is the natural next
// addition here once the mobile app reads real lesson content. Every
// card is a real, working button now — it opens that track's detail
// screen (app/track/[id].tsx).
//
// A plain pushed screen (/study-paths) now, not a bottom tab — reached
// from the Learn tab's "Learning Paths" section — so it uses the same
// ScreenHeader back-button every other pushed screen does instead of the
// bare title a tab screen doesn't need a way back from.
export function StudyScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Study Paths" />
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            A guided route through what to study next.
          </ThemedText>

          <StudyingPathsSection onPressTrack={(id) => router.push(`/track/${id}`)} />
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
    paddingBottom: Spacing.six,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 12,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
});
