import { useRouter } from 'expo-router';
import { useState } from 'react';
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
import { ImportSheet } from './components/ImportSheet';
import { QuickAccess } from './components/QuickAccess';
import { StatsRow } from './components/StatsRow';
import { DashboardData, mockDashboard } from './data';
import { useRealDashboardStats } from './remote';

// Composition, top to bottom, deliberately alternates visual weight so no
// two sections in a row read the same: a bold gradient hero (Continue
// Studying), then a light chip row (stats) with a plain text link, then
// another bold dark card (Daily Case — the one deliberate exception that
// stays card-like), then one grouped white list standing in for what used
// to be three separate full-height cards, then the quick-access shelf.
// The Studying Paths grid lives on the Study tab (features/study), not
// here — Home stays focused on "what to do right now".
export function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  // Identity/progress fields (name, avatar, streak, KP, level, path,
  // leaderboard's top row) are real once this resolves — see remote.ts for
  // exactly which fields and why. Everything else on this screen (Continue
  // Studying, Daily Case, Recommended, exam readiness/mastery %, days to
  // exam) has no real per-user backend yet, so it stays mock regardless.
  // Falls back to the mock identity fields while the fetch is in flight
  // right after login, rather than a blank/zeroed header.
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
  const [importSheetVisible, setImportSheetVisible] = useState(false);

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
          />

          <StatsRow
            daysToExam={data.daysToExam}
            todayKP={data.todayKP}
            targetKP={data.targetKP}
            onViewPlan={goToProgress}
          />

          <DailyCaseCard dailyCase={data.dailyCase} />

          <HomeListSection
            topLeaderboardRow={data.leaderboard[0]}
            recommended={data.recommended}
            performance={{ level: data.level, levelName: data.levelName, totalKP: data.totalKP }}
            loading={loading}
            onPressLeaderboard={() => router.push('/leaderboard')}
            onPressPerformance={goToProgress}
          />

          <QuickAccess />
        </View>
      </ScrollView>

      <HomeFabs onPressImport={() => setImportSheetVisible(true)} onPressAI={() => router.push('/ai-chat')} />

      <ImportSheet
        visible={importSheetVisible}
        onClose={() => setImportSheetVisible(false)}
        onSelectNote={() => {
          setImportSheetVisible(false);
          router.push('/new-note');
        }}
        onSelectFlashcards={() => {
          setImportSheetVisible(false);
          router.push('/new-flashcards');
        }}
      />
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
    // HomeFabs — so QuickAccess (the last section) doesn't end up hidden
    // behind them when scrolled all the way down.
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
