import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MasteryBar } from '@/components/mastery-bar';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  BankLesson,
  BankSubject,
  BankTrack,
  getLessonsForSubject,
  getMcatSubjects,
  getNursingSubjects,
  getQuestionCountsForLessons,
} from '@/lib/contentBank';
import { lessonCompletion, QuestionBankProgress, useQuestionBankProgress } from '@/lib/questionBankProgress';

type SubjectGroup = { subject: BankSubject; lessons: BankLesson[] };
type Completion = { attempted: number; percent: number; done: boolean };

// Real subject → lesson browsing for a question bank — replaces the old
// mock curriculum.ts timeline. No lesson is ever locked (a question bank
// is meant to be freely browsable, not a gated linear course); the first
// not-yet-finished lesson in each subject gets a small "Up next" cue so
// there's still an obvious place to pick up, without the old mega "current
// lesson" card treatment that doesn't make sense once nothing is locked.
//
// Used two ways: with no `sectionId`/`topicId`, this is Library's "All
// Lessons" (every MCAT subject); with one set, it's the Study tab's
// per-section (MCAT) or per-topic (Nursing) drill-down.
export function LessonListScreen({
  track,
  sectionId,
  topicId,
  filterLabel,
}: {
  track: BankTrack;
  sectionId?: string;
  topicId?: string;
  filterLabel?: string;
}) {
  const theme = useTheme();
  const router = useRouter();
  const progress = useQuestionBankProgress();

  const [groups, setGroups] = useState<SubjectGroup[] | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const subjects =
          track === 'mcat'
            ? (await getMcatSubjects()).filter((s) => !sectionId || s.sectionId === sectionId)
            : await getNursingSubjects(topicId ?? '');

        const lessonsBySubject = await Promise.all(subjects.map((s) => getLessonsForSubject(track, s.id)));
        const nextGroups = subjects.map((subject, i) => ({ subject, lessons: lessonsBySubject[i] }));

        const allLessonIds = nextGroups.flatMap((g) => g.lessons.map((l) => l.id));
        const nextCounts = await getQuestionCountsForLessons(track, allLessonIds);

        if (!cancelled) {
          setGroups(nextGroups);
          setCounts(nextCounts);
        }
      } catch {
        if (!cancelled) setLoadError(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [track, sectionId, topicId]);

  function openLesson(subject: BankSubject, lesson: BankLesson) {
    router.push({
      pathname: '/practice',
      params: {
        track,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        subjectTitle: subject.name,
      },
    });
  }

  const title = filterLabel ?? 'All Lessons';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title={title} />

          {loadError ? (
            <View style={[styles.emptyState, { borderColor: theme.border }]}>
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                Couldn't load this content. Check your connection and try again.
              </ThemedText>
            </View>
          ) : !groups ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <View style={styles.groups}>
              {groups.map((group) => (
                <SubjectSection
                  key={group.subject.id}
                  group={group}
                  track={track}
                  counts={counts}
                  progress={progress}
                  onPressLesson={(lesson) => openLesson(group.subject, lesson)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SubjectSection({
  group,
  track,
  counts,
  progress,
  onPressLesson,
}: {
  group: SubjectGroup;
  track: BankTrack;
  counts: Record<string, number>;
  progress: QuestionBankProgress;
  onPressLesson: (lesson: BankLesson) => void;
}) {
  const theme = useTheme();
  const completions = group.lessons.map((l) => lessonCompletion(progress, track, l.id, counts[l.id] ?? 0));
  const doneCount = completions.filter((x) => x.done).length;
  const total = group.lessons.length;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const nextIndex = completions.findIndex((x) => !x.done);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <ThemedText style={styles.sectionTitle}>{group.subject.name}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.count}>
            {doneCount}/{total}
          </ThemedText>
        </View>
        <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
          <View style={[styles.fill, { width: `${percent}%`, backgroundColor: theme.primary }]} />
        </View>
      </View>

      <View style={styles.lessons}>
        {group.lessons.map((lesson, i) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            questionCount={counts[lesson.id] ?? 0}
            completion={completions[i]}
            isNext={i === nextIndex}
            onPress={() => onPressLesson(lesson)}
          />
        ))}
        {group.lessons.length === 0 && (
          <ThemedText themeColor="textSecondary" style={styles.emptySubjectText}>
            No lessons yet.
          </ThemedText>
        )}
      </View>
    </View>
  );
}

function LessonRow({
  lesson,
  questionCount,
  completion,
  isNext,
  onPress,
}: {
  lesson: BankLesson;
  questionCount: number;
  completion: Completion;
  isNext: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const inProgress = completion.attempted > 0 && !completion.done;
  const metaParts = [lesson.difficulty, `${questionCount} question${questionCount === 1 ? '' : 's'}`];
  if (lesson.estimatedMinutes) metaParts.splice(1, 0, `${lesson.estimatedMinutes} min`);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${lesson.title}: ${metaParts.join(', ')}`}
      style={({ pressed }) => [
        styles.row,
        { borderColor: theme.border },
        pressed && { backgroundColor: theme.backgroundSelected },
      ]}>
      <View
        style={[
          styles.dot,
          completion.done
            ? { backgroundColor: theme.primary, borderColor: theme.primary }
            : inProgress
              ? { backgroundColor: theme.primaryMuted, borderColor: theme.primary }
              : { backgroundColor: theme.background, borderColor: theme.border },
        ]}>
        {completion.done && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
      </View>

      <View style={styles.rowContent}>
        <View style={styles.rowTitleLine}>
          <ThemedText numberOfLines={1} style={styles.rowTitle}>
            {lesson.title}
          </ThemedText>
          {isNext && !completion.done && (
            <View style={[styles.nextBadge, { backgroundColor: theme.primaryMuted }]}>
              <ThemedText themeColor="primary" style={styles.nextBadgeText}>
                UP NEXT
              </ThemedText>
            </View>
          )}
        </View>
        <ThemedText themeColor="textSecondary" style={styles.rowMeta}>
          {metaParts.join(' · ')}
        </ThemedText>
        {inProgress && <MasteryBar percent={completion.percent} compact />}
      </View>

      <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: Spacing.six,
  },
  inner: {
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.four,
  },
  loadingWrap: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyState: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  groups: {
    gap: Spacing.five,
  },
  section: {
    gap: Spacing.three,
  },
  sectionHeader: {
    gap: Spacing.two,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
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
  lessons: {
    gap: 8,
  },
  emptySubjectText: {
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 60,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  nextBadge: {
    borderRadius: Radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  nextBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  rowMeta: {
    fontSize: 11.5,
    fontWeight: '500',
  },
});
