import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { type TermEntry } from '../data';
import { toggleTermLearned, useLearnedTermIds } from '../store';

// The definition sheet a term opens into — shared by Review > Terminology
// and InteractiveText (components/interactive-text.tsx), so a term tapped
// from a case narrative and a term tapped from the Terminology browse list
// are the exact same "learned" state, not two parallel systems.
export function TermDetailSheet({ term, visible, onClose }: { term: TermEntry | null; visible: boolean; onClose: () => void }) {
  const theme = useTheme();
  const learnedIds = useLearnedTermIds();
  const learned = term ? learnedIds.includes(term.id) : false;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} style={[styles.sheet, { backgroundColor: theme.backgroundElement }]}>
          {term && (
            <>
              <View style={styles.grabber} />
              <View style={[styles.tag, { backgroundColor: theme.primaryMuted }]}>
                <ThemedText themeColor="primary" style={styles.tagText}>
                  {term.category}
                </ThemedText>
              </View>
              <ThemedText style={styles.termTitle}>{term.term}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.termDefinition}>
                {term.definition}
              </ThemedText>
              <Pressable
                onPress={() => toggleTermLearned(term.id)}
                accessibilityRole="button"
                accessibilityLabel={learned ? 'Mark as not learned' : 'Mark as learned'}
                style={({ pressed }) => [
                  styles.learnedButton,
                  { backgroundColor: learned ? theme.primaryMuted : theme.primary, borderColor: theme.primary },
                  pressed && styles.pressed,
                ]}>
                <Ionicons name={learned ? 'checkmark-circle' : 'checkmark-circle-outline'} size={16} color={learned ? theme.primary : '#FFFFFF'} />
                <ThemedText style={[styles.learnedButtonText, { color: learned ? theme.primary : '#FFFFFF' }]}>
                  {learned ? 'Learned' : 'Mark as learned'}
                </ThemedText>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
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
  tag: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  termTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: Spacing.two,
  },
  termDefinition: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: Spacing.two,
  },
  learnedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    paddingVertical: 13,
    marginTop: Spacing.four,
    minHeight: 48,
  },
  pressed: {
    opacity: 0.85,
  },
  learnedButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
