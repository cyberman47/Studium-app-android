import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { DashboardData } from '../data';

type DailyCase = DashboardData['dailyCase'];

// The one exception to the Home screen's grouped-list pattern: Daily Case
// stays a distinct, high-priority dark card rather than folding into the
// list below it — but shrunk to roughly list-row height plus the one
// extra line the case title needs, not the full card it used to be.
//
// Tapping it is a real interaction now, not a dead end: it opens the
// actual case (vignette, question, four options) in a sheet, mirroring
// the web app's case-of-the-day flow — pick an option and it reveals
// right/wrong plus the explanation, same as the web's CaseReview.
export function DailyCaseCard({ dailyCase }: { dailyCase: DailyCase }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const answered = selectedIndex !== null;

  function close() {
    setOpen(false);
    setSelectedIndex(null);
  }

  return (
    <>
      <View style={[styles.shadowWrap, Shadow.raised]}>
        <Pressable
          onPress={() => setOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`Daily case challenge: ${dailyCase.title}, ${dailyCase.category}, ${dailyCase.difficulty}`}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
          <Ionicons name="pulse" size={90} color="rgba(255,255,255,0.05)" style={styles.watermark} />

          <View style={styles.iconCircle}>
            <Ionicons name="pulse-outline" size={16} color="#5EEAD4" />
          </View>

          <View style={styles.textCol}>
            <ThemedText numberOfLines={1} style={styles.eyebrow}>
              DAILY CASE{' '}
              <ThemedText style={styles.eyebrowMeta}>
                · {dailyCase.category} · {dailyCase.difficulty}
              </ThemedText>
            </ThemedText>
            <ThemedText style={styles.title} numberOfLines={2}>
              {dailyCase.title}
            </ThemedText>
          </View>

          <Ionicons name="chevron-forward" size={16} color="#5EEAD4" />
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="slide" onRequestClose={close}>
        <View style={styles.overlay}>
          <SafeAreaView style={styles.sheetWrap} edges={['bottom']}>
            <View style={[styles.sheet, { backgroundColor: theme.backgroundElement }]}>
              <View style={styles.sheetHeader}>
                <View style={styles.sheetHeaderLeft}>
                  <View style={[styles.tag, { backgroundColor: theme.primaryMuted }]}>
                    <ThemedText themeColor="primary" style={styles.tagText}>
                      {dailyCase.category}
                    </ThemedText>
                  </View>
                  <View style={[styles.tag, { backgroundColor: theme.amberMuted }]}>
                    <ThemedText style={[styles.tagText, { color: theme.amber }]}>{dailyCase.difficulty}</ThemedText>
                  </View>
                </View>
                <Pressable onPress={close} hitSlop={8} accessibilityRole="button" accessibilityLabel="Close case">
                  <Ionicons name="close" size={20} color={theme.textSecondary} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
                <ThemedText style={styles.caseTitle}>{dailyCase.title}</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.stem}>
                  {dailyCase.stem}
                </ThemedText>
                <ThemedText style={styles.question}>{dailyCase.question}</ThemedText>

                <View style={styles.options}>
                  {dailyCase.options.map((option, index) => {
                    const isCorrect = index === dailyCase.correctIndex;
                    const isSelected = index === selectedIndex;
                    let borderColor: string = theme.border;
                    let bg: string | undefined;
                    if (answered && isCorrect) {
                      borderColor = theme.primary;
                      bg = theme.primaryMuted;
                    } else if (answered && isSelected) {
                      borderColor = theme.rose;
                      bg = theme.roseMuted;
                    }
                    return (
                      <Pressable
                        key={option}
                        disabled={answered}
                        onPress={() => setSelectedIndex(index)}
                        accessibilityRole="button"
                        accessibilityLabel={option}
                        style={[
                          styles.option,
                          { borderColor, backgroundColor: bg ?? 'transparent' },
                          answered && !isCorrect && !isSelected && styles.optionDimmed,
                        ]}>
                        <ThemedText style={styles.optionText}>{option}</ThemedText>
                        {answered && isCorrect && <Ionicons name="checkmark-circle" size={18} color={theme.primary} />}
                        {answered && isSelected && !isCorrect && (
                          <Ionicons name="close-circle" size={18} color={theme.rose} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>

                {answered && (
                  <View
                    style={[
                      styles.resultBanner,
                      { backgroundColor: selectedIndex === dailyCase.correctIndex ? theme.primaryMuted : theme.roseMuted },
                    ]}>
                    <ThemedText
                      style={[
                        styles.resultTitle,
                        { color: selectedIndex === dailyCase.correctIndex ? theme.primary : theme.rose },
                      ]}>
                      {selectedIndex === dailyCase.correctIndex ? 'Correct.' : 'Not quite.'}
                    </ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.explanation}>
                      {dailyCase.explanation}
                    </ThemedText>
                  </View>
                )}

                <Pressable
                  onPress={close}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  style={({ pressed }) => [
                    styles.closeButton,
                    { backgroundColor: theme.primary },
                    pressed && styles.closeButtonPressed,
                  ]}>
                  <ThemedText style={styles.closeButtonText}>{answered ? 'Done' : 'Close'}</ThemedText>
                </Pressable>
              </ScrollView>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
    backgroundColor: '#0F172A',
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 14,
    paddingHorizontal: 18,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
  },
  watermark: {
    position: 'absolute',
    right: -16,
    top: -16,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(94, 234, 212, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  eyebrow: {
    color: '#5EEAD4',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  eyebrowMeta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '400',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetWrap: {
    width: '100%',
    maxHeight: '88%',
  },
  sheet: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    ...Shadow.raised,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  tag: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scroll: {
    marginTop: Spacing.three,
  },
  caseTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  stem: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: Spacing.two,
  },
  question: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: Spacing.three,
  },
  options: {
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    minHeight: 48,
  },
  optionDimmed: {
    opacity: 0.5,
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  resultBanner: {
    borderRadius: Radius.md,
    padding: Spacing.three,
    marginTop: Spacing.three,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  explanation: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    paddingVertical: 14,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
    minHeight: 48,
  },
  closeButtonPressed: {
    opacity: 0.85,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
