import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

import { AnatomyQuizScreen } from '@/features/anatomy/AnatomyQuizScreen';

// Launched from the Anatomy section picker's Start Testing with the
// selected section ids as one comma-separated `sections` param, so the
// quiz is its own pushed screen (real back-gesture / X-to-exit behaviour)
// rather than state toggled inside the picker.
export default function AnatomyQuiz() {
  const { sections } = useLocalSearchParams<{ sections?: string }>();
  const sectionIds = useMemo(
    () => (sections ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    [sections]
  );
  return <AnatomyQuizScreen sectionIds={sectionIds} />;
}
