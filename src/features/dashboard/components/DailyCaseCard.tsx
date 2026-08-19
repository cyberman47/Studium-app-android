import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';

const difficultyColors: Record<string, string> = {
  Beginner: 'rgba(16, 185, 129, 0.2)',
  Intermediate: 'rgba(245, 158, 11, 0.2)',
  Advanced: 'rgba(244, 63, 94, 0.2)',
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
            <ThemedText style={styles.chipText}>{category}</ThemedText>
          </View>
          <View style={[styles.chip, { backgroundColor: difficultyColors[difficulty] }]}>
            <ThemedText style={styles.chipText}>{difficulty}</ThemedText>
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
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}>
          <ThemedText style={styles.linkText}>Analyze Case</ThemedText>
          <Ionicons name="arrow-forward" size={14} color="#2DD4BF" />
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  chipText: {
    color: 'rgba(255,255,255,0.85)',
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
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: Spacing.three,
    minHeight: 32,
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkText: {
    color: '#2DD4BF',
    fontSize: 13,
    fontWeight: '800',
  },
});
