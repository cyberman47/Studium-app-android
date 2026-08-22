import { useLocalSearchParams } from 'expo-router';

import { LibraryDetailScreen } from '@/features/library/LibraryDetailScreen';

export default function LibraryItem() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LibraryDetailScreen id={id ?? ''} />;
}
