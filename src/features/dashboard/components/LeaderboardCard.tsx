import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { LeaderboardRow } from '../data';

import { Card } from './Card';

const rankColors = ['#F59E0B', '#94A3B8', '#EA580C'];

function Row({ row, rank }: { row: LeaderboardRow; rank: number }) {
  const theme = useTheme();
  const medalColor = rank <= 3 ? rankColors[rank - 1] : undefined;

  return (
    <View
      style={[styles.row, row.isYou && { backgroundColor: theme.primaryMuted }]}
      accessibilityLabel={`Rank ${rank}, ${row.name}, ${row.totalKP} knowledge points, ${row.streak} day streak${row.isYou ? ', this is you' : ''}`}>
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
    </View>
  );
}

export function LeaderboardCard({ rows }: { rows: LeaderboardRow[] }) {
  const theme = useTheme();
  return (
    <Card style={{ padding: Spacing.three }}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="trophy" size={13} color={theme.amber} />
          <ThemedText themeColor="textSecondary" style={styles.headerText}>
            LEADERBOARD
          </ThemedText>
        </View>
      </View>

      <View style={styles.list}>
        {rows.map((row, i) => (
          <Row key={row.id} row={row} rank={i + 1} />
        ))}
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
    fontWeight: '800',
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
    fontWeight: '800',
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
    fontWeight: '800',
  },
  nameCol: {
    flex: 1,
    gap: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
  },
  youTag: {
    fontSize: 10,
    fontWeight: '800',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '700',
  },
  kp: {
    fontSize: 12,
    fontWeight: '800',
  },
});
