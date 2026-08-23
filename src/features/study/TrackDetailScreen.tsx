import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { LessonGrid } from '@/features/study/components/LessonGrid';
import { MCATSectionGrid } from '@/features/study/components/MCATSectionGrid';
import { useTheme } from '@/hooks/use-theme';

import { findTrack } from './tracks';
import { trackDetails } from './trackDetails';

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
// MCAT only gets a further, more detailed redesign (MCATSectionGrid) per
// a follow-up request scoped explicitly to just that one track — every
// other track keeps the plainer LessonGrid.
export function TrackDetailScreen({ id }: { id: string }) {
  const theme = useTheme();
  const track = findTrack(id);
  const detail = track ? trackDetails[track.id] : undefined;

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
            <MCATSectionGrid />
          ) : (
            <LessonGrid items={detail.rows} icon={track.icon} iconColor={track.fg} iconBackground={track.bg} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
});
