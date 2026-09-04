import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Three stat chips, each colored by what it actually means rather than one
// flat neutral treatment for all three — same "tinted chip" grammar
// Profile's own stat chips already use, extended with per-stat state.
// Days to exam and Plan KP are both real now, sourced from the student's
// own generated Study Planner plan (see getPlannerHomeSnapshot in
// lib/studyPlanner.ts) rather than a static mock — "Plan KP" specifically
// means "tasks completed / tasks in this week's real plan," not the
// app's separate (still-mock) daily-streak KP goal, so the label says
// exactly that instead of borrowing "Today's KP" for something it isn't.
// It switches from amber ("still working through it") to teal with a
// checkmark once every task for the week is done; Days to exam shifts
// neutral → amber → rose as the real deadline gets close, so the color
// itself carries urgency instead of decorating it. Study time stays the
// quiet, bordered-neutral one of the three — it's an FYI stat, not a
// goal or a deadline, and giving it the same loud treatment as the other
// two would flatten the hierarchy this is trying to create.
function urgencyColors(daysToExam: number, theme: ReturnType<typeof useTheme>) {
  if (daysToExam <= 7) return { tint: theme.roseMuted, fg: theme.rose };
  if (daysToExam <= 30) return { tint: theme.amberMuted, fg: theme.amber };
  return { tint: theme.primaryMuted, fg: theme.primary };
}

export function StatsRow({
  daysToExam,
  planKpEarned,
  planKpTarget,
  studyTimeToday,
  onViewPlan,
}: {
  daysToExam: number;
  planKpEarned: number;
  planKpTarget: number;
  studyTimeToday: string;
  onViewPlan?: () => void;
}) {
  const theme = useTheme();
  const secured = planKpTarget > 0 && planKpEarned >= planKpTarget;
  const todayPercent = planKpTarget > 0 ? Math.min(100, Math.round((planKpEarned / planKpTarget) * 100)) : 0;
  const examColor = urgencyColors(daysToExam, theme);
  const kpColor = secured ? { tint: theme.primaryMuted, fg: theme.primary } : { tint: theme.amberMuted, fg: theme.amber };

  return (
    <View>
      <View style={styles.row}>
        <View style={[styles.chip, { backgroundColor: examColor.tint }]}>
          <Ionicons name="calendar" size={15} color={examColor.fg} />
          <ThemedText style={[styles.chipValue, { color: examColor.fg }]}>{daysToExam}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.chipCaption} numberOfLines={1}>
            Days to exam
          </ThemedText>
        </View>

        <View style={[styles.chip, styles.chipFeatured, Shadow.card, { backgroundColor: kpColor.tint }]}>
          <Ionicons name={secured ? 'checkmark-circle' : 'flash'} size={15} color={kpColor.fg} />
          <ThemedText style={[styles.chipValue, { color: kpColor.fg }]}>
            {planKpEarned}/{planKpTarget}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.chipCaption} numberOfLines={1}>
            {secured ? 'Plan KP · done' : 'Plan KP'}
          </ThemedText>
          <View style={[styles.track, { backgroundColor: theme.background }]}>
            <View style={[styles.fill, { width: `${todayPercent}%`, backgroundColor: kpColor.fg }]} />
          </View>
        </View>

        <View style={[styles.chip, { backgroundColor: theme.backgroundElement, borderColor: theme.border, borderWidth: StyleSheet.hairlineWidth }]}>
          <Ionicons name="time-outline" size={15} color={theme.textSecondary} />
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
        style={({ pressed }) => [
          styles.link,
          { backgroundColor: theme.backgroundSelected },
          pressed && styles.linkPressed,
        ]}>
        <Ionicons name="calendar-clear-outline" size={13} color={theme.primary} />
        <ThemedText themeColor="primary" style={styles.linkText}>
          View study plan
        </ThemedText>
        <Ionicons name="arrow-forward" size={12} color={theme.primary} style={styles.linkArrow} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
  },
  chip: {
    flex: 1,
    minWidth: 0,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 4,
    minHeight: 78,
  },
  // The KP chip is the one stat that actually changes today — it earns a
  // touch more visual weight (a real shadow, not just a tint) than the
  // other two, which are context, not action.
  chipFeatured: {
    borderRadius: Radius.lg,
  },
  chipValue: {
    fontSize: 17,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  chipCaption: {
    fontSize: 9.5,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  track: {
    width: '82%',
    height: 4,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    marginTop: 2,
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 6,
    marginTop: 10,
    minHeight: 38,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.two + 2,
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
  },
  linkArrow: {
    marginLeft: -2,
  },
});
