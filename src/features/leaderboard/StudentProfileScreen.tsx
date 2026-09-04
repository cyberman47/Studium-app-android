import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getLevelInfo } from '@/lib/level';

// Reached by tapping a row on the Leaderboard. Real data, deliberately
// limited to exactly what public.leaderboard actually exposes for other
// students (supabase/migrations/0002_leaderboard.sql: id/name/total_kp/
// current_streak only) — that view is a narrow, intentional privacy
// carve-out from profiles' own strict "owner only" RLS, so this screen
// never asks for (or shows) anything beyond those three real fields plus
// this student's real rank, which is just this row's position in the
// already-fetched leaderboard list. No education_track, avatar, or join
// date — those genuinely aren't queryable for anyone but yourself, so
// this doesn't fabricate them the way a typical "profile screen" mock
// would.
export function StudentProfileScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ id: string; name: string; totalKP: string; streak: string; rank: string; isYou?: string }>();

  const name = params.name || 'Student';
  const totalKP = Number(params.totalKP) || 0;
  const streak = Number(params.streak) || 0;
  const rank = Number(params.rank) || 0;
  const isYou = params.isYou === '1';
  const { level, levelName } = getLevelInfo(totalKP);
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title={isYou ? 'You' : 'Student'} />

          <View style={styles.identity}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <ThemedText style={styles.avatarText}>{initial}</ThemedText>
            </View>
            <ThemedText style={styles.name}>{name}</ThemedText>
            {rank > 0 && (
              <View style={[styles.rankPill, { backgroundColor: theme.amberMuted }]}>
                <Ionicons name="trophy" size={12} color={theme.amber} />
                <ThemedText themeColor="amber" style={styles.rankText}>
                  Rank #{rank} this week
                </ThemedText>
              </View>
            )}
            <View style={[styles.levelPill, { backgroundColor: theme.primaryMuted }]}>
              <ThemedText themeColor="primary" style={styles.levelText}>
                Level {level} · {levelName}
              </ThemedText>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={[styles.statChip, Shadow.card, { backgroundColor: theme.primaryMuted }]}>
              <Ionicons name="flash" size={18} color={theme.primary} />
              <ThemedText style={styles.statValue}>{totalKP.toLocaleString()}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.statLabel}>
                Total Knowledge Points
              </ThemedText>
            </View>
            <View style={[styles.statChip, Shadow.card, { backgroundColor: theme.amberMuted }]}>
              <Ionicons name="flame" size={18} color={theme.amber} />
              <ThemedText style={styles.statValue}>{streak}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.statLabel}>
                Day Streak
              </ThemedText>
            </View>
          </View>

          <View style={[styles.noteBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Ionicons name="lock-closed-outline" size={14} color={theme.textSecondary} />
            <ThemedText themeColor="textSecondary" style={styles.noteText}>
              Only rank, Knowledge Points, and streak are shared on the leaderboard — everything else on a
              student's account stays private.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: 480, paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: Spacing.four },
  identity: { alignItems: 'center', gap: 10, paddingTop: Spacing.two },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rankText: { fontSize: 12, fontWeight: '700' },
  levelPill: {
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  levelText: { fontSize: 12, fontWeight: '700' },
  statRow: { flexDirection: 'row', gap: 12 },
  statChip: {
    flex: 1,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 4,
  },
  statValue: { fontSize: 22, fontWeight: '800', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center', paddingHorizontal: 8 },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
