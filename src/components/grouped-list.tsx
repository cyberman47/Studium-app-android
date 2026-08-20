import { Children, Fragment, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The white, bordered, iOS-Settings-style container for a stack of
// ListRows — one surface with hairline dividers between children instead
// of each row being its own card. Pass ListRows as children; a divider is
// inserted between each one automatically (none before the first or after
// the last).
export function GroupedList({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const rows = Children.toArray(children);
  return (
    <View style={[styles.shadowWrap, Shadow.card]}>
      <View style={[styles.group, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        {rows.map((row, index) => (
          <Fragment key={index}>
            {row}
            {index < rows.length - 1 && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  group: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
