import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { addFlashcardSet } from './store';

type Draft = { id: string; front: string; back: string };

function makeCard(): Draft {
  return { id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, front: '', back: '' };
}

// Reached from Home's "+" import button. Real, working save into the
// shared mycontent store — same pattern as NewNoteScreen.
export function NewFlashcardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [cards, setCards] = useState<Draft[]>([makeCard()]);

  function updateCard(id: string, patch: Partial<Draft>) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function addCard() {
    setCards((prev) => [...prev, makeCard()]);
  }

  function removeCard(id: string) {
    setCards((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev));
  }

  const validCards = cards.filter((c) => c.front.trim() && c.back.trim());
  const canSave = title.trim().length > 0 && validCards.length > 0;

  function save() {
    if (!canSave) return;
    addFlashcardSet(
      title.trim(),
      validCards.map((c) => ({ front: c.front.trim(), back: c.back.trim() })),
    );
    router.back();
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <ScreenHeader title="New Flashcard Set" />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Set title (e.g. Renal Physiology)"
            placeholderTextColor={theme.textSecondary}
            style={[styles.titleInput, { color: theme.text, borderColor: theme.border }]}
          />

          {cards.map((card, index) => (
            <View key={card.id} style={[styles.cardShadow, Shadow.card]}>
              <View style={[styles.cardBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                  <ThemedText themeColor="textSecondary" style={styles.cardLabel}>
                    CARD {index + 1}
                  </ThemedText>
                  {cards.length > 1 && (
                    <Pressable
                      onPress={() => removeCard(card.id)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove card ${index + 1}`}>
                      <Ionicons name="trash-outline" size={16} color={theme.textSecondary} />
                    </Pressable>
                  )}
                </View>
                <TextInput
                  value={card.front}
                  onChangeText={(text) => updateCard(card.id, { front: text })}
                  placeholder="Front"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.cardInput, { color: theme.text, borderColor: theme.border }]}
                />
                <TextInput
                  value={card.back}
                  onChangeText={(text) => updateCard(card.id, { back: text })}
                  placeholder="Back"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.cardInput, { color: theme.text, borderColor: theme.border }]}
                />
              </View>
            </View>
          ))}

          <Pressable
            onPress={addCard}
            accessibilityRole="button"
            accessibilityLabel="Add another card"
            style={({ pressed }) => [
              styles.addCardButton,
              { borderColor: theme.border },
              pressed && { backgroundColor: theme.backgroundSelected },
            ]}>
            <Ionicons name="add" size={16} color={theme.primary} />
            <ThemedText themeColor="primary" style={styles.addCardText}>
              Add Card
            </ThemedText>
          </Pressable>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={save}
            disabled={!canSave}
            accessibilityRole="button"
            accessibilityLabel="Save flashcard set"
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: canSave ? theme.primary : theme.border },
              pressed && canSave && styles.saveButtonPressed,
            ]}>
            <ThemedText style={styles.saveButtonText}>Save Set</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  scrollContent: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: 12,
  },
  titleInput: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '700',
  },
  cardShadow: {
    borderRadius: Radius.lg,
  },
  cardBox: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  cardInput: {
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    paddingVertical: 12,
  },
  addCardText: {
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    paddingTop: Spacing.two,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    paddingVertical: 14,
    minHeight: 48,
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
