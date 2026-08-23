import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Two floating action buttons that sit above the tab bar on Home only:
// a "+" on the left into the Create tab (a small quick-create shortcut,
// per the desktop-aligned IA — Create itself is the dedicated screen;
// this FAB used to open ImportSheet directly, a 2-option bottom sheet,
// now superseded by Create's fuller 5-option screen), and an "Ask AI"
// pill on the right into Studium AI (see features/aichat). Positioned
// absolute over the ScrollView rather than inside it, so they stay put
// while the page scrolls underneath them — the standard FAB pattern.
export function HomeFabs({ onPressCreate, onPressAI }: { onPressCreate: () => void; onPressAI: () => void }) {
  const theme = useTheme();
  return (
    <View style={styles.row} pointerEvents="box-none">
      <View style={[styles.plusShadow, Shadow.raised]}>
        <Pressable
          onPress={onPressCreate}
          accessibilityRole="button"
          accessibilityLabel="Create study material"
          style={({ pressed }) => [
            styles.plusButton,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            pressed && { backgroundColor: theme.backgroundSelected },
          ]}>
          <Ionicons name="add" size={24} color={theme.text} />
        </Pressable>
      </View>

      <View style={[styles.aiShadow, Shadow.raised]}>
        <Pressable
          onPress={onPressAI}
          accessibilityRole="button"
          accessibilityLabel="Ask Studium AI"
          style={({ pressed }) => [
            styles.aiButton,
            { backgroundColor: theme.primary },
            pressed && styles.aiButtonPressed,
          ]}>
          <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          <ThemedText style={styles.aiButtonText}>Ask AI</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    // The tab bar already reserves its own space below this screen's
    // SafeAreaView (it doesn't overlay content), so this only needs a
    // small gap off the container's real bottom edge — not
    // BottomTabInset again, which double-counted the tab bar height and
    // left the buttons stranded mid-screen instead of anchored near the
    // tab bar.
    bottom: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
  },
  plusShadow: {
    borderRadius: Radius.pill,
  },
  plusButton: {
    width: 52,
    height: 52,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiShadow: {
    borderRadius: Radius.pill,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 52,
    borderRadius: Radius.pill,
    paddingHorizontal: 20,
  },
  aiButtonPressed: {
    opacity: 0.9,
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
