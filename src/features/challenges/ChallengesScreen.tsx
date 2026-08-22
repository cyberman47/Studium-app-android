import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { type Challenge, metricIcons, mockChallenges } from './data';

function ChallengeCard({ challenge, onToggle }: { challenge: Challenge; onToggle: () => void }) {
  const theme = useTheme();
  const percent = Math.min(100, Math.round((challenge.currentValue / challenge.targetValue) * 100));
  return (
    <View style={[styles.shadowWrap, Shadow.card]}>
      <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <View style={styles.topRow}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
            <Ionicons name={metricIcons[challenge.metric]} size={18} color={theme.primary} />
          </View>
          <Pressable
            onPress={onToggle}
            accessibilityRole="button"
            accessibilityLabel={challenge.joined ? `Leave ${challenge.title}` : `Join ${challenge.title}`}
            style={({ pressed }) => [
              styles.joinButton,
              challenge.joined
                ? { borderWidth: StyleSheet.hairlineWidth, borderColor: theme.border }
                : { backgroundColor: theme.primary },
              pressed && styles.joinButtonPressed,
            ]}>
            <ThemedText style={[styles.joinButtonText, { color: challenge.joined ? theme.textSecondary : '#FFFFFF' }]}>
              {challenge.joined ? 'Joined' : 'Join'}
            </ThemedText>
          </Pressable>
        </View>

        <ThemedText style={styles.title}>{challenge.title}</ThemedText>
        <ThemedText themeColor="textSecondary" numberOfLines={2} style={styles.description}>
          {challenge.description}
        </ThemedText>

        <View style={styles.progressRow}>
          <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
            <View style={[styles.fill, { width: `${percent}%`, backgroundColor: theme.primary }]} />
          </View>
          <ThemedText themeColor="textSecondary" style={styles.progressText}>
            {challenge.currentValue.toLocaleString()}/{challenge.targetValue.toLocaleString()}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

// The mobile equivalent of the web app's Community Challenges
// (app/dashboard/(main)/community/challenges/page.tsx) — same six real
// challenges (supabase/migrations/0010_challenges.sql), same real
// join/leave toggle, progress mocked against the same 110 KP / 5-of-9
// Biology lessons the rest of this mock profile uses.
export function ChallengesScreen() {
  const theme = useTheme();
  const [challenges, setChallenges] = useState(mockChallenges);

  function toggle(id: string) {
    setChallenges((prev) => prev.map((c) => (c.id === id ? { ...c, joined: !c.joined } : c)));
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Challenges" />
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Join a challenge and track real progress.
          </ThemedText>

          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} onToggle={() => toggle(challenge.id)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: Spacing.six,
  },
  inner: {
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 12,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: -8,
  },
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButton: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: 7,
    minHeight: 32,
    justifyContent: 'center',
  },
  joinButtonPressed: {
    opacity: 0.8,
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  track: {
    flex: 1,
    height: 5,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
