import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { clearAllSessions, useChatSessions, useChatSettings, updateChatSettings } from './store';

// Reached from the "⋯" menu on Studium AI → Chat Settings. A real toggle
// (gates whether sending a message saves it to history — flip it off and
// AIChatScreen genuinely stops calling upsertSession) plus a real,
// working "Clear chat history" action wired to the same store the
// history list reads from.
export function ChatSettingsScreen() {
  const theme = useTheme();
  const chatSettings = useChatSettings();
  const sessions = useChatSessions();
  const [confirmingClear, setConfirmingClear] = useState(false);

  function handleClear() {
    clearAllSessions();
    setConfirmingClear(false);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Chat Settings" />

          <GroupedList>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <ThemedText style={styles.rowTitle}>Save chat history</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.rowDescription}>
                  Keep conversations so you can find them again from the clock icon
                </ThemedText>
              </View>
              <Switch
                value={chatSettings.saveHistory}
                onValueChange={(value) => updateChatSettings({ saveHistory: value })}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </GroupedList>

          <View>
            {!confirmingClear ? (
              <Pressable
                onPress={() => setConfirmingClear(true)}
                disabled={sessions.length === 0}
                accessibilityRole="button"
                accessibilityLabel="Clear chat history"
                style={({ pressed }) => [
                  styles.dangerButton,
                  { borderColor: theme.roseMuted },
                  sessions.length === 0 && styles.dangerButtonDisabled,
                  pressed && sessions.length > 0 && { backgroundColor: theme.roseMuted },
                ]}>
                <Ionicons name="trash-outline" size={16} color={theme.rose} />
                <ThemedText themeColor="rose" style={styles.dangerButtonText}>
                  {sessions.length === 0 ? 'No chat history to clear' : `Clear Chat History (${sessions.length})`}
                </ThemedText>
              </Pressable>
            ) : (
              <View style={[styles.confirmRow, { borderColor: theme.roseMuted }]}>
                <ThemedText style={styles.confirmText}>
                  Delete all {sessions.length} saved conversation{sessions.length === 1 ? '' : 's'}? This can't be
                  undone.
                </ThemedText>
                <View style={styles.confirmButtons}>
                  <Pressable
                    onPress={() => setConfirmingClear(false)}
                    style={({ pressed }) => [
                      styles.confirmCancel,
                      { borderColor: theme.border },
                      pressed && { backgroundColor: theme.backgroundSelected },
                    ]}>
                    <ThemedText style={styles.confirmCancelText}>Cancel</ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={handleClear}
                    style={({ pressed }) => [
                      styles.confirmDelete,
                      { backgroundColor: theme.rose },
                      pressed && { opacity: 0.85 },
                    ]}>
                    <ThemedText style={styles.confirmDeleteText}>Delete All</ThemedText>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: Spacing.six,
  },
  inner: {
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    minHeight: 60,
    paddingVertical: 10,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowDescription: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 13,
  },
  dangerButtonDisabled: {
    opacity: 0.5,
  },
  dangerButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  confirmRow: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: 12,
  },
  confirmText: {
    fontSize: 13,
    lineHeight: 19,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmCancel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 11,
  },
  confirmCancelText: {
    fontSize: 13,
    fontWeight: '700',
  },
  confirmDelete: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    paddingVertical: 11,
  },
  confirmDeleteText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
