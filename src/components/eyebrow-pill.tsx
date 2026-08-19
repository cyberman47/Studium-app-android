import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Matches the web app's shared `.eyebrow` class (app/globals.css): a small
// teal pill badge — white/card surface, teal-tinted border, teal uppercase
// label, soft shadow. Used for section labels like "Your Dashboard" and
// "Your Performance" on the real dashboard, not plain unstyled text.
export function EyebrowPill({ emoji, label }: { emoji?: string; label: string }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: theme.backgroundElement, borderColor: theme.primaryMuted },
        Shadow.card,
      ]}>
      {emoji ? <ThemedText style={styles.emoji}>{emoji}</ThemedText> : null}
      <ThemedText themeColor="primary" style={styles.label}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
  },
  emoji: {
    fontSize: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
