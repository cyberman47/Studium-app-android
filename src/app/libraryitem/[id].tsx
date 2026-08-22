import { useLocalSearchParams } from 'expo-router';

import { AllLessonsScreen } from '@/features/library/AllLessonsScreen';
import { LibraryDetailScreen } from '@/features/library/LibraryDetailScreen';

export default function LibraryItem() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // "All Lessons" gets the bespoke curriculum timeline; every other
  // Library section (Saved, Recently Added, Community, Articles,
  // Resources, decks/flagged/mistakes) is a genuine feed/list, so the
  // shared list-detail screen is the correct representation for those.
  if (id === 'lessons') return <AllLessonsScreen />;
  return <LibraryDetailScreen id={id ?? ''} />;
}
