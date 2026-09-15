import { useLocalSearchParams } from 'expo-router';

import { LibraryDetailScreen } from '@/features/library/LibraryDetailScreen';
import { LessonListScreen } from '@/features/practice/LessonListScreen';

export default function LibraryItem() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // "All Lessons" is the real MCAT question bank (every subject, no
  // section filter); every other Library section (Saved, Recently Added,
  // Community, Articles, Resources, decks/flagged/mistakes) is a genuine
  // feed/list, so the shared list-detail screen is the correct
  // representation for those.
  if (id === 'lessons') return <LessonListScreen track="mcat" />;
  return <LibraryDetailScreen id={id ?? ''} />;
}
