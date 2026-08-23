import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

// The subtle "Saved" confirmation the spec asks for wherever a setting
// auto-saves — no big Save button, just a brief teal checkmark next to
// the section header. useSavedFeedback().trigger() is called from every
// onChange handler that writes straight to a store (updateReaderSettings,
// updateReviewSettings, ...); the indicator renders itself only while
// visible, so screens that don't call trigger() never show it.
export function useSavedFeedback() {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function trigger() {
    if (timer.current) clearTimeout(timer.current);
    setVisible(true);
    timer.current = setTimeout(() => setVisible(false), 1600);
  }

  return { visible, trigger };
}

export function SavedIndicator({ visible }: { visible: boolean }) {
  const theme = useTheme();
  if (!visible) return null;
  return (
    <View style={styles.row}>
      <Ionicons name="checkmark-circle" size={13} color={theme.primary} />
      <ThemedText themeColor="primary" style={styles.text}>
        Saved
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
