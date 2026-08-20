import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Two tinted stat chips — the same "compact chip row" language as Home's
// StatsRow, but tinted (teal/amber) rather than neutral white/bordered, to
// match the real web profile's highlighted KP + streak tiles.
export function ProfileStatChips({ totalKP, streakDays }: { totalKP: number; streakDays: number }) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.chip, { backgroundColor: theme.primaryMuted }]}>
        <Ionicons name="flash" size={16} color={theme.primary} />
        <ThemedText style={styles.value}>{totalKP.toLocaleString()}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.label}>
          Knowledge Points
        </ThemedText>
      </View>
      <View style={[styles.chip, { backgroundColor: theme.amberMuted }]}>
        <Ionicons name="trending-up" size={16} color={theme.amber} />
        <ThemedText style={styles.value}>{streakDays}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.label}>
          Day streak
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    flex: 1,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.two,
    gap: 4,
    minHeight: 76,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
});
