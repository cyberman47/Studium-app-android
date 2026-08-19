import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';

export function ContinueCard({
  subject,
  title,
  completedCount,
  total,
  onPress,
}: {
  subject: string;
  title: string;
  completedCount: number;
  total: number;
  onPress?: () => void;
}) {
  return (
    <View style={[styles.shadowWrap, Shadow.raised]}>
      <LinearGradient
        colors={['#0F8B8D', '#0B6467']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}>
        <View style={styles.badge}>
          <Ionicons name="flash" size={12} color="#FFFFFF" />
          <ThemedText style={styles.badgeText}>Continue Studying</ThemedText>
        </View>

        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.subtitle}>
          Next lesson · {completedCount} / {total} in {subject}
        </ThemedText>

        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`Resume ${title}`}
          hitSlop={8}
          style={({ pressed }) => [styles.resumeButton, pressed && styles.resumeButtonPressed]}>
          <Ionicons name="play" size={13} color="#0C6C6E" />
          <ThemedText style={styles.resumeText}>Resume</ThemedText>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: 5,
    marginBottom: Spacing.two,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    marginBottom: Spacing.three,
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    minHeight: 44,
  },
  resumeButtonPressed: {
    opacity: 0.85,
  },
  resumeText: {
    color: '#0C6C6E',
    fontSize: 14,
    fontWeight: '800',
  },
});
