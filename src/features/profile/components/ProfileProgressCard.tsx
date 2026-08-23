import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// A compact 4-stat summary of the same real numbers /progress shows in
// full detail — mirrors the desktop dashboard's own Progress cluster.
// Questions answered/Accuracy are honestly 0/"—" here: there's no real
// quiz-attempt tracking anywhere in this app yet (see
// features/review/quizStore.ts's own comment), so unlike overall
// mastery and study time — both real mock fields already read
// elsewhere on Home — these two aren't invented numbers standing in for
// something that doesn't exist.
export function ProfileProgressCard({
  overallMasteryPercent,
  studyTimeToday,
  questionsAnswered,
  accuracyPercent,
  onViewProgress,
}: {
  overallMasteryPercent: number;
  studyTimeToday: string;
  questionsAnswered: number;
  accuracyPercent: number | null;
  onViewProgress?: () => void;
}) {
  const theme = useTheme();
  const stats = [
    { label: 'Overall mastery', value: `${overallMasteryPercent}%` },
    { label: 'Study time', value: studyTimeToday },
    { label: 'Questions answered', value: String(questionsAnswered) },
    { label: 'Accuracy', value: accuracyPercent === null ? '—' : `${accuracyPercent}%` },
  ];

  return (
    <View style={[styles.shadowWrap, Shadow.card]}>
      <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <View style={styles.header}>
          <ThemedText themeColor="textSecondary" style={styles.headerText}>
            PROGRESS
          </ThemedText>
        </View>

        <View style={styles.grid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.statLabel} numberOfLines={1}>
                {stat.label}
              </ThemedText>
            </View>
          ))}
        </View>

        <Pressable
          onPress={onViewProgress}
          accessibilityRole="button"
          accessibilityLabel="View progress"
          hitSlop={8}
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}>
          <ThemedText themeColor="primary" style={styles.linkText}>
            View progress
          </ThemedText>
          <Ionicons name="arrow-forward" size={12} color={theme.primary} />
        </Pressable>
      </View>
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
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: Spacing.two + 2,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 14,
  },
  stat: {
    width: '50%',
    gap: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: Spacing.two,
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
