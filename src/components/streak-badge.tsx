import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Single combined pill for the header — "🔥 12d · 35/50 KP" — matching the
// web header's real StudyStreak trigger button (components/
// dashboard-shell.tsx), teal once today's target is hit, amber while it's
// still in progress. Tapping it opens Progress, same as the web trigger.
export function StreakBadge({
  streakDays,
  todayKP,
  targetKP,
  onPress,
}: {
  streakDays: number;
  todayKP: number;
  targetKP: number;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const secured = todayKP >= targetKP;
  const bg = secured ? theme.primaryMuted : theme.amberMuted;
  const color = secured ? theme.primary : theme.amber;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.pill, { backgroundColor: bg }, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${streakDays} day streak, ${todayKP} of ${targetKP} knowledge points today. View progress.`}>
      <Ionicons name="flame" size={11} color={theme.amber} />
      <ThemedText style={[styles.text, { color }]}>
        {streakDays}d · {todayKP}/{targetKP} KP
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Shrunk so this reads as secondary info next to the logo, not a
  // competing headline element in the header.
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
