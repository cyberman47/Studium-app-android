import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ContinueCard } from './components/ContinueCard';
import { DailyCaseCard } from './components/DailyCaseCard';
import { GreetingHeader } from './components/GreetingHeader';
import { LeaderboardCard } from './components/LeaderboardCard';
import { PathChip } from './components/PathChip';
import { PerformanceCard } from './components/PerformanceCard';
import { ProgressReadinessCard } from './components/ProgressReadinessCard';
import { QuickAccess } from './components/QuickAccess';
import { RecommendedTodayCard } from './components/RecommendedTodayCard';
import { mockDashboard } from './data';

// The phone-oriented equivalent of the web app's /dashboard home page —
// matches its real two-column mid-page arrangement (Study Planner +
// Recommended for Today on the left, Daily Case + Leaderboard +
// Performance on the right) rather than one long single-column stack,
// with Continue Studying as a full-width hero above it and Quick Access
// as a full-width row below. Every section is a single component in
// ./components, so swapping mockDashboard for a real data hook later
// only touches this file, not the sections themselves.
export function DashboardScreen() {
  const theme = useTheme();
  const data = mockDashboard;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <AppHeader
        name={data.name}
        avatarInitial={data.avatarInitial}
        streakDays={data.streakDays}
        todayKP={data.todayKP}
        targetKP={data.targetKP}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.headerSection}>
            <PathChip label={data.pathLabel} emoji={data.pathEmoji} />
            <GreetingHeader name={data.name} pathLabel={data.pathLabel} pathEmoji={data.pathEmoji} />
          </View>

          <ContinueCard
            subject={data.nextLesson.subject}
            title={data.nextLesson.title}
            completedCount={data.nextLesson.completedCount}
            total={data.nextLesson.total}
          />

          <View style={styles.columns}>
            <View style={styles.column}>
              <ProgressReadinessCard
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

              <RecommendedTodayCard
                subjectName={data.recommended.subjectName}
                label={data.recommended.label}
                kp={data.recommended.kp}
                minutes={data.recommended.minutes}
              />
            </View>

            <View style={styles.column}>
              <DailyCaseCard
                title={data.dailyCase.title}
                category={data.dailyCase.category}
                difficulty={data.dailyCase.difficulty}
              />

              <LeaderboardCard rows={data.leaderboard} compact />

              <PerformanceCard
                level={data.level}
                levelName={data.levelName}
                totalKP={data.totalKP}
                focusAreas={data.focusAreas.slice(0, 1)}
              />
            </View>
          </View>

          <QuickAccess />
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
    gap: Spacing.four,
  },
  // Tighter than the standard section gap above — the path chip and
  // greeting read as one header block, not two separate sections.
  headerSection: {
    gap: Spacing.two,
  },
  columns: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  column: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.three,
  },
});
