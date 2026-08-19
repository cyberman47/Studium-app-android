import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Full-width current-track selector, sitting on its own row below the
// header — the phone equivalent of the web header's LearningPathSwitcher
// dropdown (components/dashboard-shell.tsx). Chevron rotates on tap; wiring
// the actual track-switch menu is a later step, not part of this pass.
export function PathChip({ label, emoji }: { label: string; emoji: string }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      onPress={() => setOpen((o) => !o)}
      accessibilityRole="button"
      accessibilityLabel={`Current learning path: ${label}`}
      accessibilityState={{ expanded: open }}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        Shadow.card,
        pressed && styles.pressed,
      ]}>
      <ThemedText style={styles.emoji}>{emoji}</ThemedText>
      <View style={styles.labelCol}>
        <ThemedText style={styles.label}>{label}</ThemedText>
      </View>
      <Ionicons
        name="chevron-down"
        size={16}
        color={theme.textSecondary}
        style={open ? styles.chevronOpen : undefined}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    minHeight: 44,
  },
  pressed: {
    opacity: 0.85,
  },
  emoji: {
    fontSize: 16,
  },
  labelCol: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
});
