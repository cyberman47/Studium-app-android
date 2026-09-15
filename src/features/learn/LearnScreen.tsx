import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CurrentPathBadge } from '@/components/current-path-badge';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { StudyPlannerCard } from '@/features/dashboard/components/StudyPlannerCard';
import { mockDashboard } from '@/features/dashboard/data';
import { useRealDashboardStats } from '@/features/dashboard/remote';
import { LibraryPreviewCard } from '@/features/library/components/LibraryPreviewCard';
import { StudyingPathsSection } from '@/features/study/components/StudyingPathsSection';
import { useTheme } from '@/hooks/use-theme';
import { getPlannerHomeSnapshot, PlannerHomeSnapshot } from '@/lib/studyPlanner';

// "What am I learning?" — the mobile equivalent of the desktop's STUDY
// group (Courses + Study Planner), plus Library, which moved here from
// its own bottom tab. Courses is the real StudyingPathsSection grid
// embedded directly (not a teaser — it's already the actual
// functionality, same component /study-paths uses), since this screen
// exists specifically to be the hub for it; Study Planner and Library
// stay compact previews that route to their own full screens, so this
// tab doesn't turn into a third copy of either.
export function LearnScreen() {
  const theme = useTheme();
  const router = useRouter();
  // Same real Supabase-backed identity fetch Home uses — path label/
  // emoji are real once it resolves, mock-fallback (matching Home's own
  // fallback) while in flight so this screen never renders with nothing.
  const { loading, stats } = useRealDashboardStats();
  const pathLabel = stats?.pathLabel ?? mockDashboard.pathLabel;
  const pathEmoji = stats?.pathEmoji ?? mockDashboard.pathEmoji;
  const todayKP = stats?.todayKP ?? mockDashboard.todayKP;
  const targetKP = mockDashboard.targetKP;

  // Same real Study Planner snapshot Home's dashboard reads — see
  // features/dashboard/DashboardScreen.tsx's own comment on why this
  // reads on every focus, not just mount.
  const [plannerSnapshot, setPlannerSnapshot] = useState<PlannerHomeSnapshot | null>(null);
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getPlannerHomeSnapshot().then((snapshot) => {
        if (!cancelled) setPlannerSnapshot(snapshot);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );
  const daysToExam = plannerSnapshot ? plannerSnapshot.daysToExam : mockDashboard.daysToExam;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Learn</ThemedText>
            <CurrentPathBadge pathLabel={pathLabel} pathEmoji={pathEmoji} loading={loading} />
          </View>

          {/* StudyingPathsSection renders its own "COURSES" label already,
              so this section skips adding a second one on top. */}
          <StudyingPathsSection onPressTrack={(id) => router.push(`/track/${id}`)} />

          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              STUDY PLANNER
            </ThemedText>
            <StudyPlannerCard
              pathLabel={pathLabel}
              daysToExam={daysToExam}
              streakSecured={todayKP >= targetKP}
              onViewPlan={() => router.push('/study-planner')}
            />
          </View>

          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              LIBRARY
            </ThemedText>
            <LibraryPreviewCard onPress={() => router.push('/library')} />
          </View>
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
    gap: 20,
  },
  header: {
    gap: Spacing.two,
    alignItems: 'flex-start',
    marginBottom: -4,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 29,
    letterSpacing: -0.3,
  },
  section: {
    gap: Spacing.two,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
});
