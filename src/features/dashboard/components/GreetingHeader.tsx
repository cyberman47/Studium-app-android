import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { type PathId, pathOptions } from '@/constants/paths';
import { useTheme } from '@/hooks/use-theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Deliberately minimal: just the greeting and the path switcher stacked
// underneath it. No "YOUR DASHBOARD" label — the user is obviously on the
// dashboard, so that pill was pure noise above the one thing that matters.
//
// The badge is a real switcher, not just a label — tapping it opens the
// same "Currently studying / Change to" picker as the web app's
// LearningPathSwitcher (components/dashboard-shell.tsx), listing all
// seven tracks from constants/paths.ts.
export function GreetingHeader({
  name,
  pathLabel,
  pathEmoji,
}: {
  name: string;
  pathLabel: string;
  pathEmoji: string;
}) {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  // Seeded from props (the mock "currently studying" path) but owns the
  // selection from here on — there's no backend to round-trip this
  // through yet, same as every other mock-data screen in this app. The id
  // has to be resolved up front (matched against pathOptions by label),
  // not left null, or the "Change to" list below won't know to exclude
  // the currently-studying option and shows it twice.
  const [selected, setSelected] = useState<{ id: PathId | null; label: string; emoji: string }>(() => {
    const match = pathOptions.find((p) => p.label === pathLabel);
    return { id: match?.id ?? null, label: pathLabel, emoji: pathEmoji };
  });

  function choose(id: PathId) {
    const option = pathOptions.find((p) => p.id === id);
    if (!option) return;
    setSelected({ id: option.id, label: option.label, emoji: option.emoji });
    setModalOpen(false);
  }

  const otherOptions = pathOptions.filter((p) => p.id !== selected.id);

  return (
    <View style={styles.col}>
      <ThemedText style={styles.greeting}>
        {getGreeting()}, {name} 👋
      </ThemedText>
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
            <Pressable
              // Swallows taps so pressing inside the sheet doesn't fall
              // through to the overlay's dismiss handler.
              onPress={(e) => e.stopPropagation()}
              style={[styles.sheet, { backgroundColor: theme.backgroundElement }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 29,
    letterSpacing: -0.3,
  },
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
