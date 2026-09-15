import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Three stat cards, deliberately given IDENTICAL visual weight — same
// background tint, same border, same icon size/color, same type scale —
// rather than the old per-stat coloring (a solid amber/teal fill + progress
// bar on the KP card, an urgency-shifting neutral→amber→rose tint on the
// exam card, plain white on the third). That made the row read as three
// unrelated widgets instead of one stat rail; per feedback, harmony now
// comes from the icon glyph and the number alone, not from decorating each
// card differently. `backgroundSelected` (a soft mint/teal tint already in
// the theme, not a new color invented for this) gives all three the same
// quiet, elevated-but-flat surface in both light and dark mode.
//
// Days to exam and Plan KP are still real, sourced from the student's own
// generated Study Planner plan (see getPlannerHomeSnapshot in
// lib/studyPlanner.ts) — only the *presentation* changed, not what the
// numbers mean. Plan KP still swaps to a checkmark and appends "· Done"
// once every task for the week is complete; that's a glyph/text change,
// not a color one, so it doesn't break the row's uniformity.
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

  return (
    <View>
      <View style={styles.row}>
        <View style={[styles.chip, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
          <Ionicons name="calendar" size={14} color={theme.primary} />
          <ThemedText style={styles.chipValue}>{daysToExam}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.chipCaption} numberOfLines={1}>
            Days to Exam
          </ThemedText>
        </View>

        <View style={[styles.chip, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
          <Ionicons name={secured ? 'checkmark-circle' : 'flash'} size={14} color={theme.primary} />
          <ThemedText style={styles.chipValue}>
            {planKpEarned}/{planKpTarget}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.chipCaption} numberOfLines={1}>
            {secured ? 'Plan KP · Done' : 'Plan KP'}
          </ThemedText>
        </View>

        <View style={[styles.chip, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
          <Ionicons name="time-outline" size={14} color={theme.primary} />
          <ThemedText style={styles.chipValue}>{studyTimeToday}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.chipCaption} numberOfLines={1}>
            Study Time
          </ThemedText>
        </View>
      </View>

      {/* A third brand tone (emerald accent), not amber and not the row's
          teal — this is the one actionable link in the group (the three
          cards above are read-only stats), and now that Home's separate
          Study Planner card lower down is gone, this bar is the only way
          back to the plan, so it earns a color of its own. Deliberately
          NOT amber: the streak pill up in the header (StreakBadge) is
          amber whenever today's KP goal isn't hit yet — the common case —
          and this bar sitting right below it in the same amber would read
          as one blob instead of two distinct things to notice. Still the
          same quiet tinted-bar treatment every other accent in this app
          uses (theme.accentMuted/accent, not a solid fill). */}
      <Pressable
        onPress={onViewPlan}
        accessibilityRole="button"
        accessibilityLabel="View study plan"
        style={({ pressed }) => [
          styles.link,
          { backgroundColor: theme.accentMuted },
          pressed && styles.linkPressed,
        ]}>
        <Ionicons name="calendar-clear-outline" size={13} color={theme.accent} />
        <ThemedText themeColor="accent" style={styles.linkText}>
          View study plan
        </ThemedText>
        <Ionicons name="arrow-forward" size={12} color={theme.accent} style={styles.linkArrow} />
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
  // Flat by design — no shadow at all, so the three cards read as one
  // quiet surface rather than three raised widgets competing for
  // attention. `borderWidth` is a true 1px hairline, not the OS-scaled
  // StyleSheet.hairlineWidth, since a crisp defined edge is the point.
  chip: {
    flex: 1,
    minWidth: 0,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 3,
    minHeight: 56,
  },
  chipValue: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  chipCaption: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.1,
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
