import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';

// Each difficulty gets its own readable tint (translucent background +
// matching light text color), not one uniform white/85 label regardless
// of hue — the previous version was hard to read at a glance since amber
// and rose both rendered in the same washed-out white.
const difficultyStyles: Record<string, { bg: string; text: string }> = {
  Beginner: { bg: 'rgba(16, 185, 129, 0.18)', text: '#6EE7B7' },
  Intermediate: { bg: 'rgba(245, 158, 11, 0.18)', text: '#FCD34D' },
  Advanced: { bg: 'rgba(244, 63, 94, 0.18)', text: '#FDA4AF' },
};

export function DailyCaseCard({
  title,
  category,
  difficulty,
  onPress,
}: {
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  onPress?: () => void;
}) {
  return (
    <View style={[styles.shadowWrap, Shadow.raised]}>
      <View style={styles.card}>
        <Ionicons
          name="pulse"
          size={110}
          color="rgba(255,255,255,0.05)"
          style={styles.watermark}
        />
        <ThemedText style={styles.eyebrow}>Daily Case Challenge</ThemedText>

        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <ThemedText style={styles.categoryChipText}>{category}</ThemedText>
          </View>
          <View style={[styles.chip, { backgroundColor: difficultyStyles[difficulty].bg }]}>
            <ThemedText style={[styles.chipText, { color: difficultyStyles[difficulty].text }]}>
              {difficulty}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.title} numberOfLines={2}>
          {title}
        </ThemedText>

        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Analyze today's case"
          hitSlop={8}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <ThemedText style={styles.buttonText}>Analyze Case</ThemedText>
          <Ionicons name="arrow-forward" size={14} color="#5EEAD4" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: Radius.lg,
    padding: Spacing.four,
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    right: -20,
    top: -20,
  },
  eyebrow: {
    color: '#5EEAD4',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: Spacing.two,
  },
  chip: {
    // Bumped from /10 to /16 for better contrast against the dark card.
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '800',
  },
  categoryChipText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginTop: Spacing.two,
  },
  // A real secondary button now, not a bare text+icon link — same pill
  // shape and touch target as the primary CTAs, just translucent instead
  // of solid white since it sits on an already-dark card.
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(94, 234, 212, 0.14)',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    marginTop: Spacing.three,
    minHeight: 44,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#5EEAD4',
    fontSize: 13,
    fontWeight: '800',
  },
});
