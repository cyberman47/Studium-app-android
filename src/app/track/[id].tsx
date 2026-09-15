import { useLocalSearchParams } from 'expo-router';

import { AnatomySectionsScreen } from '@/features/anatomy/AnatomySectionsScreen';
import { TrackDetailScreen } from '@/features/study/TrackDetailScreen';

export default function Track() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Anatomy is flashcards-only and gets its own two-step picker → quiz
  // flow (features/anatomy/), mirroring the web app's courses/anatomy
  // page; every other track still opens the generic topic list.
  if (id === 'anatomy') return <AnatomySectionsScreen />;
  return <TrackDetailScreen id={id ?? ''} />;
}
