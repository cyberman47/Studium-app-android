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
import { RecommendedTodayCard } from './components/RecommendedTodayCard';
import { mockDashboard } from './data';

// The phone-oriented equivalent of the web app's /dashboard home page:
// same real sections (header, path switcher, Continue Studying, Daily
// Case, Recommended for Today, Progress & Readiness, Leaderboard,
// Performance), reflowed into one vertical scroll instead of the web's
// two-column layout, since a phone screen only ever has room for one
// column. Every section is a single component in ./components, so swapping
// mockDashboard for a real data hook later only touches this file, not
// the sections themselves.
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
            <GreetingHeader name={data.name} />
          </View>

          <ContinueCard
            subject={data.nextLesson.subject}
            title={data.nextLesson.title}
            completedCount={data.nextLesson.completedCount}
            total={data.nextLesson.total}
          />

          <DailyCaseCard
            title={data.dailyCase.title}
            category={data.dailyCase.category}
            difficulty={data.dailyCase.difficulty}
          />

          <RecommendedTodayCard
            subjectName={data.recommended.subjectName}
            label={data.recommended.label}
            kp={data.recommended.kp}
            minutes={data.recommended.minutes}
          />

          <ProgressReadinessCard
            examReadinessPercent={data.examReadinessPercent}
            overallMasteryPercent={data.overallMasteryPercent}
            studyTimeToday={data.studyTimeToday}
            weeklyKP={data.weeklyKP}
            weeklyActivity={data.weeklyActivity}
          />

          <LeaderboardCard rows={data.leaderboard} />

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
    gap: Spacing.four,
  },
  // Tighter than the standard section gap above — the path chip and
  // greeting read as one header block, not two separate sections.
  headerSection: {
    gap: Spacing.two,
  },
});
