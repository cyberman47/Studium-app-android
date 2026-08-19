import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { FocusArea } from '../data';

import { Card } from './Card';

function toneColor(accuracy: number, theme: ReturnType<typeof useTheme>): string {
  if (accuracy < 60) return theme.rose;
  if (accuracy < 85) return theme.amber;
  return theme.accent;
}

function FocusAreaRow({ area }: { area: FocusArea }) {
  const theme = useTheme();
  const color = toneColor(area.accuracy, theme);
  return (
    <View style={styles.focusRow}>
      <View style={styles.focusHeader}>
        <ThemedText style={styles.focusLabel}>{area.label}</ThemedText>
        <ThemedText style={[styles.focusPercent, { color }]}>{area.accuracy}%</ThemedText>
      </View>
      <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
        <View style={[styles.fill, { width: `${area.accuracy}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export function PerformanceCard({
  level,
  levelName,
  totalKP,
  focusAreas,
}: {
  level: number;
  levelName: string;
  totalKP: number;
  focusAreas: FocusArea[];
}) {
  const theme = useTheme();
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="stats-chart" size={13} color={theme.primary} />
          <ThemedText themeColor="textSecondary" style={styles.headerText}>
            YOUR PERFORMANCE
          </ThemedText>
        </View>
      </View>

      <View style={styles.levelRow}>
        <View style={styles.levelLeft}>
          <View style={[styles.levelBadge, { backgroundColor: theme.primaryMuted }]}>
            <ThemedText themeColor="primary" style={styles.levelBadgeText}>
              {level}
            </ThemedText>
          </View>
          <View>
            <ThemedText themeColor="textSecondary" style={styles.levelLabel}>
              Level {level}
            </ThemedText>
            <ThemedText style={styles.levelName}>{levelName}</ThemedText>
          </View>
        </View>
        <View style={styles.kpBadge}>
          <Ionicons name="flash" size={13} color={theme.primary} />
          <ThemedText themeColor="primary" style={styles.kpText}>
            {totalKP.toLocaleString()}
          </ThemedText>
        </View>
      </View>

      {focusAreas.length > 0 && (
        <View style={styles.focusList}>
          <ThemedText themeColor="textSecondary" style={styles.focusListLabel}>
            Focus Areas
          </ThemedText>
          {focusAreas.map((area) => (
            <FocusAreaRow key={area.label} area={area} />
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '800',
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    fontSize: 16,
    fontWeight: '800',
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  levelName: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  kpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  kpText: {
    fontSize: 13,
    fontWeight: '800',
  },
  focusList: {
    marginTop: Spacing.four,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(148,163,184,0.25)',
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  focusListLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  focusRow: {
    gap: 6,
  },
  focusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  focusLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  focusPercent: {
    fontSize: 12,
    fontWeight: '800',
  },
  track: {
    height: 6,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
