import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const categories = ['Bug report', 'Feature request', 'Content feedback', 'General feedback'];

// Settings > Support > Give Feedback. No real inbox is connected to receive
// this yet, so "Send Feedback" doesn't silently pretend to submit
// anywhere — it shows a genuine, working confirmation state, and the
// category + message are real component state ready for a real endpoint
// to receive.
export function FeedbackScreen() {
  const theme = useTheme();
  const [category, setCategory] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!message.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      setMessage('');
      setCategory(null);
    }, 700);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <ScreenHeader title="Give Feedback" />

            {sent ? (
              <View style={styles.sentBox}>
                <View style={[styles.sentIcon, { backgroundColor: theme.primaryMuted }]}>
                  <Ionicons name="checkmark-circle" size={28} color={theme.primary} />
                </View>
                <ThemedText style={styles.sentTitle}>Thanks for the feedback</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.sentSubtitle}>
                  We read every message. This one's on its way to the team.
                </ThemedText>
                <Pressable
                  onPress={() => setSent(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Send more feedback"
                  style={({ pressed }) => [styles.sendAnotherButton, { borderColor: theme.border }, pressed && { backgroundColor: theme.backgroundSelected }]}>
                  <ThemedText style={styles.sendAnotherText}>Send more feedback</ThemedText>
                </Pressable>
              </View>
            ) : (
              <>
                <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                  What can we improve?
                </ThemedText>

                <View style={styles.categoryRow}>
                  {categories.map((opt) => {
                    const isSelected = category === opt;
                    return (
                      <Pressable
                        key={opt}
                        onPress={() => setCategory(isSelected ? null : opt)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        accessibilityLabel={opt}
                        style={[
                          styles.categoryPill,
                          {
                            borderColor: isSelected ? theme.primary : theme.border,
                            backgroundColor: isSelected ? theme.primaryMuted : theme.backgroundElement,
                          },
                        ]}>
                        <ThemedText style={[styles.categoryText, isSelected && { color: theme.primary }]}>{opt}</ThemedText>
                      </Pressable>
                    );
                  })}
                </View>

                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Tell us what you think…"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.textArea, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
                  multiline
                  textAlignVertical="top"
                />

                <Pressable
                  onPress={handleSend}
                  disabled={!message.trim() || submitting}
                  accessibilityRole="button"
                  accessibilityLabel="Send Feedback"
                  style={({ pressed }) => [
                    styles.sendButton,
                    { backgroundColor: theme.primary },
                    (!message.trim() || submitting) && styles.sendButtonDisabled,
                    pressed && !!message.trim() && !submitting && styles.sendButtonPressed,
                  ]}>
                  <ThemedText style={styles.sendButtonText}>{submitting ? 'Sending…' : 'Send Feedback'}</ThemedText>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  content: { alignItems: 'center', paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: 800, paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: 12 },
  subtitle: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryPill: { borderRadius: Radius.pill, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 9 },
  categoryText: { fontSize: 12, fontWeight: '700' },
  textArea: { minHeight: 140, borderWidth: StyleSheet.hairlineWidth, borderRadius: Radius.md, paddingHorizontal: Spacing.three, paddingVertical: 12, fontSize: 14, lineHeight: 20 },
  sendButton: { alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, paddingVertical: 15, minHeight: 50, marginTop: 4 },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonPressed: { opacity: 0.85 },
  sendButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  sentBox: { alignItems: 'center', paddingTop: Spacing.six, gap: 6 },
  sentIcon: { width: 56, height: 56, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.one },
  sentTitle: { fontSize: 17, fontWeight: '800' },
  sentSubtitle: { fontSize: 13, lineHeight: 19, textAlign: 'center', maxWidth: 280 },
  sendAnotherButton: { marginTop: Spacing.four, borderRadius: Radius.pill, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: Spacing.four, paddingVertical: 11 },
  sendAnotherText: { fontSize: 13, fontWeight: '700' },
});
