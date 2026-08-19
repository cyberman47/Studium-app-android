import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The phone equivalent of the web app's persistent top header
// (app/dashboard/layout.tsx: <Logo /> on the left, notification bell +
// avatar cluster on the right) — same wordmark asset, reflowed for a
// narrow screen. Sits above the scroll content, not inside it, so it stays
// put the way the web header does.
export function AppHeader() {
  const theme = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <View style={styles.inner}>
        <Image
          source={require('@/assets/images/studium-logo-full.png')}
          style={styles.logo}
          contentFit="contain"
          accessible
          accessibilityLabel="Studium"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          hitSlop={8}
          style={({ pressed }) => [
            styles.bellButton,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            pressed && styles.bellPressed,
          ]}>
          <Ionicons name="notifications-outline" size={17} color={theme.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
  },
  logo: {
    height: 22,
    aspectRatio: 779 / 303,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellPressed: {
    opacity: 0.7,
  },
});
