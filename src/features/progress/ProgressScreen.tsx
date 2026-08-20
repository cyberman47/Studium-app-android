import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { PerformanceCard } from './components/PerformanceCard';
import { StudyPlanCard } from './components/StudyPlanCard';
import { mockProgress } from './data';

// Study Plan and Performance used to be headed for two separate tabs
// (Study's placeholder promised a "study planner", Progress's promised a
// "performance breakdown") — they're the same underlying picture of how
// studying is going, so they live together on this one screen instead.
// Both cards are the same full-detail components Home's compact StatsRow
// and grouped-list "Level X" row point to.
export function ProgressScreen() {
  const theme = useTheme();
  const data = mockProgress;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Progress</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Your study plan and performance, together.
            </ThemedText>
          </View>

          <StudyPlanCard
            daysToExam={data.daysToExam}
            todayKP={data.todayKP}
            targetKP={data.targetKP}
            examReadinessPercent={data.examReadinessPercent}
            overallMasteryPercent={data.overallMasteryPercent}
            studyTimeToday={data.studyTimeToday}
            studyTimeThisWeek={data.studyTimeThisWeek}
            weeklyKP={data.weeklyKP}
            weeklyActivity={data.weeklyActivity}
          />

          <PerformanceCard
            level={data.level}
            levelName={data.levelName}
            totalKP={data.totalKP}
            focusAreas={data.focusAreas}
          />
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
