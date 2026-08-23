import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ReviewSection = 'flashcards' | 'quizzes' | 'terminology';

const segments: { key: ReviewSection; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'flashcards', label: 'Flashcards', icon: 'albums-outline' },
  { key: 'quizzes', label: 'Quizzes', icon: 'checkbox-outline' },
  { key: 'terminology', label: 'Terminology', icon: 'book-outline' },
];

// Three large segmented buttons at the top of the Review tab — all three
// destinations (Flashcards/Quizzes/Terminology) stay reachable from this
// one screen, switching which panel renders below rather than pushing to
// a separate route per section.
export function ReviewSegmentedControl({ value, onChange }: { value: ReviewSection; onChange: (v: ReviewSection) => void }) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      {segments.map((segment) => {
        const active = segment.key === value;
        return (
          <View key={segment.key} style={[styles.shadowWrap, Shadow.card]}>
            <Pressable
              onPress={() => onChange(segment.key)}
              accessibilityRole="button"
              accessibilityLabel={segment.label}
              accessibilityState={{ selected: active }}
              style={[
                styles.segment,
                {
                  backgroundColor: active ? theme.primaryMuted : theme.backgroundElement,
                  borderColor: active ? theme.primary : theme.border,
                },
              ]}>
              <Ionicons name={segment.icon} size={20} color={active ? theme.primary : theme.textSecondary} />
              <ThemedText themeColor={active ? 'primary' : 'textSecondary'} style={styles.label} numberOfLines={1}>
                {segment.label}
              </ThemedText>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  shadowWrap: {
    flex: 1,
    borderRadius: Radius.lg,
  },
  segment: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    paddingVertical: 14,
    minHeight: 76,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
});
