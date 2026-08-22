import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

// Shared back-button header for every pushed (non-tab) screen — Settings,
// Passport, Forum, Challenges, Study Groups, Contribute. These routes
// live outside the 5-tab bottom nav, so they need their own way back;
// this keeps that affordance identical everywhere instead of six
// slightly-different inline headers.
export function ScreenHeader({ title }: { title: string }) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={styles.button}>
        <Ionicons name="chevron-back" size={22} color={theme.text} />
      </Pressable>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <View style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  button: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
});
