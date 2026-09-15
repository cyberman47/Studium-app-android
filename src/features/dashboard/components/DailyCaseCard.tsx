import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { getCaseOfTheDay } from '@/features/dailycase/logic';
import { useTodayCaseAttempt } from '@/features/dailycase/store';

// Compact Home teaser — tapping it opens the full Daily Case experience
// (features/dailycase/DailyCaseScreen.tsx, /daily-case) as its own
// screen. Reads the same real, deterministically-rotating "case of the
// day" the full screen does (features/dailycase/logic.ts), so this
// card's title/category/difficulty never drift out of sync with what
// actually opens.
//
// getCaseOfTheDay can now genuinely return null — Medical Cases content
// was removed and clinicalCases.ts is intentionally empty pending a real
// Supabase-backed source (see logic.ts). Rather than crash on a null
// case's fields, this renders an honest "nothing to solve yet" state and
// isn't tappable, instead of opening a dead-end screen.
export function DailyCaseCard() {
  const router = useRouter();
  const todaysCase = useMemo(() => getCaseOfTheDay(), []);
  const attempt = useTodayCaseAttempt();
  const solved = !!todaysCase && !!attempt && attempt.caseId === todaysCase.id;

  if (!todaysCase) {
    return (
      <View style={[styles.shadowWrap, Shadow.raised]}>
        <View style={[styles.card, styles.cardDisabled]}>
          <Ionicons name="pulse" size={90} color="rgba(255,255,255,0.05)" style={styles.watermark} />
          <View style={styles.iconCircle}>
            <Ionicons name="pulse-outline" size={16} color="#5EEAD4" />
          </View>
          <View style={styles.textCol}>
            <ThemedText numberOfLines={1} style={styles.eyebrow}>
              DAILY CASE
            </ThemedText>
            <ThemedText style={styles.title} numberOfLines={2}>
              No case available right now
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.shadowWrap, Shadow.raised]}>
      <Pressable
        onPress={() => router.push('/daily-case')}
        accessibilityRole="button"
        accessibilityLabel={`Daily case challenge: ${todaysCase.title}, ${todaysCase.category}, ${todaysCase.difficulty}${solved ? ', solved today' : ''}`}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <Ionicons name="pulse" size={90} color="rgba(255,255,255,0.05)" style={styles.watermark} />

        <View style={styles.iconCircle}>
          <Ionicons name={solved ? 'checkmark' : 'pulse-outline'} size={16} color="#5EEAD4" />
        </View>

        <View style={styles.textCol}>
          <ThemedText numberOfLines={1} style={styles.eyebrow}>
            DAILY CASE{' '}
            <ThemedText style={styles.eyebrowMeta}>
              · {todaysCase.category} · {todaysCase.difficulty}
            </ThemedText>
          </ThemedText>
          <ThemedText style={styles.title} numberOfLines={2}>
            {todaysCase.title}
          </ThemedText>
        </View>

        <Ionicons name="chevron-forward" size={16} color="#5EEAD4" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
    backgroundColor: '#0F172A',
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 14,
    paddingHorizontal: 18,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  watermark: {
    position: 'absolute',
    right: -16,
    top: -16,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(94, 234, 212, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  eyebrow: {
    color: '#5EEAD4',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  eyebrowMeta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '400',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
});
