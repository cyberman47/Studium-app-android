import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/skeleton';
import { Radius } from '@/constants/theme';

// Mirrors ListRow's exact shape (icon circle, two stacked text lines,
// trailing chevron) so a GroupedList mixing real rows and loading rows
// never jumps in height once the real ones arrive.
export function ListRowSkeleton() {
  return (
    <View style={styles.row}>
      <Skeleton width={32} height={32} radius={Radius.md} />
      <View style={styles.textCol}>
        <Skeleton width="55%" height={14} radius={4} />
        <Skeleton width="40%" height={12} radius={4} />
      </View>
      <Skeleton width={16} height={16} radius={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
    paddingVertical: 10,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
});
