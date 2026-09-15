import { useLocalSearchParams } from 'expo-router';

import { LessonListScreen } from '@/features/practice/LessonListScreen';
import type { BankTrack } from '@/lib/contentBank';

export default function LessonList() {
  const { track, sectionId, topicId, filterLabel } = useLocalSearchParams<{
    track: string;
    sectionId?: string;
    topicId?: string;
    filterLabel?: string;
  }>();

  return (
    <LessonListScreen
      track={(track === 'nursing' ? 'nursing' : 'mcat') as BankTrack}
      sectionId={sectionId}
      topicId={topicId}
      filterLabel={filterLabel}
    />
  );
}
