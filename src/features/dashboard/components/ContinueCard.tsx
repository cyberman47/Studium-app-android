import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow } from '@/constants/theme';

// completedCount is a real count of lessons actually finished — 0 means
// exactly that, not "on lesson zero." At 0 the card honestly reads as
// "Start Learning" pointed at lesson 1, rather than claiming mid-course
// progress that hasn't happened; once completedCount > 0 it switches to
// "Continue studying" and resumes at the next lesson in line. Today
// nothing in the app can actually mark a lesson complete yet, so every
// real student sees the Start state — this only starts showing "Continue"
// once that tracking exists.
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
  const started = completedCount > 0;
  const currentLessonNumber = Math.min(completedCount + 1, total);

  return (
    <View style={[styles.shadowWrap, Shadow.raised]}>
      <LinearGradient
        colors={['#0F8B8D', '#0B6467']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}>
        <View style={styles.textGroup}>
          <ThemedText style={styles.eyebrow}>{started ? 'Continue studying' : 'Start learning'}</ThemedText>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.subtitle}>
            {subject} · Lesson {currentLessonNumber} of {total}
          </ThemedText>
        </View>

        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${started ? 'Resume' : 'Start'} ${title}`}
          hitSlop={8}
          style={({ pressed }) => [styles.resumeLink, pressed && styles.resumeLinkPressed]}>
          <ThemedText style={styles.resumeText}>{started ? 'Resume' : 'Start'}</ThemedText>
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
