import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// The standalone "Your Dashboard" eyebrow that used to sit above this was
// dropped — it only added dead space between the path chip and the
// greeting without carrying real information (the path chip right above
// it already establishes "this is your dashboard" context). Just the
// greeting itself now.
export function GreetingHeader({ name }: { name: string }) {
  return (
    <ThemedText style={styles.greeting}>
      {getGreeting()}, {name} 👋
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 29,
    letterSpacing: -0.3,
  },
});
