import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Compact teaser for the Learn tab's "Library" section — four of
// LibraryScreen's own real six categories (see
// features/library/components/LibraryCategoryGrid.tsx), not an invented
// set, so this card never claims something Library itself doesn't
// actually have. The full grid (all six, with counts) lives at
// /library via "View Library".
const preview: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'book-outline', label: 'All Lessons' },
  { icon: 'document-text-outline', label: 'Articles' },
  { icon: 'link-outline', label: 'Resources' },
  { icon: 'layers-outline', label: 'Saved' },
];

export function LibraryPreviewCard({ onPress }: { onPress?: () => void }) {
  const theme = useTheme();
  return (
    <View style={[styles.shadowWrap, Shadow.card]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Library: lessons, articles, resources, and saved content"
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && { backgroundColor: theme.backgroundSelected },
        ]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="library-outline" size={13} color={theme.textSecondary} />
            <ThemedText themeColor="textSecondary" style={styles.headerText}>
              LIBRARY
            </ThemedText>
          </View>
          <View style={styles.viewLink}>
            <ThemedText themeColor="primary" style={styles.viewLinkText}>
              View Library
            </ThemedText>
            <Ionicons name="chevron-forward" size={12} color={theme.primary} />
          </View>
        </View>

        <View style={styles.row}>
          {preview.map((item) => (
            <View key={item.label} style={styles.item}>
              <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
                <Ionicons name={item.icon} size={16} color={theme.primary} />
              </View>
              <ThemedText numberOfLines={1} style={styles.itemLabel}>
                {item.label}
              </ThemedText>
            </View>
          ))}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  viewLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewLinkText: {
    fontSize: 11,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    gap: 6,
    width: 68,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
