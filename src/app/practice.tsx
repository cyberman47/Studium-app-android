import { useLocalSearchParams } from 'expo-router';

import { QuestionBankScreen } from '@/features/practice/QuestionBankScreen';
import type { BankTrack } from '@/lib/contentBank';

export default function Practice() {
  const { track, lessonId, lessonTitle, subjectTitle } = useLocalSearchParams<{
    track: string;
    lessonId: string;
    lessonTitle?: string;
    subjectTitle?: string;
  }>();

  return (
    <QuestionBankScreen
      track={(track === 'nursing' ? 'nursing' : 'mcat') as BankTrack}
      lessonId={lessonId ?? ''}
      lessonTitle={lessonTitle ?? 'Practice'}
      subjectTitle={subjectTitle ?? ''}
    />
  );
}
