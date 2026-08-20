import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { LibraryData } from '../data';

// Mirrors the web app's Library page's six main categories exactly
// (app/dashboard/(main)/library/page.tsx) — same order, same one-line
// descriptions, same uniform teal icon tint (unlike Study's per-track
// rainbow, every Library category is the same "content" kind, so one
// color reads more honestly than seven).
function useCategories(data: LibraryData) {
  return [
    {
      key: 'lessons',
      icon: 'book-outline' as const,
      label: 'All Lessons',
      desc: 'Every official Studium lesson, browsable by subject and difficulty.',
      count: `${data.lessons} lesson${data.lessons === 1 ? '' : 's'}`,
    },
    {
      key: 'saved',
      icon: 'layers-outline' as const,
      label: 'Saved',
      desc: "Everything you've bookmarked — Studium and Community content together.",
      count: `${data.saved} saved`,
    },
    {
      key: 'recent',
      icon: 'time-outline' as const,
      label: 'Recently Added',
      desc: 'The newest official lessons and community study guides.',
      count: 'Updated regularly',
    },
    {
      key: 'community',
      icon: 'globe-outline' as const,
      label: 'Community',
      desc: 'Study guides published by fellow students — preview, then add.',
      count: `${data.community} shared`,
    },
    {
      key: 'articles',
      icon: 'document-text-outline' as const,
      label: 'Articles',
      desc: 'Short, focused reads on real study skills and exam concepts.',
      count: `${data.articles} article${data.articles === 1 ? '' : 's'}`,
    },
    {
      key: 'resources',
      icon: 'link-outline' as const,
      label: 'Resources',
      desc: 'Real reference material and official sources worth bookmarking.',
      count: `${data.resources} resource${data.resources === 1 ? '' : 's'}`,
    },
  ];
}

function CategoryCard({
  icon,
  label,
  desc,
  count,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  desc: string;
  count: string;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.shadowWrap, Shadow.card]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${desc} ${count}`}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && { backgroundColor: theme.backgroundSelected },
        ]}>
        <View style={styles.topRow}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
            <Ionicons name={icon} size={19} color={theme.primary} />
          </View>
          <Ionicons name="arrow-forward" size={14} color={theme.textSecondary} />
        </View>
        <ThemedText numberOfLines={1} style={styles.label}>
          {label}
        </ThemedText>
        <ThemedText numberOfLines={2} themeColor="textSecondary" style={styles.desc}>
          {desc}
        </ThemedText>
        <ThemedText themeColor="primary" numberOfLines={1} style={styles.count}>
          {count}
        </ThemedText>
      </Pressable>
    </View>
  );
}

export function LibraryCategoryGrid({
  data,
  onPressCategory,
}: {
  data: LibraryData;
  onPressCategory?: (key: string) => void;
}) {
  const categories = useCategories(data);
  return (
    <View style={styles.grid}>
      {categories.map((c) => (
        <View key={c.key} style={styles.gridItem}>
          <CategoryCard
            icon={c.icon}
            label={c.label}
            desc={c.desc}
            count={c.count}
            onPress={onPressCategory ? () => onPressCategory(c.key) : undefined}
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
    minHeight: 148,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
  },
  desc: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
    marginTop: 4,
  },
  count: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginTop: Spacing.two,
  },
});
