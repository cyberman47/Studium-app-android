import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { BottomTabInset, MaxContentWidth, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getMcatLessons, getMcatSubjects, getQuestionCountsForLessons } from '@/lib/contentBank';
import { lessonCompletion, useQuestionBankProgress } from '@/lib/questionBankProgress';
import { getPlannerHomeSnapshot, PlannerHomeSnapshot } from '@/lib/studyPlanner';

import { ContinueCard } from './components/ContinueCard';
import { DailyCaseCard } from './components/DailyCaseCard';
import { GreetingHeader } from './components/GreetingHeader';
import { HomeFabs } from './components/HomeFabs';
import { HomeListSection } from './components/HomeListSection';
import { RecommendedTodayCard } from './components/RecommendedTodayCard';
import { StatsRow } from './components/StatsRow';
import { DashboardData, mockDashboard } from './data';
import { useRealDashboardStats } from './remote';

// "What should I study right now?" — the desktop dashboard's own
// hierarchy, translated: Greeting + path → Continue Studying → Today's
// progress (whose "View study plan" bar is the only Study Planner entry
// point on this screen now — the separate full Study Planner card lower
// down was redundant with it and was removed) → Daily Case → Recommended
// for Today → Leaderboard/Performance. The old four-tile Quick Access
// grid (Flashcards/Quizzes/Library/Planner) is gone — every one of those
// now has a real home in the Learn or Review tab instead of a redundant
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

  // The real "Continue Studying" lesson — MCAT Biology's first not-yet-
  // finished lesson (see lib/contentBank.ts / questionBankProgress.ts),
  // not the old hardcoded mock. Re-read on every focus, same reason as
  // plannerSnapshot above: finishing a lesson's questions should move
  // this card to the next one the moment the student is back on Home.
  const progress = useQuestionBankProgress();
  const [nextLesson, setNextLesson] = useState<{
    subject: string;
    lessonId: string;
    title: string;
    completedCount: number;
    total: number;
  } | null>(null);
  const [nextLessonError, setNextLessonError] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          const subjects = await getMcatSubjects();
          const biology = subjects.find((s) => s.name === 'Biology') ?? subjects[0];
          if (!biology) return;
          const lessons = await getMcatLessons(biology.id);
          const counts = await getQuestionCountsForLessons('mcat', lessons.map((l) => l.id));
          const completions = lessons.map((l) => lessonCompletion(progress, 'mcat', l.id, counts[l.id] ?? 0));
          const nextIndex = completions.findIndex((c) => !c.done);
          const current = lessons[nextIndex === -1 ? lessons.length - 1 : nextIndex];
          if (!cancelled && current) {
            setNextLesson({
              subject: biology.name,
              lessonId: current.id,
              title: current.title,
              completedCount: completions.filter((c) => c.done).length,
              total: lessons.length,
            });
          }
        } catch {
          if (!cancelled) setNextLessonError(true);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [progress]),
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
  const goToProgress = () => router.push('/progress');
  const goToStudyPlanner = () => router.push('/study-planner');
  // The streak pill specifically gets the animated reveal first (real
  // numbers, just handed off with a beat of ceremony) rather than jumping
  // straight to Progress the way Performance's row still does — see
  // features/progress/StreakRevealScreen.tsx. Both the route prefetch and
  // the real planner fetch fire right here, at the moment of the tap —
  // before the reveal screen even mounts — rather than waiting for that
  // screen's own effect to kick them off, so Progress has the longest
  // possible head start on being ready by the time the reveal hands off
  // to it.
  const goToStreakReveal = () => {
    router.prefetch('/progress');
    getPlannerHomeSnapshot().catch(() => {});
    router.push({
      pathname: '/streak-reveal',
      params: { streakDays: String(data.streakDays), todayKP: String(data.todayKP), targetKP: String(data.targetKP) },
    });
  };
  const planKpEarned = plannerSnapshot ? plannerSnapshot.planKpEarned : mockDashboard.todayKP;
  const planKpTarget = plannerSnapshot ? plannerSnapshot.planKpTarget : mockDashboard.targetKP;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <AppHeader
        streakDays={data.streakDays}
        todayKP={data.todayKP}
        targetKP={data.targetKP}
        loading={loading}
        onPressStreak={goToStreakReveal}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <GreetingHeader name={data.name} pathLabel={data.pathLabel} pathEmoji={data.pathEmoji} loading={loading} />

          {nextLesson ? (
            <ContinueCard
              subject={nextLesson.subject}
              title={nextLesson.title}
              completedCount={nextLesson.completedCount}
              total={nextLesson.total}
              onPress={() =>
                router.push({
                  pathname: '/practice',
                  params: {
                    track: 'mcat',
                    lessonId: nextLesson.lessonId,
                    lessonTitle: nextLesson.title,
                    subjectTitle: nextLesson.subject,
                  },
                })
              }
            />
          ) : nextLessonError ? null : (
            <View style={[styles.continueCardShadow, Shadow.raised]}>
              <View style={[styles.continueCardLoading, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <ActivityIndicator color={theme.primary} />
              </View>
            </View>
          )}

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
  continueCardShadow: {
    borderRadius: Radius.lg,
  },
  continueCardLoading: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 108,
    alignItems: 'center',
    justifyContent: 'center',
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
