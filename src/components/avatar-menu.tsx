import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const menuItems = [
  { key: 'profile', label: 'Profile', icon: 'person-outline' as const },
  { key: 'settings', label: 'Settings', icon: 'settings-outline' as const },
] as const;

// The phone equivalent of the web header's UserMenu (components/
// dashboard-shell.tsx) — same "Signed in as X / Profile / Settings /
// Logout" shape. Uses a transparent Modal rather than an absolutely
// positioned View: RN has no web-style stacking-context guarantee that an
// in-flow dropdown will paint above sibling cards below it, and a Modal
// sidesteps that entirely by rendering into its own native layer.
export function AvatarMenu({ name, avatarInitial }: { name: string; avatarInitial: string }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Account menu"
        accessibilityState={{ expanded: open }}
        hitSlop={8}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}>
        <View style={[styles.avatar, { backgroundColor: theme.primaryMuted }]}>
          <ThemedText themeColor="primary" style={styles.avatarText}>
            {avatarInitial}
          </ThemedText>
        </View>
        <Ionicons name="chevron-down" size={14} color={theme.textSecondary} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
          onPress={() => setOpen(false)}>
          <View
            style={[
              styles.menu,
              { top: insets.top + 56 },
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              Shadow.raised,
            ]}>
            <ThemedText themeColor="textSecondary" numberOfLines={1} style={styles.signedInAs}>
              Signed in as {name}
            </ThemedText>
            {menuItems.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => setOpen(false)}
                accessibilityRole="button"
                hitSlop={4}
                style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
                <Ionicons name={item.icon} size={16} color={theme.textSecondary} />
                <ThemedText style={styles.itemText}>{item.label}</ThemedText>
              </Pressable>
            ))}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Pressable
              onPress={() => setOpen(false)}
              accessibilityRole="button"
              hitSlop={4}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
              <Ionicons name="log-out-outline" size={16} color={theme.rose} />
              <ThemedText style={[styles.itemText, { color: theme.rose }]}>Logout</ThemedText>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 44,
    paddingLeft: 2,
    paddingRight: 6,
  },
  triggerPressed: {
    opacity: 0.7,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
  backdrop: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    right: Spacing.four,
    width: 220,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.two,
  },
  signedInAs: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two + 2,
    minHeight: 40,
  },
  itemPressed: {
    opacity: 0.6,
  },
  itemText: {
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
});
