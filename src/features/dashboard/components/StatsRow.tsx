import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function StatPill({
  icon,
  iconColor,
  bg,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bg: string;
  label: string;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={14} color={iconColor} />
      <ThemedText style={[styles.pillText, { color: iconColor }]}>{label}</ThemedText>
    </View>
  );
}

export function StatsRow({
  streakDays,
  todayKP,
  targetKP,
}: {
  streakDays: number;
  todayKP: number;
  targetKP: number;
}) {
  const theme = useTheme();
  const secured = todayKP >= targetKP;
  return (
    <View
      style={styles.row}
      accessibilityRole="summary"
      accessibilityLabel={`${streakDays} day streak, ${todayKP} of ${targetKP} knowledge points today`}>
      <StatPill
        icon="flame"
        iconColor={theme.amber}
        bg={theme.amberMuted}
        label={`${streakDays} day${streakDays === 1 ? '' : 's'}`}
      />
      <StatPill
        icon={secured ? 'checkmark-circle' : 'flash'}
        iconColor={theme.primary}
        bg={theme.primaryMuted}
        label={`${todayKP} / ${targetKP} KP`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
