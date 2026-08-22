import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { type AchievementCategory, categoryLabels, mockAchievements, rarityColors } from './data';

const categoryTabs: { id: AchievementCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  ...(Object.keys(categoryLabels) as AchievementCategory[]).map((id) => ({ id, label: categoryLabels[id] })),
];

// The mobile equivalent of the web app's Passport/Achievements section
// (now folded into app/dashboard/(main)/community/profile/page.tsx) —
// what "View Full Passport" on the Profile tab's PassportCard leads to.
export function PassportScreen() {
  const theme = useTheme();
  const [category, setCategory] = useState<AchievementCategory | 'all'>('all');
  const unlockedCount = mockAchievements.filter((a) => a.unlocked).length;
  const filtered = mockAchievements.filter((a) => category === 'all' || a.category === category);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Full Passport" />
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            {unlockedCount} of {mockAchievements.length} unlocked
          </ThemedText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}>
            {categoryTabs.map((tab) => {
              const active = tab.id === category;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setCategory(tab.id)}
                  accessibilityRole="button"
                  accessibilityLabel={tab.label}
                  accessibilityState={{ selected: active }}
                  style={[
                    styles.tab,
                    { backgroundColor: active ? theme.text : theme.backgroundSelected },
                  ]}>
                  <ThemedText
                    style={[styles.tabText, { color: active ? theme.background : theme.textSecondary }]}>
                    {tab.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.grid}>
            {filtered.map((achievement) => (
              <View key={achievement.id} style={styles.gridItem}>
                <View style={[styles.shadowWrap, Shadow.card]}>
                  <View
                    style={[
                      styles.card,
                      { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                    ]}>
                    <View style={styles.cardTopRow}>
                      <View style={[styles.iconCircle, { backgroundColor: theme.backgroundSelected }]}>
                        <Ionicons name="lock-closed-outline" size={16} color={theme.textSecondary} />
                      </View>
                      <View
                        style={[
                          styles.rarityPill,
                          { backgroundColor: `${rarityColors[achievement.rarity]}1F` },
                        ]}>
                        <ThemedText
                          style={[styles.rarityText, { color: rarityColors[achievement.rarity] }]}>
                          {achievement.rarity}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText numberOfLines={2} style={styles.cardTitle}>
                      {achievement.title}
                    </ThemedText>
                    <ThemedText numberOfLines={2} themeColor="textSecondary" style={styles.cardRequirement}>
                      {achievement.requirement}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {filtered.length === 0 && (
            <View style={[styles.empty, { borderColor: theme.border }]}>
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                Nothing here yet in this category.
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: Spacing.six,
  },
  inner: {
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 12,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  tabsRow: {
    gap: 8,
    paddingRight: Spacing.four,
  },
  tab: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
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
    minHeight: 130,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rarityPill: {
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rarityText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12,
  },
  cardRequirement: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
    marginTop: 4,
  },
  empty: {
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    padding: Spacing.four,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
});
