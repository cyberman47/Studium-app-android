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

// Matches the web's real Study Planner card content (readiness, mastery,
// study time, weekly KP) condensed into the 2x2 grid + 7-day chart shape,
// separate from PerformanceCard below (level/KP/focus areas) — the real
// dashboard shows both as distinct cards, not one merged card.
export function ProgressReadinessCard({
  examReadinessPercent,
  overallMasteryPercent,
  studyTimeToday,
  weeklyKP,
  weeklyActivity,
}: {
  examReadinessPercent: number;
  overallMasteryPercent: number;
  studyTimeToday: string;
  weeklyKP: { earned: number; target: number };
  weeklyActivity: WeeklyActivityDay[];
}) {
  const theme = useTheme();
  const maxKP = Math.max(1, ...weeklyActivity.map((d) => d.kp));

  return (
    <Card>
      <View style={styles.header}>
        <Ionicons name="trending-up" size={13} color={theme.primary} />
        <ThemedText themeColor="textSecondary" style={styles.headerText}>
          PROGRESS & READINESS
        </ThemedText>
      </View>

      <View style={styles.grid}>
        <StatTile value={`${examReadinessPercent}%`} label="Exam Readiness" />
        <StatTile value={`${overallMasteryPercent}%`} label="Overall Mastery" />
        <StatTile value={studyTimeToday} label="Study Time Today" />
        <StatTile value={`${weeklyKP.earned}/${weeklyKP.target}`} label="Weekly KP" />
      </View>

      <View style={styles.chartSection}>
        <ThemedText themeColor="textSecondary" style={styles.chartLabel}>
          This Week&apos;s Activity
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.three,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tile: {
    width: '48%',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  tileValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  tileLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  chartSection: {
    marginTop: Spacing.four,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: Spacing.two,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 60,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: '100%',
    height: 40,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  dayLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  dayLabelToday: {
    fontWeight: '800',
  },
});
