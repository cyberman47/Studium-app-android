import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { pathOptions } from '@/constants/paths';
import { Radius } from '@/constants/theme';
import { seedCurrentPathFromLabel, useCurrentPathId } from '@/features/study/currentPathStore';
import { useTheme } from '@/hooks/use-theme';

// A plain, non-interactive display of the student's current study path —
// shared by Home and the Learn tab header. Used to be PathSwitcher, a
// tappable badge that opened a picker right here; per feedback, switching
// what you're studying (MCAT vs Nursing vs ...) is too big a decision to
// be one casual tap away from the home screen, so that picker moved to
// Settings > General ("Study Path") and this badge just shows the current
// choice. The underlying selection still lives in currentPathStore.ts —
// only the ability to change it from here is gone.
//
// Still seeds itself from the real profile-derived pathLabel prop once
// `loading` flips from true to false (Home mounts this before the real
// Supabase fetch resolves) — a no-op once the student has picked a path
// themselves (in Settings now), so a later refresh can't clobber that
// choice. `pathEmoji` is still accepted (callers still fetch/pass it,
// mirroring the web's data model) but no longer rendered — per feedback,
// the label alone reads cleaner without an emoji glyph in front of it.
//
// Colored per path (constants/paths.ts's color/colorMuted) rather than a
// plain neutral pill — per feedback, each study path should have its own
// visual identity everywhere it's shown, not just distinct label text.
export function CurrentPathBadge({ pathLabel, loading = false }: { pathLabel: string; pathEmoji?: string; loading?: boolean }) {
  const theme = useTheme();
  const pathId = useCurrentPathId();
  const selectedOption = pathOptions.find((p) => p.id === pathId);
  const selected = selectedOption ?? { label: pathLabel, color: theme.primary, colorMuted: theme.primaryMuted };

  useEffect(() => {
    if (loading) return;
    seedCurrentPathFromLabel(pathLabel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Currently studying: ${selected.label}`}
      style={[styles.pathBadge, { backgroundColor: selected.colorMuted, borderColor: selected.color }]}>
      <ThemedText style={[styles.pathLabel, { color: selected.color }]} numberOfLines={1}>
        {selected.label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pathBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: 200,
    minHeight: 32,
  },
  pathLabel: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: '500',
  },
});
