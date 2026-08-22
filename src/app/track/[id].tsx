import { useLocalSearchParams } from 'expo-router';

import { TrackDetailScreen } from '@/features/study/TrackDetailScreen';

export default function Track() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TrackDetailScreen id={id ?? ''} />;
}
