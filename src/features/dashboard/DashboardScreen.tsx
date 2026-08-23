import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ContinueCard } from './components/ContinueCard';
import { DailyCaseCard } from './components/DailyCaseCard';
import { GreetingHeader } from './components/GreetingHeader';
import { HomeFabs } from './components/HomeFabs';
import { HomeListSection } from './components/HomeListSection';
import { RecommendedTodayCard } from './components/RecommendedTodayCard';
import { StatsRow } from './components/StatsRow';
import { StudyPlannerCard } from './components/StudyPlannerCard';
import { DashboardData, mockDashboard } from './data';
import { useRealDashboardStats } from './remote';

// "What should I study right now?" — the desktop dashboard's own
// hierarchy, translated: Greeting + path → Continue Studying → Today's
// progress → Daily Case → Recommended for Today → Study Planner →
// Leaderboard/Performance. The old four-tile Quick Access grid
// (Flashcards/Quizzes/Library/Planner) is gone — every one of those now
// has a real home in the Learn or Review tab instead of a redundant
// shortcut row here.
export function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  // Identity/progress fields (name, avatar, streak, KP, level, path,
  // leaderboard's top row) are real once this resolves — see remote.ts for
  // exactly which fields and why. Everything else on this screen (Continue
  // Studying, Daily Case, Recommended, exam readiness/mastery %, days to
  // exam, study time) has no real per-user backend yet, so it stays mock
  // regardless. Falls back to the mock identity fields while the fetch is
  // in flight right after login, rather than a blank/zeroed header.
  const { loading, stats } = useRealDashboardStats();
  const data: DashboardData = stats
    ? {
        ...mockDashboard,
        name: stats.name,
        avatarInitial: stats.avatarInitial,
        pathLabel: stats.pathLabel,
        pathEmoji: stats.pathEmoji,
        streakDays: stats.streakDays,
        totalKP: stats.totalKP,
        todayKP: stats.todayKP,
        level: stats.level,
        levelName: stats.levelName,
        weeklyKP: { earned: stats.weeklyKPEarned, target: mockDashboard.weeklyKP.target },
        leaderboard: stats.topLeaderboardRow
          ? [
              { id: stats.topLeaderboardRow.id, name: stats.topLeaderboardRow.name, totalKP: stats.topLeaderboardRow.totalKP, streak: stats.topLeaderboardRow.streak },
              ...mockDashboard.leaderboard.slice(1),
            ]
          : mockDashboard.leaderboard,
      }
    : mockDashboard;
  const goToProgress = () => router.push('/progress');
  const streakSecured = data.todayKP >= data.targetKP;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <AppHeader
        name={data.name}
        avatarInitial={data.avatarInitial}
        streakDays={data.streakDays}
        todayKP={data.todayKP}
        targetKP={data.targetKP}
        loading={loading}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <GreetingHeader name={data.name} pathLabel={data.pathLabel} pathEmoji={data.pathEmoji} loading={loading} />

          <ContinueCard
            subject={data.nextLesson.subject}
            title={data.nextLesson.title}
            completedCount={data.nextLesson.completedCount}
            total={data.nextLesson.total}
            onPress={() => router.push('/track/mcat')}
          />

          <StatsRow
            daysToExam={data.daysToExam}
            todayKP={data.todayKP}
            targetKP={data.targetKP}
            studyTimeToday={data.studyTimeToday}
            onViewPlan={goToProgress}
          />

          <DailyCaseCard dailyCase={data.dailyCase} />

          <RecommendedTodayCard
            subjectName={data.recommended.subjectName}
            label={data.recommended.label}
            insight={data.recommended.insight}
            kp={data.recommended.kp}
            minutes={data.recommended.minutes}
            onPress={() => router.push('/track/mcat')}
          />

          <StudyPlannerCard
            pathLabel={data.pathLabel}
            daysToExam={data.daysToExam}
            streakSecured={streakSecured}
            onViewPlan={goToProgress}
          />

          <HomeListSection
            topLeaderboardRow={data.leaderboard[0]}
            performance={{ level: data.level, levelName: data.levelName, totalKP: data.totalKP }}
            loading={loading}
            onPressLeaderboard={() => router.push('/leaderboard')}
            onPressPerformance={goToProgress}
          />
        </View>
      </ScrollView>

      <HomeFabs onPressCreate={() => router.push('/create')} onPressAI={() => router.push('/ai-chat')} />
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
    // Base tab-bar clearance (matches every other list screen) plus room
    // for the floating + / Ask AI buttons sitting just above it — see
    // HomeFabs — so the last section doesn't end up hidden behind them
    // when scrolled all the way down.
    paddingBottom: BottomTabInset + Spacing.five + 64,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 12,
  },
});
