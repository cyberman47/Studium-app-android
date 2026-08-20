import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Mirrors the web app's Learning Paths "Browse Paths" grid
// (app/dashboard/(main)/learning-paths/page.tsx) — same seven tracks, same
// per-track color so students can tell them apart at a glance, same
// "Current" badge on whichever one matches the active path. Real lesson
// counts live in lib/*Path.ts on the web; this mirrors those with
// representative numbers until the mobile app reads real content.
const tracks: {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  meta: string;
  bg: string;
  fg: string;
  current?: boolean;
}[] = [
  { name: 'MCAT', icon: 'clipboard-outline', meta: '6 Sections · 190 Lessons', bg: 'rgba(124, 58, 237, 0.12)', fg: '#7C3AED', current: true },
  { name: 'Medical School', icon: 'school-outline', meta: '8 Topics', bg: 'rgba(15, 139, 141, 0.12)', fg: '#0F8B8D' },
  { name: 'Nursing', icon: 'heart-outline', meta: '9 Topics', bg: 'rgba(219, 39, 119, 0.12)', fg: '#DB2777' },
  { name: 'Anatomy', icon: 'body-outline', meta: '7 Regions', bg: 'rgba(225, 29, 72, 0.12)', fg: '#E11D48' },
  { name: 'Pharmacology', icon: 'medkit-outline', meta: '6 Topics', bg: 'rgba(79, 70, 229, 0.12)', fg: '#4F46E5' },
  { name: 'Medical Cases', icon: 'pulse-outline', meta: '12 Cases', bg: 'rgba(244, 63, 94, 0.12)', fg: '#F43F5E' },
  { name: 'USMLE', icon: 'medal-outline', meta: '9 Topics', bg: 'rgba(217, 119, 6, 0.12)', fg: '#D97706' },
];

function TrackCard({ track, onPress }: { track: (typeof tracks)[number]; onPress?: () => void }) {
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

export function StudyingPathsSection({ onPressTrack }: { onPressTrack?: (name: string) => void }) {
  return (
    <View>
      <ThemedText themeColor="textSecondary" style={styles.label}>
        STUDYING PATHS
      </ThemedText>
      <View style={styles.grid}>
        {tracks.map((track) => (
          <View key={track.name} style={styles.gridItem}>
            <TrackCard track={track} onPress={onPressTrack ? () => onPressTrack(track.name) : undefined} />
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
