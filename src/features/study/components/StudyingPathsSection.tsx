import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { type Track, type TrackId, tracks } from '../tracks';

function TrackCard({ track, onPress }: { track: Track; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <View style={[styles.shadowWrap, Shadow.card]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${track.name}, ${track.meta}${track.current ? ', current path' : ''}`}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.backgroundElement, borderColor: track.current ? track.fg : theme.border },
          pressed && { backgroundColor: theme.backgroundSelected },
        ]}>
        {track.current && (
          <View style={[styles.currentBadge, { backgroundColor: track.fg }]}>
            <ThemedText style={styles.currentBadgeText}>Current</ThemedText>
          </View>
        )}
        <View style={[styles.iconCircle, { backgroundColor: track.bg }]}>
          <Ionicons name={track.icon} size={20} color={track.fg} />
        </View>
        <ThemedText numberOfLines={1} style={styles.name}>
          {track.name}
        </ThemedText>
        <ThemedText numberOfLines={1} themeColor="textSecondary" style={styles.meta}>
          {track.meta}
        </ThemedText>
      </Pressable>
    </View>
  );
}

// Mirrors the web app's Learning Paths "Browse Paths" grid
// (app/dashboard/(main)/learning-paths/page.tsx) — same seven tracks, same
// per-track color so students can tell them apart at a glance, same
// "Current" badge on whichever one matches the active path. Tapping a
// card is real now: it routes to that track's detail screen
// (app/track/[id].tsx), a real topic/lesson list mirrored from the web
// app's lib/*Path.ts files.
export function StudyingPathsSection({ onPressTrack }: { onPressTrack?: (id: TrackId) => void }) {
  return (
    <View>
      <ThemedText themeColor="textSecondary" style={styles.label}>
        STUDYING PATHS
      </ThemedText>
      <View style={styles.grid}>
        {tracks.map((track) => (
          <View key={track.id} style={styles.gridItem}>
            <TrackCard track={track} onPress={onPressTrack ? () => onPressTrack(track.id) : undefined} />
          </View>
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
    marginBottom: Spacing.two + 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '47%',
    flexGrow: 1,
  },
  shadowWrap: {
    borderRadius: Radius.lg,
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 108,
  },
  currentBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
  },
  meta: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
