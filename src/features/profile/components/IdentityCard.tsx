import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/features/dashboard/components/Card';

// Who the other student sees — name, avatar, current path, level, and when
// they joined. The one card on this screen allowed a bit more presence
// than the list below it, same way ContinueCard is the one loud element
// on Home; everything else here stays quiet by comparison.
export function IdentityCard({
  name,
  avatarInitial,
  pathLabel,
  pathEmoji,
  level,
  levelName,
  joinedLabel,
  onShare,
}: {
  name: string;
  avatarInitial: string;
  pathLabel: string;
  pathEmoji: string;
  level: number;
  levelName: string;
  joinedLabel: string;
  onShare?: () => void;
}) {
  const theme = useTheme();
  return (
    <Card>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: theme.primaryMuted }]}>
          <ThemedText themeColor="primary" style={styles.avatarText}>
            {avatarInitial}
          </ThemedText>
        </View>

        <View style={styles.info}>
          <ThemedText numberOfLines={1} style={styles.name}>
            {name}
          </ThemedText>
          <View style={styles.pillRow}>
            <View
              style={[
                styles.pill,
                { backgroundColor: theme.backgroundSelected, borderColor: theme.border },
              ]}>
              <ThemedText numberOfLines={1} style={styles.pillText}>
                {pathEmoji} {pathLabel}
              </ThemedText>
            </View>
            <View style={[styles.pill, styles.levelPill, { backgroundColor: theme.primaryMuted }]}>
              <ThemedText themeColor="primary" numberOfLines={1} style={styles.pillText}>
                Level {level} · {levelName}
              </ThemedText>
            </View>
          </View>
        </View>

        <Pressable
          onPress={onShare}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Share your passport"
          style={({ pressed }) => [styles.shareButton, pressed && styles.shareButtonPressed]}>
          <Ionicons name="share-outline" size={16} color={theme.textSecondary} />
        </Pressable>
      </View>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Ionicons name="calendar-outline" size={12} color={theme.textSecondary} />
        <ThemedText themeColor="textSecondary" style={styles.joined}>
          Joined {joinedLabel}
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two + 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    flexShrink: 1,
    maxWidth: '100%',
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
  levelPill: {
    borderColor: 'transparent',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  shareButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonPressed: {
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  joined: {
    fontSize: 11,
    fontWeight: '500',
  },
});
