import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// A compact Study Planner preview — used on both Home (per the new
// dashboard hierarchy) and the Learn tab's "Study Planner" section, so
// switching a track or exam date only needs updating in one place. Tapping
// it opens /study-planner — the real wizard + AI-generated weekly plan —
// not /progress, which is exam-readiness/mastery tracking, a separate
// concern.
export function StudyPlannerCard({
  pathLabel,
  daysToExam,
  streakSecured,
  onViewPlan,
}: {
  pathLabel: string;
  daysToExam: number;
  streakSecured: boolean;
  onViewPlan?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.shadowWrap, Shadow.card]}>
      <Pressable
        onPress={onViewPlan}
        accessibilityRole="button"
        accessibilityLabel={`Study Planner: ${pathLabel}, ${daysToExam} days to exam, ${streakSecured ? 'streak secured' : 'streak not secured yet'}`}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && { backgroundColor: theme.backgroundSelected },
        ]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="calendar-outline" size={13} color={theme.textSecondary} />
            <ThemedText themeColor="textSecondary" style={styles.headerText}>
              STUDY PLANNER
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={14} color={theme.textSecondary} />
        </View>

        <ThemedText style={styles.pathLabel}>{pathLabel}</ThemedText>

        <View style={styles.metaRow}>
          <ThemedText themeColor="textSecondary" style={styles.metaText}>
            {daysToExam} days to exam
          </ThemedText>
          <View style={styles.metaDivider} />
          <Ionicons
            name={streakSecured ? 'checkmark-circle' : 'ellipse-outline'}
            size={13}
            color={streakSecured ? theme.primary : theme.textSecondary}
          />
          <ThemedText themeColor={streakSecured ? 'primary' : 'textSecondary'} style={styles.metaText}>
            {streakSecured ? 'Streak secured' : 'Streak not secured yet'}
          </ThemedText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  pathLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaDivider: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(148,163,184,0.4)',
    marginHorizontal: 2,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
