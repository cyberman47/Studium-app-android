import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The bottom sheet Home's "+" button opens: add your own note or
// flashcard set. RN's core Modal, no new dependency — same approach as
// every other new-this-session screen (Share, Linking, Switch elsewhere).
export function ImportSheet({
  visible,
  onClose,
  onSelectNote,
  onSelectFlashcards,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectNote: () => void;
  onSelectFlashcards: () => void;
}) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close">
        <Pressable
          style={[styles.sheet, { backgroundColor: theme.backgroundElement }]}
          onPress={(event) => event.stopPropagation()}>
          <View style={styles.grabber} />
          <ThemedText style={styles.title}>Add to your library</ThemedText>

          <Pressable
            onPress={onSelectNote}
            accessibilityRole="button"
            accessibilityLabel="New note"
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: theme.backgroundSelected }]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
              <Ionicons name="document-text-outline" size={18} color={theme.primary} />
            </View>
            <View style={styles.rowText}>
              <ThemedText style={styles.rowTitle}>New Note</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.rowSubtitle}>
                Write something down to study later
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
          </Pressable>

          <Pressable
            onPress={onSelectFlashcards}
            accessibilityRole="button"
            accessibilityLabel="New flashcard set"
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: theme.backgroundSelected }]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.amberMuted }]}>
              <Ionicons name="albums-outline" size={18} color={theme.amber} />
            </View>
            <View style={styles.rowText}>
              <ThemedText style={styles.rowTitle}>New Flashcard Set</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.rowSubtitle}>
                Build your own front/back cards
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
          </Pressable>

          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            style={({ pressed }) => [
              styles.cancelButton,
              { borderColor: theme.border },
              pressed && { backgroundColor: theme.backgroundSelected },
            ]}>
            <ThemedText style={styles.cancelText}>Cancel</ThemedText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
    gap: 4,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(15, 23, 42, 0.15)',
    alignSelf: 'center',
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
    borderRadius: Radius.md,
    paddingHorizontal: 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  rowSubtitle: {
    fontSize: 12,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 13,
    marginTop: Spacing.three,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
