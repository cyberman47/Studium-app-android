import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { addQuiz } from '@/features/review/quizStore';
import { useTheme } from '@/hooks/use-theme';

type Draft = { id: string; question: string; options: [string, string, string, string]; correctIndex: number };

function makeQuestion(): Draft {
  return { id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, question: '', options: ['', '', '', ''], correctIndex: 0 };
}

// Reached from Create > New Quiz (and Review > Quizzes > "Create quiz").
// Real, working save into the shared quiz store (features/review/
// quizStore.ts) — same shape as NewFlashcardScreen's save into
// mycontent's store. There's no quiz-TAKING engine anywhere in this app
// yet, so this only builds the quiz itself; nothing here fakes scoring
// or attempt history that doesn't exist.
export function NewQuizScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState<Draft[]>([makeQuestion()]);

  function updateQuestion(id: string, patch: Partial<Draft>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function updateOption(id: string, index: number, text: string) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const options = [...q.options] as Draft['options'];
        options[index] = text;
        return { ...q, options };
      })
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, makeQuestion()]);
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => (prev.length > 1 ? prev.filter((q) => q.id !== id) : prev));
  }

  const validQuestions = questions.filter((q) => q.question.trim() && q.options.every((o) => o.trim()));
  const canSave = title.trim().length > 0 && subject.trim().length > 0 && validQuestions.length > 0;

  function save() {
    if (!canSave) return;
    addQuiz(
      title.trim(),
      subject.trim(),
      validQuestions.map((q) => ({
        question: q.question.trim(),
        options: q.options.map((o) => o.trim()),
        correctIndex: q.correctIndex,
      }))
    );
    router.back();
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <ScreenHeader title="New Quiz" />
        </View>

        <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Quiz title (e.g. Cardiovascular Basics)"
            placeholderTextColor={theme.textSecondary}
            style={[styles.titleInput, { color: theme.text, borderColor: theme.border }]}
          />
          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Subject (e.g. Biology)"
            placeholderTextColor={theme.textSecondary}
            style={[styles.subjectInput, { color: theme.text, borderColor: theme.border }]}
          />

          {questions.map((q, index) => (
            <View key={q.id} style={[styles.cardShadow, Shadow.card]}>
              <View style={[styles.cardBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                  <ThemedText themeColor="textSecondary" style={styles.cardLabel}>
                    QUESTION {index + 1}
                  </ThemedText>
                  {questions.length > 1 && (
                    <Pressable
                      onPress={() => removeQuestion(q.id)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove question ${index + 1}`}>
                      <Ionicons name="trash-outline" size={16} color={theme.textSecondary} />
                    </Pressable>
                  )}
                </View>
                <TextInput
                  value={q.question}
                  onChangeText={(text) => updateQuestion(q.id, { question: text })}
                  placeholder="Question"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.cardInput, { color: theme.text, borderColor: theme.border }]}
                />
                <ThemedText themeColor="textSecondary" style={styles.optionsHint}>
                  Options — tap the circle to mark the correct one
                </ThemedText>
                {q.options.map((option, optionIndex) => (
                  <View key={optionIndex} style={styles.optionRow}>
                    <Pressable
                      onPress={() => updateQuestion(q.id, { correctIndex: optionIndex })}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: q.correctIndex === optionIndex }}
                      accessibilityLabel={`Mark option ${optionIndex + 1} as correct`}
                      hitSlop={8}
                      style={[
                        styles.radio,
                        { borderColor: q.correctIndex === optionIndex ? theme.primary : theme.border },
                        q.correctIndex === optionIndex && { backgroundColor: theme.primary },
                      ]}>
                      {q.correctIndex === optionIndex && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </Pressable>
                    <TextInput
                      value={option}
                      onChangeText={(text) => updateOption(q.id, optionIndex, text)}
                      placeholder={`Option ${optionIndex + 1}`}
                      placeholderTextColor={theme.textSecondary}
                      style={[styles.optionInput, { color: theme.text, borderColor: theme.border }]}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}

          <Pressable
            onPress={addQuestion}
            accessibilityRole="button"
            accessibilityLabel="Add another question"
            style={({ pressed }) => [
              styles.addButton,
              { borderColor: theme.border },
              pressed && { backgroundColor: theme.backgroundSelected },
            ]}>
            <Ionicons name="add" size={16} color={theme.primary} />
            <ThemedText themeColor="primary" style={styles.addButtonText}>
              Add Question
            </ThemedText>
          </Pressable>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={save}
            disabled={!canSave}
            accessibilityRole="button"
            accessibilityLabel="Save quiz"
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: canSave ? theme.primary : theme.border },
              pressed && canSave && styles.saveButtonPressed,
            ]}>
            <ThemedText style={styles.saveButtonText}>Save Quiz</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: { width: '100%', maxWidth: 800, alignSelf: 'center', paddingHorizontal: Spacing.four, paddingTop: Spacing.three },
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
  subjectInput: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  cardShadow: { borderRadius: Radius.lg },
  cardBox: { borderRadius: Radius.lg, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three, gap: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  cardLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
  cardInput: { borderRadius: Radius.sm, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  optionsHint: { fontSize: 11, marginTop: 4 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionInput: { flex: 1, borderRadius: Radius.sm, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    paddingVertical: 12,
  },
  addButtonText: { fontSize: 13, fontWeight: '700' },
  footer: { width: '100%', maxWidth: 800, alignSelf: 'center', paddingHorizontal: Spacing.four, paddingBottom: Spacing.three, paddingTop: Spacing.two },
  saveButton: { alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, paddingVertical: 14, minHeight: 48 },
  saveButtonPressed: { opacity: 0.85 },
  saveButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
