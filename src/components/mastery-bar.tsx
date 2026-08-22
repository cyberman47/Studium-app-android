import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The one progress visual reused everywhere mastery/completion needs to be
// shown — lesson mastery here, unit/subject progress in curriculum
// screens, achievement/challenge progress elsewhere. Progress is always
// this bar (or the plain percentage it labels), never just a status word.
export function MasteryBar({
  percent,
  color,
  label,
  compact,
}: {
  percent: number;
  color?: string;
  label?: string;
  compact?: boolean;
}) {
  const theme = useTheme();
  const tone = color ?? (percent >= 85 ? theme.primary : percent >= 60 ? theme.amber : theme.rose);
  return (
    <View style={styles.wrap}>
      {label && (
        <View style={styles.labelRow}>
          <ThemedText themeColor="textSecondary" style={styles.label}>
            {label}
          </ThemedText>
          <ThemedText style={[styles.percent, { color: tone }]}>{percent}%</ThemedText>
        </View>
      )}
      <View
        style={[
          styles.track,
          { backgroundColor: theme.backgroundSelected, height: compact ? 4 : 5 },
        ]}>
        <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, percent))}%`, backgroundColor: tone }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  percent: {
    fontSize: 11,
    fontWeight: '700',
  },
  track: {
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
