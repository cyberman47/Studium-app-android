import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { pathOptions } from '@/constants/paths';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { useCurrentPathId } from '../currentPathStore';
import { relevantTracks, type Track, type TrackId, trackIdForPath } from '../tracks';

// A full-width row per course — icon, title + real meta line, a "Current"
// badge on whichever one matches the active study path, and a trailing
// chevron — mirroring the layout MCATSectionList already established
// elsewhere in this app (features/study/components/MCATSectionList.tsx),
// rather than a grid of tiles. Deliberately has NO per-row progress bar:
// that only reads honestly on MCAT's own section list because real
// completed/total lesson counts back it there. Nothing at this Courses
// level has that same real per-course completion data (Anatomy is the
// one exception — see progressStore.ts — but showing a bar on just that
// one row while every other row stays bare would read as broken, not
// intentional), so every row keeps the same icon/title/meta/chevron shape
// regardless of what's actually behind each course.
function CourseRow({ track, isCurrent, onPress }: { track: Track; isCurrent: boolean; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <View style={[styles.rowShadow, Shadow.card]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${track.name}: ${track.meta}${isCurrent ? ', current path' : ''}`}
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: isCurrent ? track.fg : theme.border,
            borderWidth: isCurrent ? 1.5 : StyleSheet.hairlineWidth,
          },
          pressed && { backgroundColor: theme.backgroundSelected },
        ]}>
        <View style={[styles.iconSquare, { backgroundColor: track.bg }]}>
          <Ionicons name={track.icon} size={20} color={track.fg} />
        </View>

        <View style={styles.textCol}>
          <ThemedText numberOfLines={1} style={styles.title}>
            {track.name}
          </ThemedText>
          <ThemedText numberOfLines={1} themeColor="textSecondary" style={styles.meta}>
            {track.meta}
          </ThemedText>
        </View>

        {isCurrent && (
          <View style={[styles.currentBadge, { backgroundColor: track.fg }]}>
            <ThemedText style={styles.currentBadgeText}>Current</ThemedText>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
}

// Mirrors the web app's Courses "Browse Courses" grid
// (app/dashboard/(main)/courses/page.tsx) as a vertical list of rows
// instead: a border highlights whichever row matches the active path, and
// picking a path in Settings > General narrows the list down to just
// what's relevant to it (e.g. MCAT shows just MCAT, Anatomy, and Medical
// Cases) instead of all seven regardless of what the student is actually
// studying for — see tracks.ts's relevantTracks. Tapping a row routes to
// that track's detail screen (app/track/[id].tsx), a real topic/lesson
// list mirrored from the web app's lib/*Path.ts files.
export function StudyingPathsSection({ onPressTrack }: { onPressTrack?: (id: TrackId) => void }) {
  const pathId = useCurrentPathId();
  const pathLabel = pathOptions.find((p) => p.id === pathId)?.label ?? 'this path';
  const shownTracks = relevantTracks(pathId);
  const currentTrackId = trackIdForPath[pathId];
  const isFiltered = shownTracks.length < 7;

  return (
    <View>
      <ThemedText themeColor="textSecondary" style={styles.label}>
        COURSES
      </ThemedText>
      {isFiltered && (
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          Showing what&apos;s relevant to {pathLabel}.
        </ThemedText>
      )}
      <View style={styles.list}>
        {shownTracks.map((track) => (
          <CourseRow
            key={track.id}
            track={track}
            isCurrent={track.id === currentTrackId}
            onPress={onPressTrack ? () => onPressTrack(track.id) : undefined}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3,
  },
  list: {
    gap: 10,
    marginTop: Spacing.three,
  },
  rowShadow: {
    borderRadius: Radius.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 76,
  },
  iconSquare: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
  },
  currentBadge: {
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
