import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Wrapped, compact chip selector for short option sets (text size,
// spacing, reading width, appearance, speed presets, ...) — the Studium
// teal selected state (#0F8B8D via theme.primary) applies the same way
// everywhere it's used.
export function PillGroup({
  options,
  selected,
  onSelect,
  getLabel = (o) => String(o),
}: {
  options: string[] | number[];
  selected: string | number;
  onSelect: (value: string) => void;
  getLabel?: (value: string | number) => string;
}) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const isSelected = opt === selected;
        return (
          <Pressable
            key={opt}
            onPress={() => onSelect(String(opt))}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={getLabel(opt)}
            style={[
              styles.pill,
              {
                borderColor: isSelected ? theme.primary : theme.border,
                backgroundColor: isSelected ? theme.primaryMuted : theme.backgroundElement,
              },
            ]}>
            <ThemedText style={[styles.pillText, isSelected && { color: theme.primary }]}>{getLabel(opt)}</ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
