import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/features/dashboard/components/Card';

// The Passport gets its own card rather than folding into the grouped
// list below — it's the one gamified, exciting feature of this screen
// (every achievement + the learning journey behind it), so it earns a
// little more visual weight than a one-line row, same way Daily Case
// earns more weight than a plain list row on Home.
export function PassportCard({
  unlocked,
  total,
  topicsMasteredCount,
  onViewPassport,
}: {
  unlocked: number;
  total: number;
  topicsMasteredCount: number;
  onViewPassport?: () => void;
}) {
  const theme = useTheme();
  const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  return (
    <Card>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Ionicons name="ribbon-outline" size={14} color={theme.primary} />
          <ThemedText themeColor="primary" style={styles.eyebrow}>
            Full Passport
          </ThemedText>
        </View>
        <ThemedText themeColor="textSecondary" style={styles.topics}>
          {topicsMasteredCount} topics mastered
        </ThemedText>
      </View>

      <ThemedText style={styles.count}>
        {unlocked} of {total} <ThemedText style={styles.countUnit}>unlocked</ThemedText>
      </ThemedText>

      <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: theme.primary }]} />
      </View>

      {unlocked === 0 && (
        <ThemedText themeColor="textSecondary" style={styles.empty}>
          Keep studying — your first achievement will show up here.
        </ThemedText>
      )}

      <Pressable
        onPress={onViewPassport}
        accessibilityRole="button"
        accessibilityLabel="View full passport"
        hitSlop={8}
        style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}>
        <ThemedText themeColor="primary" style={styles.linkText}>
          View Full Passport
        </ThemedText>
        <Ionicons name="arrow-forward" size={12} color={theme.primary} />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  topics: {
    fontSize: 11,
    fontWeight: '500',
  },
  count: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 10,
  },
  countUnit: {
    fontSize: 13,
    fontWeight: '500',
  },
  track: {
    height: 5,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    marginTop: 8,
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  empty: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 17,
    marginTop: 10,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: 12,
    minHeight: 32,
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
