import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ContinueCard } from './components/ContinueCard';
import { DailyCaseCard } from './components/DailyCaseCard';
import { GreetingHeader } from './components/GreetingHeader';
import { LeaderboardCard } from './components/LeaderboardCard';
import { PerformanceCard } from './components/PerformanceCard';
import { ProgressReadinessCard } from './components/ProgressReadinessCard';
import { QuickAccess } from './components/QuickAccess';
import { RecommendedTodayCard } from './components/RecommendedTodayCard';
import { mockDashboard } from './data';

// A single-column stack, ordered by "what should I do right now": Continue
// Studying first (the one thing that matters most), then today's study
// plan progress, then the Daily Case, then a one-line leaderboard glance.
// Secondary material (a specific recommendation, the fuller performance
// summary) sits further down, still reachable but not competing for
// attention with the primary flow above it.
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
          <GreetingHeader name={data.name} pathLabel={data.pathLabel} pathEmoji={data.pathEmoji} />

          <ContinueCard
            subject={data.nextLesson.subject}
            title={data.nextLesson.title}
            completedCount={data.nextLesson.completedCount}
            total={data.nextLesson.total}
          />

          <ProgressReadinessCard
            daysToExam={data.daysToExam}
            todayKP={data.todayKP}
            targetKP={data.targetKP}
          />

          <DailyCaseCard
            title={data.dailyCase.title}
            category={data.dailyCase.category}
            difficulty={data.dailyCase.difficulty}
          />

          <LeaderboardCard rows={data.leaderboard} minimal />

          <RecommendedTodayCard
            subjectName={data.recommended.subjectName}
            label={data.recommended.label}
            kp={data.recommended.kp}
            minutes={data.recommended.minutes}
          />

          <PerformanceCard
            level={data.level}
            levelName={data.levelName}
            totalKP={data.totalKP}
            focusAreas={data.focusAreas}
          />

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
});
