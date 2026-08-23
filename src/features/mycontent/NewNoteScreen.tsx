import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { addNote } from './store';

// Reached from Home's "+" import button. A real, working save — the note
// lands in the shared mycontent store (see store.ts) and shows up on
// Library's My Content row immediately, same honesty-first pattern as the
// rest of this app's user-generated-content screens.
export function NewNoteScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  function save() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    addNote(trimmedTitle, body.trim());
    router.back();
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inner}>
          <ScreenHeader title="New Note" />

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={theme.textSecondary}
            style={[styles.titleInput, { color: theme.text, borderColor: theme.border }]}
          />
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Write your note…"
            placeholderTextColor={theme.textSecondary}
            style={[styles.bodyInput, { color: theme.text, borderColor: theme.border }]}
            multiline
            textAlignVertical="top"
          />

          <Pressable
            onPress={save}
            disabled={!title.trim()}
            accessibilityRole="button"
            accessibilityLabel="Save note"
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: title.trim() ? theme.primary : theme.border },
              pressed && title.trim() && styles.saveButtonPressed,
            ]}>
            <ThemedText style={styles.saveButtonText}>Save Note</ThemedText>
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
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    gap: 12,
  },
  titleInput: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '700',
  },
  bodyInput: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 160,
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
