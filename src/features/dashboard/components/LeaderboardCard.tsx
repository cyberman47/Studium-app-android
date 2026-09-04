import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { LeaderboardRow } from '../data';

import { Card } from './Card';

const rankColors = ['#F59E0B', '#94A3B8', '#EA580C'];
const medalEmoji = ['🥇', '🥈', '🥉'];

function Row({ row, rank }: { row: LeaderboardRow; rank: number }) {
  const theme = useTheme();
  const router = useRouter();
  const medalColor = rank <= 3 ? rankColors[rank - 1] : undefined;
  const label = `Rank ${rank}, ${row.name}, ${row.totalKP} knowledge points, ${row.streak} day streak${row.isYou ? ', this is you' : ''}. View profile.`;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/student/[id]',
          params: { id: row.id, name: row.name, totalKP: String(row.totalKP), streak: String(row.streak), rank: String(rank), isYou: row.isYou ? '1' : '0' },
        })
      }
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.row,
        row.isYou && { backgroundColor: theme.primaryMuted },
        pressed && !row.isYou && { backgroundColor: theme.backgroundSelected },
      ]}
      accessibilityLabel={label}>
      <View
        style={[
          styles.rankBadge,
          { backgroundColor: medalColor ? `${medalColor}33` : theme.backgroundSelected },
        ]}>
        {medalColor ? (
          <Ionicons name="medal" size={12} color={medalColor} />
        ) : (
          <ThemedText style={styles.rankText}>{rank}</ThemedText>
        )}
      </View>

      <View style={[styles.avatar, { backgroundColor: row.isYou ? theme.primary : theme.backgroundSelected }]}>
        <ThemedText style={[styles.avatarText, row.isYou && { color: '#FFFFFF' }]}>
          {row.name.slice(0, 1).toUpperCase()}
        </ThemedText>
      </View>

      <View style={styles.nameCol}>
        <ThemedText numberOfLines={1} style={styles.name}>
          {row.name}
          {row.isYou && <ThemedText themeColor="primary" style={styles.youTag}>  YOU</ThemedText>}
        </ThemedText>
        <View style={styles.streakRow}>
          <Ionicons name="flame" size={11} color={theme.amber} />
          <ThemedText themeColor="textSecondary" style={styles.streakText}>
            {row.streak}d
          </ThemedText>
        </View>
      </View>

      <ThemedText themeColor="textSecondary" style={styles.kp}>
        {row.totalKP.toLocaleString()} KP
      </ThemedText>
      <Ionicons name="chevron-forward" size={14} color={theme.textSecondary} />
    </Pressable>
  );
}

// Not rendered on Home anymore — it now shows a single row inside
// HomeListSection's grouped list. Kept here (both the `minimal` glance
// and the full row list) as the fuller destination a leaderboard row's
// chevron routes to (features/leaderboard/LeaderboardScreen.tsx). Each
// full row is itself tappable now too, opening that student's real
// profile (features/leaderboard/StudentProfileScreen.tsx) — see Row's
// onPress below.
export function LeaderboardCard({ rows, minimal = false }: { rows: LeaderboardRow[]; minimal?: boolean }) {
  const theme = useTheme();

  if (minimal) {
    const top = rows[0];
    if (!top) return null;
    return (
      <View style={styles.minimalWrap}>
        <ThemedText themeColor="textSecondary" style={styles.minimalLabel}>
          LEADERBOARD
        </ThemedText>
        <View style={styles.minimalRow}>
          <ThemedText style={styles.minimalMedal}>{medalEmoji[0]}</ThemedText>
          <ThemedText numberOfLines={1} style={styles.minimalName}>
            {top.name}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.minimalKp}>
            {top.totalKP.toLocaleString()} KP
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="trophy" size={13} color={theme.amber} />
          <ThemedText themeColor="textSecondary" style={styles.headerText}>
            LEADERBOARD
          </ThemedText>
        </View>
      </View>

      <View style={styles.list}>
        {rows.map((row) => {
          const rank = rows.findIndex((r) => r.id === row.id) + 1;
          return <Row key={row.id} row={row} rank={rank} />;
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.two,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  list: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    minHeight: 44,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 11,
    fontWeight: '700',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
  },
  nameCol: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
  },
  youTag: {
    fontSize: 10,
    fontWeight: '700',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '500',
  },
  kp: {
    fontSize: 12,
    fontWeight: '700',
  },
  // Minimal (home screen) variant: no card surface, no avatar — just a
  // label and a single plain-text row, so it reads as a lightweight glance
  // rather than another bordered container.
  minimalWrap: {
    gap: 6,
  },
  minimalLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  minimalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  minimalMedal: {
    fontSize: 16,
  },
  minimalName: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: '600',
  },
  minimalKp: {
    fontSize: 13,
    fontWeight: '500',
  },
});
