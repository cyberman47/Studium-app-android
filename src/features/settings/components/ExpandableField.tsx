import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// No UIManager.setLayoutAnimationEnabledExperimental() call here — that
// flag only matters for the old Android bridge and is a no-op (with a
// console warning) on the New Architecture this app runs on, where
// LayoutAnimation works without it.

// Collapsed-by-default field for any setting with 3+ choices: shows the
// current value as a one-line summary and expands in place — on tap — to
// reveal the full picker (a PillGroup, a SelectableRow list, or custom
// content like the Custom flashcard-count input). Used throughout
// Settings > General/Reader/Review instead of leaving every option list
// permanently visible, which was the complaint this replaces: screens
// like Review's Question Types were "all on the screen" at once.
export function ExpandableField({
  title,
  summary,
  children,
  disabled = false,
  defaultExpanded = false,
}: {
  title: string;
  summary: string;
  children: React.ReactNode;
  disabled?: boolean;
  defaultExpanded?: boolean;
}) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  // A field that becomes disabled (e.g. TTS's Language/Speed while the
  // master toggle is off) shouldn't stay expanded showing controls the
  // user can no longer interact with.
  useEffect(() => {
    if (disabled && expanded) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  function toggle() {
    if (disabled) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  }

  return (
    <View style={[styles.card, Shadow.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }, disabled && styles.disabled]}>
      <Pressable
        onPress={toggle}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ expanded, disabled }}
        accessibilityLabel={title}
        style={styles.header}>
        <View style={styles.textCol}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.summary} numberOfLines={1}>
            {summary}
          </ThemedText>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={theme.textSecondary} />
      </Pressable>
      {expanded && (
        <>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.content}>{children}</View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: 13,
  },
  textCol: { flex: 1, minWidth: 0 },
  title: { fontSize: 13, fontWeight: '700' },
  summary: { fontSize: 12, marginTop: 1 },
  divider: { height: StyleSheet.hairlineWidth },
  content: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two, paddingBottom: Spacing.three },
  disabled: { opacity: 0.45 },
});
