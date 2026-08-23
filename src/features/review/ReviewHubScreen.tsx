import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { FlashcardsPanel } from './components/FlashcardsPanel';
import { QuizzesPanel } from './components/QuizzesPanel';
import { ReviewSection, ReviewSegmentedControl } from './components/ReviewSegmentedControl';
import { TerminologyPanel } from './components/TerminologyPanel';

// "What do I need to review?" — previously missing entirely from the
// mobile app's navigation (Flashcards, Quizzes, and Terminology had no
// dedicated home anywhere). All three now live on one screen behind a
// segmented switcher rather than as three separate tabs, since a 5-tab
// bar has no room for three more.
//
// Not called ReviewScreen to avoid a name collision with
// features/settings/ReviewScreen.tsx (Settings > Review — flashcard
// session preferences, an unrelated screen).
export function ReviewHubScreen() {
  const theme = useTheme();
  const [section, setSection] = useState<ReviewSection>('flashcards');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ThemedText style={styles.title}>Review</ThemedText>

          <ReviewSegmentedControl value={section} onChange={setSection} />

          {section === 'flashcards' && <FlashcardsPanel />}
          {section === 'quizzes' && <QuizzesPanel />}
          {section === 'terminology' && <TerminologyPanel />}
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
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 29,
    letterSpacing: -0.3,
  },
});
