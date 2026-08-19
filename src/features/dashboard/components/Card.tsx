import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The one card surface every dashboard section is built from, so rounding,
// border, and elevation read as one consistent system rather than each
// section improvising its own.
//
// The shadow lives on its own outer wrapper rather than the content View:
// on Android, `elevation` + `borderRadius` on the same View that also
// holds text children can make the outline-based shadow clipping
// miscompute and clip part of that text. Splitting the elevated surface
// from the content surface sidesteps it entirely.
export function Card({ style, children, ...rest }: ViewProps) {
  const theme = useTheme();
  return (
    <View style={[styles.shadowWrap, Shadow.card]}>
      <View
        style={[
          styles.base,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          style,
        ]}
        {...rest}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  base: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
  },
});
