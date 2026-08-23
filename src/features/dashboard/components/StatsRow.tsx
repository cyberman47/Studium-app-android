import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Three compact stat chips — days to exam, today's KP (with its progress
// bar), and study time today — instead of the previous two, matching the
// desktop dashboard's own "Today's goal / Exam readiness / Study time
// today" cluster. Deliberately tight typography (11-17pt) so three chips
// fit one row without the section growing taller than the two-chip
// version did.
export function StatsRow({
  daysToExam,
  todayKP,
  targetKP,
  studyTimeToday,
  onViewPlan,
}: {
  daysToExam: number;
  todayKP: number;
  targetKP: number;
  studyTimeToday: string;
  onViewPlan?: () => void;
}) {
  const theme = useTheme();
  const secured = todayKP >= targetKP;
  const todayPercent = Math.min(100, Math.round((todayKP / targetKP) * 100));

  return (
    <View>
      <View style={styles.row}>
        <View style={[styles.chip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText style={styles.chipValue}>{daysToExam}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.chipCaption} numberOfLines={1}>
            Days to exam
          </ThemedText>
        </View>

        <View style={[styles.chip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText style={styles.chipValue}>
            {todayKP}/{targetKP}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.chipCaption} numberOfLines={1}>
            Today's KP
          </ThemedText>
          <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
            <View style={[styles.fill, { width: `${todayPercent}%`, backgroundColor: secured ? theme.primary : theme.amber }]} />
          </View>
        </View>

        <View style={[styles.chip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText style={styles.chipValue}>{studyTimeToday}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.chipCaption} numberOfLines={1}>
            Study time
          </ThemedText>
        </View>
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
        <Ionicons name="arrow-forward" size={12} color={theme.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    minWidth: 0,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 5,
    minHeight: 64,
  },
  chipValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  chipCaption: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
  },
  track: {
    width: '80%',
    height: 3,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 10,
    minHeight: 28,
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
