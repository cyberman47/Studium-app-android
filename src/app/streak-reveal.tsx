import { useLocalSearchParams } from 'expo-router';

import { StreakRevealScreen } from '@/features/progress/StreakRevealScreen';

// Launched by tapping the header's streak pill (see
// features/dashboard/DashboardScreen.tsx) with the same real streak/KP
// numbers already shown there, passed as route params rather than
// re-fetched — this screen is purely a presentation moment on top of
// numbers the caller already has.
export default function StreakReveal() {
  const { streakDays, todayKP, targetKP } = useLocalSearchParams<{
    streakDays: string;
    todayKP: string;
    targetKP: string;
  }>();

  return (
    <StreakRevealScreen
      streakDays={Number(streakDays) || 0}
      todayKP={Number(todayKP) || 0}
      targetKP={Number(targetKP) || 0}
    />
  );
}
