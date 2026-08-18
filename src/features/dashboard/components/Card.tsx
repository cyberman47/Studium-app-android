import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The one card surface every dashboard section is built from, so rounding,
// border, and elevation read as one consistent system rather than each
// section improvising its own.
export function Card({ style, children, ...rest }: ViewProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
  },
});
