import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { type CurriculumUnit, unitProgress } from '../curriculum';
import { LessonNode } from './LessonNode';

// One unit of the curriculum: a header carrying the unit's own progress
// (a real percentage, not a word) and the connected lesson timeline
// beneath it. A finished unit gets a small milestone badge instead of a
// plain heading, the one payoff moment on this screen.
export function UnitSection({ unit }: { unit: CurriculumUnit }) {
  const theme = useTheme();
  const progress = unitProgress(unit);
  const isUnitComplete = progress.percent === 100;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        {isUnitComplete ? (
          <View style={[styles.milestoneBadge, { backgroundColor: theme.primaryMuted }]}>
            <Ionicons name="checkmark-circle" size={13} color={theme.primary} />
            <ThemedText themeColor="primary" style={styles.milestoneText}>
              Unit complete
            </ThemedText>
          </View>
        ) : null}
        <View style={styles.titleRow}>
          <ThemedText style={styles.title}>{unit.title}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.count}>
            {progress.done}/{progress.total}
          </ThemedText>
        </View>
        <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
          <View
            style={[
              styles.fill,
              { width: `${progress.percent}%`, backgroundColor: theme.primary },
            ]}
          />
        </View>
      </View>

      <View style={styles.timeline}>
        {unit.lessons.map((lesson, index) => {
          const isDone = lesson.status === 'mastered' || lesson.status === 'completed';
          return (
            <LessonNode
              key={lesson.id}
              lesson={lesson}
              showConnector={index < unit.lessons.length - 1}
              connectorColor={isDone ? theme.primary : theme.border}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.two,
  },
  milestoneBadge: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: 4,
    marginBottom: 2,
  },
  milestoneText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
    flex: 1,
    minWidth: 0,
    marginRight: Spacing.two,
  },
  count: {
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 4,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  timeline: {
    marginTop: 2,
  },
});
