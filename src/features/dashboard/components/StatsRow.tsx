import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Replaces the old full-width "Study Plan" card with two compact chips —
// days to exam, and today's KP with a thin progress bar — plus a small
// text link below. A third "streak" chip would just repeat what the
// header's streak pill already shows, so two chips wins on compactness.
export function StatsRow({
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
    <View>
      <View style={styles.row}>
        <View
          style={[
            styles.chip,
            styles.chipFlex,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          ]}>
          <ThemedText style={styles.chipValue}>{daysToExam}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.chipCaption}>
            days until MCAT
          </ThemedText>
        </View>

        <View
          style={[
            styles.chip,
            styles.chipFlex,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          ]}>
          <ThemedText style={styles.chipValue}>
            {todayKP}/{targetKP} <ThemedText style={styles.chipValueUnit}>KP</ThemedText>
          </ThemedText>
          <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
            <View
              style={[
                styles.fill,
                { width: `${todayPercent}%`, backgroundColor: secured ? theme.primary : theme.amber },
              ]}
            />
          </View>
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
    gap: 12,
  },
  chipFlex: {
    flex: 1,
  },
  chip: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.two,
    gap: 6,
    minHeight: 64,
  },
  chipValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  chipValueUnit: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipCaption: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  track: {
    width: '80%',
    height: 4,
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
