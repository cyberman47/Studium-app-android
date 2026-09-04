import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getPlannerHomeSnapshot, PlannerHomeSnapshot } from '@/lib/studyPlanner';

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
  // Identity/progress fields (name, avatar, streak, total KP, level, path,
  // leaderboard's top row) are real once this resolves — see remote.ts for
  // exactly which fields and why. Days-to-exam and the KP-goal chip are
  // also real now (see plannerSnapshot below), sourced from the Study
  // Planner instead of Supabase. Everything else on this screen (Continue
  // Studying, Daily Case, Recommended, exam readiness/mastery %, study
  // time) still has no real per-user backend yet, so it stays mock.
  // Falls back to the mock identity fields while the fetch is in flight
  // right after login, rather than a blank/zeroed header.
  const { loading, stats } = useRealDashboardStats();

  // Real "days to exam" / plan-KP chips, sourced from the student's own
  // real generated Study Planner plan (lib/studyPlanner.ts) rather than
  // the static mock that used to sit here regardless of account — see
  // getPlannerHomeSnapshot's own comment for why "KP" means "tasks done
  // in this week's real plan" rather than the separate (still-mock)
  // daily-streak KP system. Re-read on every focus, not just mount, so
  // generating a new plan or checking off a task on the Study Planner
  // screen is reflected the moment the student comes back to Home.
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
        daysToExam: plannerSnapshot ? plannerSnapshot.daysToExam : mockDashboard.daysToExam,
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
    : plannerSnapshot
      ? { ...mockDashboard, daysToExam: plannerSnapshot.daysToExam }
      : mockDashboard;
  // Deliberately NOT the same numbers as StatsRow's Plan KP chip below —
  // AppHeader's streak pill is real-when-available daily-streak KP (see
  // remote.ts: todayKP always 0 today, no real per-day backend exists
  // yet), a genuinely different fact from "tasks done in this week's
  // Study Planner plan." Feeding plannerSnapshot's numbers into the
  // streak pill would make it claim a daily streak was secured by
  // checking off plan tasks, which isn't true.
  const goToProgress = () => router.push('/progress');
  const goToStudyPlanner = () => router.push('/study-planner');
  const streakSecured = data.todayKP >= data.targetKP;
  const planKpEarned = plannerSnapshot ? plannerSnapshot.planKpEarned : mockDashboard.todayKP;
  const planKpTarget = plannerSnapshot ? plannerSnapshot.planKpTarget : mockDashboard.targetKP;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <AppHeader
        streakDays={data.streakDays}
        todayKP={data.todayKP}
        targetKP={data.targetKP}
        loading={loading}
        onPressStreak={goToProgress}
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
            planKpEarned={planKpEarned}
            planKpTarget={planKpTarget}
            studyTimeToday={data.studyTimeToday}
            onViewPlan={goToStudyPlanner}
          />

          <DailyCaseCard />

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
            onViewPlan={goToStudyPlanner}
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
