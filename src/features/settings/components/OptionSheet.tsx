import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// A bottom-sheet option picker for longer lists inside a settings screen
// (Voice, in Reader) — same Modal + backdrop + rounded-sheet pattern
// already used by ImportSheet and AIChatScreen's lesson picker.
export function OptionSheet({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const theme = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close">
        <Pressable style={[styles.sheet, { backgroundColor: theme.backgroundElement }]} onPress={(e) => e.stopPropagation()}>
          <View style={styles.grabber} />
          <ThemedText style={styles.title}>{title}</ThemedText>
          {options.map((opt) => {
            const isSelected = opt === selected;
            return (
              <Pressable
                key={opt}
                onPress={() => {
                  onSelect(opt);
                  onClose();
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={opt}
                style={({ pressed }) => [styles.row, pressed && { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText style={[styles.rowText, isSelected && { color: theme.primary }]}>{opt}</ThemedText>
                {isSelected && <Ionicons name="checkmark" size={16} color={theme.primary} />}
              </Pressable>
            );
          })}
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            style={({ pressed }) => [styles.cancelButton, { borderColor: theme.border }, pressed && { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText style={styles.cancelText}>Cancel</ThemedText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, paddingHorizontal: Spacing.four, paddingTop: Spacing.two, paddingBottom: Spacing.five, gap: 2 },
  grabber: { width: 36, height: 4, borderRadius: Radius.pill, backgroundColor: 'rgba(15, 23, 42, 0.15)', alignSelf: 'center', marginBottom: Spacing.three },
  title: { fontSize: 16, fontWeight: '800', marginBottom: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 50, borderRadius: Radius.md, paddingHorizontal: 4 },
  rowText: { fontSize: 14, fontWeight: '600' },
  cancelButton: { alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 13, marginTop: Spacing.three },
  cancelText: { fontSize: 14, fontWeight: '700' },
});
