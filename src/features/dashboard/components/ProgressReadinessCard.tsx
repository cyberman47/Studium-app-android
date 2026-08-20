import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Card } from './Card';

// Not rendered on Home anymore — DashboardScreen uses the much smaller
// StatsRow chips instead, with a "View study plan" link that should
// eventually route here. Kept as the fuller destination component for
// that future dedicated study plan screen rather than deleted.
export function ProgressReadinessCard({
  daysToExam,
  todayKP,
  targetKP,
  onViewPlan,
}: {
  daysToExam: number;
  todayKP: number;
  targetKP: number;
  onViewPlan?: () => void;
}) {
  const theme = useTheme();
  const secured = todayKP >= targetKP;
  const todayPercent = Math.min(100, Math.round((todayKP / targetKP) * 100));

  return (
    <Card>
      <ThemedText themeColor="primary" style={styles.eyebrow}>
        Study Plan
      </ThemedText>

      <ThemedText style={styles.days}>{daysToExam} days</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.until}>
        until your MCAT
      </ThemedText>

      <View style={styles.goalRow}>
        <ThemedText themeColor="textSecondary" style={styles.goalLabel}>
          {todayKP}/{targetKP} KP today
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

      <Pressable
        onPress={onViewPlan}
        accessibilityRole="button"
        accessibilityLabel="View study plan"
        hitSlop={8}
        style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}>
        <ThemedText themeColor="primary" style={styles.linkText}>
          View study plan
        </ThemedText>
        <Ionicons name="arrow-forward" size={13} color={theme.primary} />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  days: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
  },
  until: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  goalRow: {
    marginTop: 12,
  },
  goalLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  track: {
    height: 5,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    marginTop: 6,
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: 12,
    minHeight: 40,
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
