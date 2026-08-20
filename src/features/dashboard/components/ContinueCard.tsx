import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow } from '@/constants/theme';

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
        <View style={styles.textGroup}>
          <ThemedText style={styles.eyebrow}>Continue studying</ThemedText>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.subtitle}>
            {subject} · Lesson {completedCount} of {total}
          </ThemedText>
        </View>

        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`Resume ${title}`}
          hitSlop={8}
          style={({ pressed }) => [styles.resumeLink, pressed && styles.resumeLinkPressed]}>
          <ThemedText style={styles.resumeText}>Resume</ThemedText>
          <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 12,
  },
  textGroup: {
    gap: 4,
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginTop: 2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
  },
  // A plain text link, not a pill button — the card is already the loudest
  // element on the screen, so the CTA doesn't need its own container too.
  resumeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    minHeight: 40,
  },
  resumeLinkPressed: {
    opacity: 0.7,
  },
  resumeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
