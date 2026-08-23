import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Full-width selectable card — radio-style (single) or checkbox-style
// (multiple) trailing indicator — for longer-text option lists (language,
// review mode, what's included, question types, review order). Same
// visual language as the onboarding flow's option cards: teal border +
// tinted fill + a filled circle/checkmark when selected.
export function SelectableRow({
  label,
  description,
  selected,
  multiple = false,
  onPress,
}: {
  label: string;
  description?: string;
  selected: boolean;
  multiple?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.shadow, Shadow.card]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={label}
        style={[
          styles.row,
          {
            borderColor: selected ? theme.primary : theme.border,
            backgroundColor: selected ? theme.primaryMuted : theme.backgroundElement,
          },
        ]}>
        <View style={styles.textCol}>
          <ThemedText style={[styles.label, selected && { color: theme.primary }]}>{label}</ThemedText>
          {description && (
            <ThemedText themeColor="textSecondary" style={styles.description}>
              {description}
            </ThemedText>
          )}
        </View>
        <View
          style={[
            multiple ? styles.checkbox : styles.radio,
            selected ? { borderColor: theme.primary, backgroundColor: theme.primary } : { borderColor: theme.border },
          ]}>
          {selected && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: Radius.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    fontSize: 11,
    lineHeight: 15,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
