import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow } from '@/constants/theme';
import { useResolvedThemeName, useTheme } from '@/hooks/use-theme';

import { MCATSectionCardData, mcatSectionCards } from '../mcatSectionCards';

// ONLY the MCAT track's section list — every other Studying Path still
// renders LessonGrid.tsx. Deliberately its own file/component so this
// redesign doesn't ripple into Nursing/Anatomy/USMLE/etc.
//
// The #0F1B2B / #009B77 palette is real, but — unlike the first version
// of this file — it's now applied per resolved theme rather than fixed
// regardless of the user's Appearance setting: #0F1B2B was always meant
// as the *dark-mode* card surface (it's how the web app itself already
// uses these two colors — #009B77 as a universal accent, #0F1B2B as a
// heading/surface tone that only shows up in dark contexts there, never
// forced on top of a light screen). Light mode gets a plain white card
// with dark-navy text instead, matching every other card in this app.
const ACCENT = '#009B77';

function useMcatPalette() {
  const theme = useTheme();
  const isDark = useResolvedThemeName() === 'dark';
  return {
    cardBg: isDark ? '#0F1B2B' : '#FFFFFF',
    cardBgPressed: isDark ? '#152640' : theme.backgroundSelected,
    titleColor: isDark ? '#FFFFFF' : '#0F1B2B',
    accent: ACCENT,
    accentMuted: isDark ? 'rgba(0, 155, 119, 0.18)' : 'rgba(0, 155, 119, 0.12)',
    border: theme.border,
    trackBg: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(15, 27, 43, 0.08)',
    badgeMutedBg: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 27, 43, 0.05)',
    textMuted: theme.textSecondary,
    chevron: theme.textSecondary,
  };
}

function MCATSectionRow({ item, onPress }: { item: MCATSectionCardData; onPress?: () => void }) {
  const palette = useMcatPalette();
  const percent = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
  const started = item.completed > 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}: ${item.completed} of ${item.total} lessons complete`}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? palette.cardBgPressed : palette.cardBg, borderColor: palette.border },
      ]}>
      {/* Left: icon + title/tags stacked */}
      <View style={styles.left}>
        <View style={[styles.iconCircle, { backgroundColor: palette.accentMuted }]}>
          <MaterialCommunityIcons name={item.icon} size={20} color={palette.accent} />
        </View>
        <View style={styles.textCol}>
          <ThemedText numberOfLines={2} style={[styles.title, { color: palette.titleColor }]}>
            {item.title}
          </ThemedText>
          <ThemedText numberOfLines={1} style={[styles.tags, { color: palette.textMuted }]}>
            {item.tags.join(' • ')}
          </ThemedText>
        </View>
      </View>

      {/* Right: progress badge + bar, then a trailing chevron */}
      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: started ? palette.accentMuted : palette.badgeMutedBg }]}>
          <ThemedText numberOfLines={1} style={[styles.badgeText, { color: started ? palette.accent : palette.textMuted }]}>
            {item.completed}/{item.total} Lessons
          </ThemedText>
        </View>
        <View style={[styles.track, { backgroundColor: palette.trackBg }]}>
          <View style={[styles.fill, { backgroundColor: palette.accent, width: `${percent}%` }]} />
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={palette.chevron} />
    </Pressable>
  );
}

export function MCATSectionList({ onPressItem }: { onPressItem?: (item: MCATSectionCardData) => void }) {
  return (
    <View style={styles.list}>
      {mcatSectionCards.map((item) => (
        <View key={item.id} style={[styles.shadowWrap, Shadow.card]}>
          <MCATSectionRow item={item} onPress={onPressItem ? () => onPressItem(item) : undefined} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 92,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  tags: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
    width: 96,
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: '100%',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  track: {
    height: 4,
    width: '100%',
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
