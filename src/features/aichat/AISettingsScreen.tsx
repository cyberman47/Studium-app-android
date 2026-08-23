import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ResponseStyle, updateAISettings, useAISettings } from './store';

const styleOptions: { value: ResponseStyle; label: string; description: string }[] = [
  { value: 'concise', label: 'Concise', description: 'Short, to-the-point answers' },
  { value: 'detailed', label: 'Detailed', description: 'Fuller explanations with context' },
];

// Reached from the "⋯" menu on Studium AI → AI Settings. Both controls
// here are real and actually change chat behavior: responseStyle is read
// by AIChatScreen's craftReply to shorten or expand its answers, and
// autoAttachLesson pre-selects the lesson picker with the current
// "Continue studying" lesson instead of leaving it empty.
export function AISettingsScreen() {
  const theme = useTheme();
  const settings = useAISettings();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="AI Settings" />

          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              RESPONSE STYLE
            </ThemedText>
            <View style={styles.optionRow}>
              {styleOptions.map((option) => {
                const selected = settings.responseStyle === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => updateAISettings({ responseStyle: option.value })}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={option.label}
                    style={[styles.optionShadow, Shadow.card, { flex: 1 }]}>
                    <View
                      style={[
                        styles.option,
                        {
                          backgroundColor: selected ? theme.primaryMuted : theme.backgroundElement,
                          borderColor: selected ? theme.primary : theme.border,
                        },
                      ]}>
                      <ThemedText style={[styles.optionLabel, selected && { color: theme.primary }]}>
                        {option.label}
                      </ThemedText>
                      <ThemedText themeColor="textSecondary" style={styles.optionDescription}>
                        {option.description}
                      </ThemedText>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={[styles.rowShadow, Shadow.card]}>
            <View style={[styles.row, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <View style={styles.rowText}>
                <ThemedText style={styles.rowTitle}>Auto-attach current lesson</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.rowDescription}>
                  Pre-select "Continue studying" as context for new chats
                </ThemedText>
              </View>
              <Switch
                value={settings.autoAttachLesson}
                onValueChange={(value) => updateAISettings({ autoAttachLesson: value })}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
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
  section: {
    gap: Spacing.two,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionShadow: {
    borderRadius: Radius.lg,
  },
  option: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 3,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionDescription: {
    fontSize: 11,
    lineHeight: 15,
  },
  rowShadow: {
    borderRadius: Radius.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
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
});
