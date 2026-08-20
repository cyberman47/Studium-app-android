import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { LeaderboardRow } from '../data';

import { Card } from './Card';

const rankColors = ['#F59E0B', '#94A3B8', '#EA580C'];

function Row({ row, rank, compact }: { row: LeaderboardRow; rank: number; compact: boolean }) {
  const theme = useTheme();
  const medalColor = rank <= 3 ? rankColors[rank - 1] : undefined;
  const label = `Rank ${rank}, ${row.name}, ${row.totalKP} knowledge points, ${row.streak} day streak${row.isYou ? ', this is you' : ''}`;

  // Compact (the two-column phone layout, ~170px card width): name and KP
  // each get their own full-width line instead of competing for space in
  // one row — cramming avatar+rank+name+streak+KP into one ~140px-wide
  // line left the name column with zero space and rendered blank.
  if (compact) {
    return (
      <View
        style={[styles.compactRow, row.isYou && { backgroundColor: theme.primaryMuted }]}
        accessibilityLabel={label}>
        <View style={styles.compactTop}>
          <View style={[styles.avatarSm, { backgroundColor: row.isYou ? theme.primary : theme.backgroundSelected }]}>
            <ThemedText style={[styles.avatarText, row.isYou && { color: '#FFFFFF' }]}>
              {row.name.slice(0, 1).toUpperCase()}
            </ThemedText>
          </View>
          <ThemedText numberOfLines={1} style={styles.compactName}>
            {row.name}
            {row.isYou && <ThemedText themeColor="primary" style={styles.youTag}> YOU</ThemedText>}
          </ThemedText>
        </View>
        <View style={styles.compactMeta}>
          <View style={styles.streakRow}>
            <Ionicons name="flame" size={10} color={theme.amber} />
            <ThemedText themeColor="textSecondary" style={styles.streakText}>
              {row.streak}d
            </ThemedText>
          </View>
          <ThemedText themeColor="textSecondary" style={styles.kpCompact}>
            {row.totalKP.toLocaleString()} KP
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.row, row.isYou && { backgroundColor: theme.primaryMuted }]}
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
    </View>
  );
}

// `compact` trims the list to the top row (plus your own row if you're not
// already in it) — used in the two-column phone layout where the full
// list reads too tall for a ~170px-wide column.
export function LeaderboardCard({ rows, compact = false }: { rows: LeaderboardRow[]; compact?: boolean }) {
  const theme = useTheme();
  const visibleRows = compact ? rows.filter((row, i) => i === 0 || row.isYou) : rows;
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
        {visibleRows.map((row) => {
          const rank = rows.findIndex((r) => r.id === row.id) + 1;
          return <Row key={row.id} row={row} rank={rank} compact={compact} />;
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
    fontWeight: '800',
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
    minWidth: 0,
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
  // Compact (two-column phone) row: avatar + name on their own line,
  // streak + KP on the line below — nothing has to share horizontal
  // space with a sibling that would otherwise starve it.
  compactRow: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    gap: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  compactTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatarSm: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactName: {
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    fontWeight: '700',
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 28,
  },
  kpCompact: {
    fontSize: 11,
    fontWeight: '800',
  },
});
