import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { EyebrowPill } from '@/components/eyebrow-pill';
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

// Not rendered on Home anymore — it now shows a single row inside
// HomeListSection's grouped list. Kept here as the fuller destination a
// performance row's chevron should eventually route to.
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
        <EyebrowPill emoji="📈" label="Performance" />
      </View>

      <View style={styles.levelRow}>
        <View style={styles.levelLeft}>
          <View style={[styles.levelBadge, { backgroundColor: theme.primaryMuted }]}>
            <ThemedText themeColor="primary" style={styles.levelBadgeText}>
              {level}
            </ThemedText>
          </View>
          <View style={styles.levelTextCol}>
            <ThemedText themeColor="textSecondary" style={styles.levelLabel}>
              Level {level}
            </ThemedText>
            <ThemedText style={styles.levelName} numberOfLines={1}>
              {levelName}
            </ThemedText>
          </View>
        </View>
        <View style={styles.kpBadge}>
          <Ionicons name="flash" size={12} color={theme.primary} />
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
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  levelTextCol: {
    flex: 1,
    minWidth: 0,
  },
  levelLabel: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  levelName: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  kpBadge: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: Spacing.two,
  },
  kpText: {
    fontSize: 12,
    fontWeight: '700',
  },
  focusList: {
    marginTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(148,163,184,0.25)',
    paddingTop: 12,
    gap: 12,
  },
  focusListLabel: {
    fontSize: 10,
    fontWeight: '500',
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
    fontWeight: '500',
  },
  focusPercent: {
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 5,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
