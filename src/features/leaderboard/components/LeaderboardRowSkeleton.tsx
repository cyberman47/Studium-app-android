import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/skeleton';
import { Radius } from '@/constants/theme';

// Mirrors LeaderboardCard's real Row exactly (rank badge, avatar circle,
// name + streak lines, trailing KP) so the list doesn't reflow once the
// real rows arrive — just repeated a handful of times while loading.
export function LeaderboardRowSkeleton() {
  return (
    <View style={styles.row}>
      <Skeleton width={24} height={24} radius={12} />
      <Skeleton width={32} height={32} radius={16} />
      <View style={styles.nameCol}>
        <Skeleton width="50%" height={13} radius={4} />
        <Skeleton width={32} height={11} radius={4} />
      </View>
      <Skeleton width={46} height={12} radius={Radius.sm} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 44,
  },
  nameCol: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
});
