import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { type PathId, pathOptions } from '@/constants/paths';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The "Currently studying / Change to" path badge + picker — extracted
// from what used to be GreetingHeader's own inline Modal so Home and the
// new Learn tab header both show (and can switch) the same path, instead
// of Learn inventing a second, non-interactive copy of the same badge.
//
// Seeded from real profile-derived pathLabel/pathEmoji props but owns
// the selection from here on — there's no backend to round-trip a path
// choice through yet, same as every other mock-data control in this app.
// Re-seeds itself once, the moment `loading` flips from true to false
// (Home mounts this before the real Supabase fetch resolves, so without
// this it would keep showing the mock path label forever) — skipped once
// the user has picked a different path themselves, so a later refresh
// can't clobber that local choice.
export function PathSwitcher({ pathLabel, pathEmoji, loading = false }: { pathLabel: string; pathEmoji: string; loading?: boolean }) {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: PathId | null; label: string; emoji: string }>(() => {
    const match = pathOptions.find((p) => p.label === pathLabel);
    return { id: match?.id ?? null, label: pathLabel, emoji: pathEmoji };
  });
  const userChangedRef = useRef(false);
  useEffect(() => {
    if (loading || userChangedRef.current) return;
    const match = pathOptions.find((p) => p.label === pathLabel);
    setSelected({ id: match?.id ?? null, label: pathLabel, emoji: pathEmoji });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  function choose(id: PathId) {
    const option = pathOptions.find((p) => p.id === id);
    if (!option) return;
    userChangedRef.current = true;
    setSelected({ id: option.id, label: option.label, emoji: option.emoji });
    setModalOpen(false);
  }

  const otherOptions = pathOptions.filter((p) => p.id !== selected.id);

  return (
    <>
      <Pressable
        onPress={() => setModalOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Current learning path: ${selected.label}. Tap to change.`}
        accessibilityState={{ expanded: modalOpen }}
        style={({ pressed }) => [
          styles.pathBadge,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && styles.pathBadgePressed,
        ]}>
        <ThemedText style={styles.pathEmoji}>{selected.emoji}</ThemedText>
        <ThemedText style={styles.pathLabel} numberOfLines={1}>
          {selected.label}
        </ThemedText>
        <Ionicons name="chevron-down" size={13} color={theme.textSecondary} />
      </Pressable>

      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setModalOpen(false)}>
          <SafeAreaView style={styles.sheetWrap} edges={['bottom']}>
            <Pressable onPress={(e) => e.stopPropagation()} style={[styles.sheet, { backgroundColor: theme.backgroundElement }]}>
              <View style={styles.sheetHandle} />
              <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
                Currently studying
              </ThemedText>
              <View style={[styles.currentRow, { backgroundColor: theme.primaryMuted }]}>
                <ThemedText style={styles.rowEmoji}>{selected.emoji}</ThemedText>
                <ThemedText themeColor="primary" style={styles.currentRowText}>
                  {selected.label}
                </ThemedText>
              </View>

              <ThemedText themeColor="textSecondary" style={[styles.sectionLabel, styles.changeToLabel]}>
                Change to
              </ThemedText>
              {otherOptions.map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => choose(option.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch to ${option.label}`}
                  style={({ pressed }) => [styles.optionRow, pressed && { backgroundColor: theme.backgroundSelected }]}>
                  <ThemedText style={styles.rowEmoji}>{option.emoji}</ThemedText>
                  <ThemedText style={styles.optionText}>{option.label}</ThemedText>
                </Pressable>
              ))}
            </Pressable>
          </SafeAreaView>
        </Pressable>
      </Modal>
    </>
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
  pathBadgePressed: {
    opacity: 0.7,
  },
  pathEmoji: {
    fontSize: 12,
  },
  pathLabel: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetWrap: {
    width: '100%',
  },
  sheet: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    ...Shadow.raised,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(148,163,184,0.4)',
    marginBottom: Spacing.three,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: Spacing.two,
  },
  changeToLabel: {
    marginTop: Spacing.three,
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
  },
  currentRowText: {
    fontSize: 14,
    fontWeight: '800',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    minHeight: 44,
  },
  rowEmoji: {
    fontSize: 16,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
