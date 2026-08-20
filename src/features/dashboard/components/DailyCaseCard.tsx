import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';

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

        {/* Small metadata line instead of two separate pills — same
            information, one less pair of rounded containers to scan. */}
        <ThemedText style={styles.meta}>
          {category} · {difficulty}
        </ThemedText>

        <ThemedText style={styles.title} numberOfLines={3}>
          {title}
        </ThemedText>

        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Analyze today's case"
          hitSlop={8}
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}>
          <ThemedText style={styles.linkText}>Analyze Case</ThemedText>
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 16,
    paddingHorizontal: 18,
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
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  meta: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '400',
    marginTop: 6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: Spacing.two,
  },
  // Plain text link, matching ContinueCard's Resume — no pill background.
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 12,
    minHeight: 40,
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkText: {
    color: '#5EEAD4',
    fontSize: 13,
    fontWeight: '600',
  },
});
