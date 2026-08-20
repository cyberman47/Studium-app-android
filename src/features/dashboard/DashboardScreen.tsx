import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ContinueCard } from './components/ContinueCard';
import { DailyCaseCard } from './components/DailyCaseCard';
import { GreetingHeader } from './components/GreetingHeader';
import { HomeListSection } from './components/HomeListSection';
import { QuickAccess } from './components/QuickAccess';
import { StatsRow } from './components/StatsRow';
import { mockDashboard } from './data';

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
  const data = mockDashboard;
  const goToProgress = () => router.push('/progress');

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
            onPressPerformance={goToProgress}
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
    gap: 12,
  },
});
