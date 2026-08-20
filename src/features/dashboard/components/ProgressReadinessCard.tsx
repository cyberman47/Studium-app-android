import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { WeeklyActivityDay } from '../data';

import { Card } from './Card';

function StatTile({ value, label }: { value: string; label: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.tile, { backgroundColor: theme.backgroundSelected }]}>
      <ThemedText style={styles.tileValue}>{value}</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.tileLabel}>
        {label}
      </ThemedText>
    </View>
  );
}

// Matches the web's real Study Planner card content exactly: days to
// exam + secured/kp-to-go pill, Today's Goal and Exam Readiness as
// progress bars, then a compact 2x2 stat grid (study time today/this
// week, overall mastery, weekly KP) and the 7-day activity chart.
export function ProgressReadinessCard({
  daysToExam,
  todayKP,
  targetKP,
  examReadinessPercent,
  overallMasteryPercent,
  studyTimeToday,
  studyTimeThisWeek,
  weeklyKP,
  weeklyActivity,
}: {
  daysToExam: number;
  todayKP: number;
  targetKP: number;
  examReadinessPercent: number;
  overallMasteryPercent: number;
  studyTimeToday: string;
  studyTimeThisWeek: string;
  weeklyKP: { earned: number; target: number };
  weeklyActivity: WeeklyActivityDay[];
}) {
  const theme = useTheme();
  const maxKP = Math.max(1, ...weeklyActivity.map((d) => d.kp));
  const secured = todayKP >= targetKP;
  const todayPercent = Math.min(100, Math.round((todayKP / targetKP) * 100));

  return (
    <Card style={{ padding: Spacing.three }}>
      <ThemedText themeColor="primary" style={styles.eyebrow}>
        📅 Study Planner
      </ThemedText>

      <View style={styles.examRow}>
        <Ionicons name="flag" size={12} color={theme.primary} />
        <ThemedText style={styles.examText}>{daysToExam} days to exam</ThemedText>
      </View>
      <View
        style={[
          styles.securedPill,
          { backgroundColor: secured ? theme.primaryMuted : theme.amberMuted },
        ]}>
        <ThemedText style={[styles.securedText, { color: secured ? theme.primary : theme.amber }]}>
          {secured ? 'Streak secured' : `${targetKP - todayKP} KP to go`}
        </ThemedText>
      </View>

      <View style={styles.bars}>
        <View>
          <View style={styles.barHeader}>
            <ThemedText themeColor="textSecondary" style={styles.barLabel}>
              Today&apos;s Goal
            </ThemedText>
            <ThemedText style={styles.barValue}>
              {todayKP}/{targetKP} KP
            </ThemedText>
          </View>
          <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
            <View
              style={[
                styles.fill,
                { width: `${todayPercent}%`, backgroundColor: secured ? theme.primary : theme.amber },
              ]}
            />
          </View>
        </View>
        <View>
          <View style={styles.barHeader}>
            <ThemedText themeColor="textSecondary" style={styles.barLabel}>
              Exam Readiness
            </ThemedText>
            <ThemedText style={styles.barValue}>{examReadinessPercent}%</ThemedText>
          </View>
          <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
            <View style={[styles.fill, { width: `${examReadinessPercent}%`, backgroundColor: theme.accent }]} />
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        <StatTile value={studyTimeToday} label="Today" />
        <StatTile value={studyTimeThisWeek} label="This Week" />
        <StatTile value={`${overallMasteryPercent}%`} label="Mastery" />
        <StatTile value={`${weeklyKP.earned}/${weeklyKP.target}`} label="Weekly KP" />
      </View>

      <View style={styles.chartSection}>
        <ThemedText themeColor="textSecondary" style={styles.chartLabel}>
          This Week
        </ThemedText>
        <View style={styles.chartRow}>
          {weeklyActivity.map((day, i) => (
            <View key={i} style={styles.dayCol}>
              <View style={[styles.barTrack, { backgroundColor: theme.backgroundSelected }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${Math.max(8, Math.round((day.kp / maxKP) * 100))}%`,
                      backgroundColor: day.isToday ? theme.primary : theme.primaryMuted,
                    },
                  ]}
                />
              </View>
              <ThemedText
                themeColor={day.isToday ? 'text' : 'textSecondary'}
                style={[styles.dayLabel, day.isToday && styles.dayLabelToday]}>
                {day.label}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
  },
  examRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: Spacing.two + 2,
  },
  examText: {
    fontSize: 12,
    fontWeight: '800',
  },
  securedPill: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    marginTop: 6,
  },
  securedText: {
    fontSize: 10,
    fontWeight: '800',
  },
  bars: {
    marginTop: Spacing.three,
    gap: Spacing.two + 2,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  barValue: {
    fontSize: 11,
    fontWeight: '800',
  },
  track: {
    height: 6,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    marginTop: 4,
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  tile: {
    width: '48%',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  tileValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  tileLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  chartSection: {
    marginTop: Spacing.three,
  },
  chartLabel: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: Spacing.two,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 40,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: '100%',
    height: 26,
    borderRadius: 3,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 3,
  },
  dayLabel: {
    fontSize: 8,
    fontWeight: '700',
  },
  dayLabelToday: {
    fontWeight: '800',
  },
});
