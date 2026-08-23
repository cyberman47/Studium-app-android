import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { PillGroup } from '@/features/settings/components/PillGroup';
import { SavedIndicator, useSavedFeedback } from '@/features/settings/components/SavedIndicator';
import { SelectableRow } from '@/features/settings/components/SelectableRow';
import { ToggleRow } from '@/features/settings/components/ToggleRow';
import {
  cardsPerSessionPresets,
  includedOptions,
  questionTypeOptions,
  reviewModeOptions,
  reviewOrderOptions,
  updateReviewSettings,
  useReviewSettings,
} from '@/features/settings/reviewStore';
import { useTheme } from '@/hooks/use-theme';

// Settings > Review. Every control here is genuinely persisted (see
// reviewStore.ts) but there's no real flashcard review session engine in
// this app yet to configure — Library's "My Decks" is still mock content.
// Built complete and interactive now so whoever wires the real session
// runner has a real settings shape to read from immediately.
export function ReviewScreen() {
  const theme = useTheme();
  const settings = useReviewSettings();
  const { visible: saved, trigger } = useSavedFeedback();
  const [customValue, setCustomValue] = useState(String(settings.cardsPerSession));

  function set<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) {
    updateReviewSettings({ [key]: value } as Partial<typeof settings>);
    trigger();
  }

  function toggleInList(list: string[], key: 'included' | 'questionTypes', value: string) {
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    set(key, next);
  }

  function chooseCardsPerSession(value: string) {
    if (value === 'Custom') {
      set('cardsPerSessionCustom', true);
      return;
    }
    set('cardsPerSessionCustom', false);
    set('cardsPerSession', Number(value));
  }

  function commitCustomValue() {
    const parsed = Math.max(1, Math.min(500, Number(customValue) || settings.cardsPerSession));
    setCustomValue(String(parsed));
    set('cardsPerSession', parsed);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.headerRow}>
            <ScreenHeader title="Review" />
            <SavedIndicator visible={saved} />
          </View>

          {/* Session Settings */}
          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              SESSION SETTINGS
            </ThemedText>

            <View style={styles.field}>
              <View style={styles.fieldHeaderRow}>
                <ThemedText style={styles.fieldTitle}>Flashcards per session</ThemedText>
                <ThemedText themeColor="primary" style={styles.fieldValue}>
                  {settings.cardsPerSession}
                </ThemedText>
              </View>
              <PillGroup
                options={[...cardsPerSessionPresets.map(String), 'Custom']}
                selected={settings.cardsPerSessionCustom ? 'Custom' : String(settings.cardsPerSession)}
                onSelect={chooseCardsPerSession}
              />
              {settings.cardsPerSessionCustom && (
                <TextInput
                  value={customValue}
                  onChangeText={setCustomValue}
                  onEndEditing={commitCustomValue}
                  onBlur={commitCustomValue}
                  keyboardType="number-pad"
                  placeholder="Enter a number"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.customInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
                />
              )}
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.fieldTitle}>Review Mode</ThemedText>
              <View style={styles.selectableList}>
                {reviewModeOptions.map((opt) => (
                  <SelectableRow key={opt} label={opt} selected={settings.reviewMode === opt} onPress={() => set('reviewMode', opt)} />
                ))}
              </View>
            </View>
          </View>

          {/* What should be included */}
          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              WHAT SHOULD BE INCLUDED?
            </ThemedText>
            <View style={styles.selectableList}>
              {includedOptions.map((opt) => (
                <SelectableRow
                  key={opt}
                  label={opt}
                  multiple
                  selected={settings.included.includes(opt)}
                  onPress={() => toggleInList(settings.included, 'included', opt)}
                />
              ))}
            </View>
          </View>

          {/* Question Types */}
          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              QUESTION TYPES
            </ThemedText>
            <View style={styles.selectableList}>
              {questionTypeOptions.map((opt) => (
                <SelectableRow
                  key={opt}
                  label={opt}
                  multiple
                  selected={settings.questionTypes.includes(opt)}
                  onPress={() => toggleInList(settings.questionTypes, 'questionTypes', opt)}
                />
              ))}
            </View>
          </View>

          {/* Review Order */}
          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              REVIEW ORDER
            </ThemedText>
            <View style={styles.selectableList}>
              {reviewOrderOptions.map((opt) => (
                <SelectableRow key={opt} label={opt} selected={settings.reviewOrder === opt} onPress={() => set('reviewOrder', opt)} />
              ))}
            </View>
          </View>

          {/* Session Behavior */}
          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              SESSION BEHAVIOR
            </ThemedText>
            <View style={[styles.rowShadow, Shadow.card]}>
              <View style={[styles.rowCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <ToggleRow title="Show answer after selection" value={settings.showAnswerAfterSelection} onValueChange={(v) => set('showAnswerAfterSelection', v)} />
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <ToggleRow title="Require self-rating" value={settings.requireSelfRating} onValueChange={(v) => set('requireSelfRating', v)} />
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <ToggleRow title="Show explanation after answering" value={settings.showExplanation} onValueChange={(v) => set('showExplanation', v)} />
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <ToggleRow title="Automatically continue to next card" value={settings.autoContinue} onValueChange={(v) => set('autoContinue', v)} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: 800, paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { gap: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '500', letterSpacing: 0.4 },
  field: { gap: 8 },
  fieldHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fieldTitle: { fontSize: 13, fontWeight: '700' },
  fieldValue: { fontSize: 13, fontWeight: '800' },
  customInput: { marginTop: 4, borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, maxWidth: 140 },
  selectableList: { gap: 8 },
  rowShadow: { borderRadius: Radius.lg },
  rowCard: { borderRadius: Radius.lg, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: Spacing.three },
  divider: { height: StyleSheet.hairlineWidth },
});
