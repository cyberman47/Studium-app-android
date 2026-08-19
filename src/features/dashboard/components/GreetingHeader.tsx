import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function GreetingHeader({ name, pathLabel }: { name: string; pathLabel: string }) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <ThemedText themeColor="textSecondary" style={styles.eyebrow}>
          YOUR DASHBOARD
        </ThemedText>
        <ThemedText style={styles.greeting}>
          {getGreeting()}, {name} 👋
        </ThemedText>
      </View>
      <View style={[styles.pathPill, { backgroundColor: theme.primaryMuted }]}>
        <Ionicons name="rocket" size={12} color={theme.primary} />
        <ThemedText themeColor="primary" style={styles.pathText}>
          {pathLabel}
        </ThemedText>
        <Ionicons name="chevron-down" size={12} color={theme.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  textCol: {
    flex: 1,
    gap: Spacing.one,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  greeting: {
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 29,
    letterSpacing: -0.3,
  },
  pathPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pathText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
