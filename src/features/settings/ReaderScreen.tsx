import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { OptionSheet } from '@/features/settings/components/OptionSheet';
import { PillGroup } from '@/features/settings/components/PillGroup';
import { SavedIndicator, useSavedFeedback } from '@/features/settings/components/SavedIndicator';
import { ToggleRow } from '@/features/settings/components/ToggleRow';
import {
  lineSpacingOptions,
  paragraphSpacingOptions,
  readingWidthOptions,
  speechSpeedOptions,
  textSizeOptions,
  textStyleOptions,
  ttsLanguageOptions,
  ttsVoiceOptions,
  updateReaderSettings,
  useReaderSettings,
} from '@/features/settings/readerStore';
import { useTheme } from '@/hooks/use-theme';

const previewSizeMap: Record<string, number> = { Small: 13, Medium: 15, Large: 18, 'Extra Large': 21 };
const previewLineHeightMap: Record<string, number> = { Compact: 1.2, Normal: 1.45, Relaxed: 1.7, 'Extra spacious': 2.0 };
const readingWidthMap: Record<string, number> = { Narrow: 260, Comfortable: 340, Wide: 420 };

// Settings > Reader. Every control here is genuinely persisted (survives
// an app restart — see readerStore.ts) but there's no real reading view
// in this app yet for any of it to actually apply to; the live preview
// card below Text Size/Style/Spacing is the one place these settings
// visibly do something today, which is exactly why it's here — it proves
// the values are real without needing the reader itself to exist yet.
export function ReaderScreen() {
  const theme = useTheme();
  const settings = useReaderSettings();
  const { visible: saved, trigger } = useSavedFeedback();
  const [voiceSheetOpen, setVoiceSheetOpen] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function set<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) {
    updateReaderSettings({ [key]: value } as Partial<typeof settings>);
    trigger();
  }

  function handlePreviewVoice() {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    setPreviewing(true);
    previewTimer.current = setTimeout(() => setPreviewing(false), 1600);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.headerRow}>
            <ScreenHeader title="Reader" />
            <SavedIndicator visible={saved} />
          </View>

          {/* Text Appearance */}
          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              TEXT APPEARANCE
            </ThemedText>

            <View style={styles.field}>
              <ThemedText style={styles.fieldTitle}>Text Size</ThemedText>
              <PillGroup options={textSizeOptions} selected={settings.textSize} onSelect={(v) => set('textSize', v as typeof settings.textSize)} />
            </View>

            <View style={[styles.previewShadow, Shadow.card]}>
              <View style={[styles.previewCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border, maxWidth: readingWidthMap[settings.readingWidth] }]}>
                <ThemedText
                  style={[
                    styles.previewText,
                    {
                      fontSize: previewSizeMap[settings.textSize],
                      lineHeight: previewSizeMap[settings.textSize] * previewLineHeightMap[settings.lineSpacing],
                      fontFamily: settings.textStyle === 'Serif' ? 'serif' : undefined,
                      marginBottom: settings.paragraphSpacing === 'Compact' ? 6 : settings.paragraphSpacing === 'Spacious' ? 20 : 12,
                    },
                  ]}>
                  The cell membrane regulates what enters and leaves the cell through both passive and active
                  transport mechanisms.
                </ThemedText>
                <ThemedText
                  themeColor="textSecondary"
                  style={[
                    styles.previewText,
                    {
                      fontSize: previewSizeMap[settings.textSize],
                      lineHeight: previewSizeMap[settings.textSize] * previewLineHeightMap[settings.lineSpacing],
                      fontFamily: settings.textStyle === 'Serif' ? 'serif' : undefined,
                    },
                  ]}>
                  Diffusion and osmosis require no energy; primary and secondary active transport do.
                </ThemedText>
              </View>
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.fieldTitle}>Text Style</ThemedText>
              <PillGroup options={textStyleOptions} selected={settings.textStyle} onSelect={(v) => set('textStyle', v as typeof settings.textStyle)} />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.fieldTitle}>Line Spacing</ThemedText>
              <PillGroup options={lineSpacingOptions} selected={settings.lineSpacing} onSelect={(v) => set('lineSpacing', v as typeof settings.lineSpacing)} />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.fieldTitle}>Paragraph Spacing</ThemedText>
              <PillGroup
                options={paragraphSpacingOptions}
                selected={settings.paragraphSpacing}
                onSelect={(v) => set('paragraphSpacing', v as typeof settings.paragraphSpacing)}
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.fieldTitle}>Reading Width</ThemedText>
              <PillGroup options={readingWidthOptions} selected={settings.readingWidth} onSelect={(v) => set('readingWidth', v as typeof settings.readingWidth)} />
            </View>
          </View>

          {/* Text-to-Speech */}
          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              TEXT-TO-SPEECH
            </ThemedText>

            <View style={[styles.rowShadow, Shadow.card]}>
              <View style={[styles.rowCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <ToggleRow title="Enable Text-to-Speech" value={settings.ttsEnabled} onValueChange={(v) => set('ttsEnabled', v)} />
              </View>
            </View>

            <Pressable
              onPress={() => setVoiceSheetOpen(true)}
              disabled={!settings.ttsEnabled}
              accessibilityRole="button"
              accessibilityLabel="Voice"
              style={[styles.selectRow, { borderColor: theme.border, backgroundColor: theme.backgroundElement }, !settings.ttsEnabled && styles.disabled]}>
              <View style={styles.textCol}>
                <ThemedText style={styles.fieldTitle}>Voice</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.fieldHint}>
                  {settings.ttsVoice}
                </ThemedText>
              </View>
              <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
            </Pressable>

            <View style={[styles.field, !settings.ttsEnabled && styles.disabled]}>
              <ThemedText style={styles.fieldTitle}>Language</ThemedText>
              <PillGroup
                options={ttsLanguageOptions}
                selected={settings.ttsLanguage}
                onSelect={(v) => settings.ttsEnabled && set('ttsLanguage', v as typeof settings.ttsLanguage)}
              />
            </View>

            <View style={[styles.field, !settings.ttsEnabled && styles.disabled]}>
              <ThemedText style={styles.fieldTitle}>Speech Speed</ThemedText>
              <PillGroup
                options={speechSpeedOptions}
                selected={settings.ttsSpeed}
                getLabel={(v) => `${v}×`}
                onSelect={(v) => settings.ttsEnabled && set('ttsSpeed', Number(v))}
              />
            </View>

            <View style={[styles.rowShadow, Shadow.card, !settings.ttsEnabled && styles.disabled]}>
              <View style={[styles.rowCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <ToggleRow
                  title="Auto Play"
                  description="Automatically play text-to-speech when opening content"
                  value={settings.autoPlay}
                  onValueChange={(v) => set('autoPlay', v)}
                />
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <ToggleRow
                  title="Highlight While Reading"
                  description="Highlight text while it is being spoken"
                  value={settings.highlightWhileReading}
                  onValueChange={(v) => set('highlightWhileReading', v)}
                />
              </View>
            </View>

            <Pressable
              onPress={handlePreviewVoice}
              disabled={!settings.ttsEnabled}
              accessibilityRole="button"
              accessibilityLabel="Preview voice"
              style={({ pressed }) => [
                styles.previewButton,
                { borderColor: theme.primary },
                !settings.ttsEnabled && styles.disabled,
                pressed && settings.ttsEnabled && { backgroundColor: theme.primaryMuted },
              ]}>
              <Ionicons name={previewing ? 'volume-high' : 'play'} size={15} color={theme.primary} />
              <ThemedText themeColor="primary" style={styles.previewButtonText}>
                {previewing ? 'Playing preview…' : 'Preview Voice'}
              </ThemedText>
            </Pressable>
          </View>

          {/* General Reader Settings */}
          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              GENERAL
            </ThemedText>
            <View style={[styles.rowShadow, Shadow.card]}>
              <View style={[styles.rowCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <ToggleRow title="Remember my reading position" value={settings.rememberPosition} onValueChange={(v) => set('rememberPosition', v)} />
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <ToggleRow title="Keep screen awake while reading" value={settings.keepScreenAwake} onValueChange={(v) => set('keepScreenAwake', v)} />
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <ToggleRow title="Auto-scroll" value={settings.autoScroll} onValueChange={(v) => set('autoScroll', v)} />
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <ToggleRow title="Show reading progress" value={settings.showProgress} onValueChange={(v) => set('showProgress', v)} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <OptionSheet
        visible={voiceSheetOpen}
        title="Voice"
        options={ttsVoiceOptions}
        selected={settings.ttsVoice}
        onSelect={(v) => set('ttsVoice', v)}
        onClose={() => setVoiceSheetOpen(false)}
      />
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
  fieldTitle: { fontSize: 13, fontWeight: '700' },
  fieldHint: { fontSize: 11, marginTop: 1 },
  previewShadow: { borderRadius: Radius.lg, alignSelf: 'center' },
  previewCard: { borderRadius: Radius.lg, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.four, width: '100%' },
  previewText: {},
  rowShadow: { borderRadius: Radius.lg },
  rowCard: { borderRadius: Radius.lg, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: Spacing.three },
  divider: { height: StyleSheet.hairlineWidth },
  selectRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderRadius: Radius.lg, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: Spacing.three, paddingVertical: 12 },
  textCol: { flex: 1, minWidth: 0 },
  previewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: Radius.pill, borderWidth: 1.5, paddingVertical: 13 },
  previewButtonText: { fontSize: 13, fontWeight: '700' },
  disabled: { opacity: 0.45 },
});
