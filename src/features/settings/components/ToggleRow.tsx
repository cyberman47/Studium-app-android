import { StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// A title(+description) row with a trailing Switch — used throughout
// Settings wherever a preference is a plain on/off (same visual language
// as features/notifications/NotificationsScreen.tsx's row, generalized so
// every settings screen shares one implementation).
export function ToggleRow({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {description && (
          <ThemedText themeColor="textSecondary" style={styles.description}>
            {description}
          </ThemedText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.border, true: theme.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    minHeight: 56,
    paddingVertical: 10,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
  },
});
