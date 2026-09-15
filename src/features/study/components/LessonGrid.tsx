import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type LessonGridItem = { id?: string; title: string; subtitle: string };

function LessonCard({
  item,
  icon,
  iconColor,
  iconBackground,
  onPress,
}: {
  item: LessonGridItem;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.shadowWrap, Shadow.card]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}: ${item.subtitle}`}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && { backgroundColor: theme.backgroundSelected },
        ]}>
        <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <ThemedText numberOfLines={3} style={styles.title}>
          {item.title}
        </ThemedText>
        <ThemedText numberOfLines={2} themeColor="textSecondary" style={styles.subtitle}>
          {item.subtitle}
        </ThemedText>
      </Pressable>
    </View>
  );
}

// A 2-column grid of square-ish cards — mirrors StudyingPathsSection's
// track-card look (icon circle, bold title, muted meta line) — used as
// an alternate layout for TrackDetailScreen's topic/section list in
// place of the original GroupedList+ListRow vertical list, per feedback
// that the list felt too plain.
//
// Deliberately its own component/file, not a change to the shared
// ListRow/GroupedList used elsewhere in the app: nothing outside
// TrackDetailScreen.tsx references this file, so reverting to the list
// layout later is a one-line swap back there, not a hunt through the
// rest of the app.
export function LessonGrid({
  items,
  icon,
  iconColor,
  iconBackground,
  onPressItem,
}: {
  items: LessonGridItem[];
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  onPressItem?: (item: LessonGridItem) => void;
}) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.id ?? item.title} style={styles.gridItem}>
          <LessonCard
            item={item}
            icon={icon}
            iconColor={iconColor}
            iconBackground={iconBackground}
            onPress={onPressItem ? () => onPressItem(item) : undefined}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '47%',
    flexGrow: 1,
  },
  shadowWrap: {
    borderRadius: Radius.lg,
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 132,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12,
    lineHeight: 17,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 15,
  },
});
