import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const faqs = [
  {
    id: 'progress',
    question: 'How is my mastery percentage calculated?',
    answer: 'Mastery blends your accuracy on a topic with how recently and how often you\'ve reviewed it — a correct answer from last week counts less than one from today.',
  },
  {
    id: 'streak',
    question: 'What counts toward my daily streak?',
    answer: 'Hitting your daily Knowledge Point goal keeps your streak alive. You can see today\'s progress toward that goal on the Study Plan card on Home.',
  },
  {
    id: 'daily-case',
    question: 'Can I go back and redo a past Daily Case?',
    answer: 'Yes — Library\'s Daily Case archive keeps every past case available, and you can review your original answer alongside the explanation.',
  },
  {
    id: 'lessons',
    question: 'Why do most lessons say "browsable structure" instead of having content?',
    answer: 'Studium is actively writing lesson content track by track. MCAT → Biology has real, completable lessons today; every other track shows its real topic structure while the lessons themselves are still being written.',
  },
  {
    id: 'sync',
    question: 'Does my progress sync across devices?',
    answer: 'Your account is the source of truth — progress, streaks, and KP follow your sign-in wherever you use Studium.',
  },
];

// A real accordion — tapping a question actually expands it in place —
// plus a genuinely working "Email Support" action (RN's Linking API
// opens the device's real mail client with a pre-filled address).
export function HelpScreen() {
  const theme = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Help & Support" />
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Common questions, answered.
          </ThemedText>

          <View style={styles.faqList}>
            {faqs.map((faq) => {
              const expanded = expandedId === faq.id;
              return (
                <View key={faq.id} style={[styles.shadowWrap, Shadow.card]}>
                  <View style={[styles.faqCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                    <Pressable
                      onPress={() => toggle(faq.id)}
                      accessibilityRole="button"
                      accessibilityState={{ expanded }}
                      accessibilityLabel={faq.question}
                      style={styles.faqHeader}>
                      <ThemedText style={styles.faqQuestion}>{faq.question}</ThemedText>
                      <Ionicons
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={theme.textSecondary}
                      />
                    </Pressable>
                    {expanded && (
                      <ThemedText themeColor="textSecondary" style={styles.faqAnswer}>
                        {faq.answer}
                      </ThemedText>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <Pressable
            onPress={() => Linking.openURL('mailto:support@studium.app?subject=Studium%20support')}
            accessibilityRole="button"
            accessibilityLabel="Email support"
            style={({ pressed }) => [
              styles.emailButton,
              { borderColor: theme.border },
              pressed && { backgroundColor: theme.backgroundSelected },
            ]}>
            <Ionicons name="mail-outline" size={16} color={theme.primary} />
            <ThemedText themeColor="primary" style={styles.emailButtonText}>
              Email Support
            </ThemedText>
          </Pressable>
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
    gap: 12,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: -8,
  },
  faqList: {
    gap: 10,
  },
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  faqCard: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    minHeight: 24,
  },
  faqQuestion: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
  },
  faqAnswer: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 13,
    marginTop: 4,
    minHeight: 46,
  },
  emailButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
