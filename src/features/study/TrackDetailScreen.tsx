import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { LessonGrid, LessonGridItem } from '@/features/study/components/LessonGrid';
import { MCATSectionList } from '@/features/study/components/MCATSectionList';
import { useTheme } from '@/hooks/use-theme';
import { BankTopic, getNursingSubjects, getNursingTopics } from '@/lib/contentBank';

import { findTrack } from './tracks';
import { trackDetails } from './trackDetails';

// Nursing's real topic list — fetched once per screen visit, then each
// topic's subtitle is filled in with its real subject count (real
// nursing_subjects rows, not a hardcoded "5 topics" string). Lesson counts
// per subject aren't fetched here (that's LessonListScreen's job once a
// topic is opened) — this screen only needs enough to render the grid.
function useNursingTopics(): { items: (LessonGridItem & { id: string })[] | null; loadError: boolean } {
  const [topics, setTopics] = useState<BankTopic[] | null>(null);
  const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getNursingTopics()
      .then(async (t) => {
        const counts = await Promise.all(t.map((topic) => getNursingSubjects(topic.id).then((s) => s.length)));
        if (cancelled) return;
        setTopics(t);
        setSubjectCounts(Object.fromEntries(t.map((topic, i) => [topic.id, counts[i]])));
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!topics) return { items: null, loadError };
  return {
    items: topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      subtitle: `${subjectCounts[topic.id] ?? 0} subject${subjectCounts[topic.id] === 1 ? '' : 's'}`,
    })),
    loadError,
  };
}

// What tapping a Studying Paths card actually opens now — a real topic/
// lesson list for that track, mirrored from the web app's own lib/
// *Path.ts files (see trackDetails.ts). The mobile equivalent of
// drilling into one of the web's Learning Paths "Browse Paths" cards.
//
// The lesson list renders as a 2-column card grid (LessonGrid) rather
// than a vertical GroupedList — per feedback that the list layout felt
// too plain. To revert, swap the <LessonGrid ... /> below back for a
// <GroupedList>{detail.rows.map((row) => <ListRow .../>)}</GroupedList>
// (see git history for the exact previous markup) — nothing else in the
// app depends on this screen's layout choice.
//
// MCAT only gets a further, more detailed redesign (MCATSectionList) per
// a follow-up request scoped explicitly to just that one track — every
// other track keeps the plainer LessonGrid.
export function TrackDetailScreen({ id }: { id: string }) {
  const theme = useTheme();
  const router = useRouter();
  const track = findTrack(id);
  const detail = track ? trackDetails[track.id] : undefined;
  // Called unconditionally (rules of hooks) — only its result is used, and
  // only when track.id === 'nursing'.
  const nursing = useNursingTopics();

  if (!track || !detail) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={styles.inner}>
          <ScreenHeader title="Not found" />
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            That studying path doesn't exist.
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title={track.name} />

          <View style={styles.metaRow}>
            <View style={[styles.metaPill, { backgroundColor: track.bg }]}>
              <ThemedText style={[styles.metaPillText, { color: track.fg }]}>{track.meta}</ThemedText>
            </View>
          </View>

          <ThemedText themeColor="textSecondary" style={styles.description}>
            {detail.description}
          </ThemedText>

          {track.id === 'mcat' ? (
            <MCATSectionList
              onPressItem={(section) =>
                router.push({
                  pathname: '/lesson-list',
                  params: { track: 'mcat', sectionId: section.id, filterLabel: section.title },
                })
              }
            />
          ) : track.id === 'nursing' ? (
            nursing.loadError ? (
              <View style={[styles.emptyState, { borderColor: theme.border }]}>
                <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                  Couldn't load this content.
                </ThemedText>
              </View>
            ) : !nursing.items ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={theme.primary} />
              </View>
            ) : (
              <LessonGrid
                items={nursing.items}
                icon={track.icon}
                iconColor={track.fg}
                iconBackground={track.bg}
                onPressItem={(topic) =>
                  router.push({
                    pathname: '/lesson-list',
                    params: { track: 'nursing', topicId: topic.id, filterLabel: topic.title },
                  })
                }
              />
            )
          ) : (
            <View style={[styles.emptyState, { borderColor: theme.border }]}>
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                Nothing here yet.
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
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
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: -6,
  },
  metaPill: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: 5,
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyState: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
