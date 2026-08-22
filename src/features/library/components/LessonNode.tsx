import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { MasteryBar } from '@/components/mastery-bar';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { CurriculumLesson } from '../curriculum';

const statusLabel: Record<CurriculumLesson['status'], string> = {
  mastered: 'Mastered',
  completed: 'Completed',
  current: 'In progress',
  locked: 'Locked',
};

// One stop on the curriculum timeline. Visual weight scales with what the
// lesson actually is, not a uniform row: mastered/completed lessons are
// lightweight (a title, a mastery bar, meta — no card), the current
// lesson is a real elevated card (the one thing on this screen that
// should pull your eye), and locked lessons are dim and cardless,
// connected into the rail so "what's next" reads as a path rather than
// a dead end.
export function LessonNode({
  lesson,
  showConnector,
  connectorColor,
}: {
  lesson: CurriculumLesson;
  showConnector: boolean;
  connectorColor: string;
}) {
  const theme = useTheme();
  const isCurrent = lesson.status === 'current';
  const isLocked = lesson.status === 'locked';
  const isDone = lesson.status === 'mastered' || lesson.status === 'completed';

  const dotColor = isDone ? theme.primary : isCurrent ? theme.primary : theme.backgroundSelected;
  const dotBorder = isLocked ? theme.border : 'transparent';

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View
          style={[
            styles.dot,
            isCurrent && styles.dotCurrent,
            { backgroundColor: dotColor, borderColor: dotBorder },
          ]}>
          {isDone && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
          {isCurrent && <View style={styles.dotCurrentInner} />}
          {isLocked && <Ionicons name="lock-closed" size={11} color={theme.textSecondary} />}
        </View>
        {showConnector && <View style={[styles.connector, { backgroundColor: connectorColor }]} />}
      </View>

      <View style={styles.content}>
        {isCurrent ? (
          <View style={[styles.shadowWrap, Shadow.raised]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Continue ${lesson.title}`}
              style={({ pressed }) => [
                styles.currentCard,
                { backgroundColor: theme.primaryMuted, borderColor: theme.primary },
                pressed && styles.currentCardPressed,
              ]}>
              <ThemedText themeColor="primary" style={styles.currentEyebrow}>
                CONTINUE
              </ThemedText>
              <ThemedText style={styles.currentTitle}>{lesson.title}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.meta}>
                {lesson.minutes} min · {lesson.questions} questions
              </ThemedText>
              <View style={styles.resumeRow}>
                <ThemedText themeColor="primary" style={styles.resumeText}>
                  Resume
                </ThemedText>
                <Ionicons name="arrow-forward" size={13} color={theme.primary} />
              </View>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.plainContent, isLocked && styles.lockedContent]}>
            <ThemedText
              numberOfLines={1}
              style={[styles.title, isLocked && { color: theme.textSecondary }]}>
              {lesson.title}
            </ThemedText>
            {!isLocked && (
              <ThemedText themeColor="primary" style={styles.statusTag}>
                {statusLabel[lesson.status]}
              </ThemedText>
            )}
            {isDone && lesson.masteryPercent !== undefined ? (
              <MasteryBar percent={lesson.masteryPercent} compact />
            ) : null}
            <ThemedText themeColor="textSecondary" style={styles.meta}>
              {lesson.minutes} min · {lesson.questions} questions
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two + 2,
  },
  rail: {
    width: 28,
    alignItems: 'center',
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  dotCurrent: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  dotCurrentInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  connector: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 1,
  },
  content: {
    flex: 1,
    minWidth: 0,
    paddingBottom: Spacing.four,
  },
  plainContent: {
    gap: 5,
    paddingTop: 2,
  },
  lockedContent: {
    opacity: 0.55,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusTag: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  meta: {
    fontSize: 11,
    fontWeight: '500',
  },
  shadowWrap: {
    borderRadius: Radius.xl,
  },
  currentCard: {
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 5,
  },
  currentCardPressed: {
    opacity: 0.9,
  },
  currentEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  currentTitle: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  resumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  resumeText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
