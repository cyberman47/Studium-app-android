import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { MCATSectionCardData, mcatSectionCards } from '../mcatSectionCards';

// ONLY the MCAT track's section grid — every other Studying Path still
// renders LessonGrid.tsx. Deliberately its own file/component so this
// redesign doesn't ripple into Nursing/Anatomy/USMLE/etc.; reverting is
// a one-line swap back to <LessonGrid ... /> in TrackDetailScreen.tsx.
//
// Card anatomy: icon (MaterialCommunityIcons — the one place this app
// reaches past its usual Ionicons-only convention, since Ionicons has no
// DNA/brain glyphs and this card asked for them specifically) in a
// tinted circle + a completed/total status pill up top; title
// (2-line clamp so long MCAT section names don't throw off row heights)
// and subject tags in the middle; a progress bar + lesson counter at the
// bottom. Colors are read from the app's real theme tokens (useTheme()),
// not hardcoded, so this still respects the user's actual Appearance
// setting (System/Light/Dark) instead of forcing a fixed dark card.
function MCATSectionCard({ item, onPress }: { item: MCATSectionCardData; onPress?: () => void }) {
  const theme = useTheme();
  const percent = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
  const started = item.completed > 0;

  return (
    <View style={[styles.shadowWrap, Shadow.card]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}: ${item.completed} of ${item.total} lessons complete`}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && { backgroundColor: theme.backgroundSelected },
        ]}>
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
            <MaterialCommunityIcons name={item.icon} size={20} color={theme.primary} />
          </View>
          <View style={[styles.pill, { backgroundColor: started ? theme.primaryMuted : theme.border }]}>
            <ThemedText style={[styles.pillText, { color: started ? theme.primary : theme.textSecondary }]} numberOfLines={1}>
              {item.completed}/{item.total} Lessons
            </ThemedText>
          </View>
        </View>

        <View style={styles.body}>
          <ThemedText numberOfLines={2} style={styles.title}>
            {item.title}
          </ThemedText>
          <ThemedText numberOfLines={1} themeColor="textSecondary" style={styles.tags}>
            {item.tags.join(' • ')}
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <View style={[styles.track, { backgroundColor: theme.border }]}>
            <View style={[styles.fill, { backgroundColor: theme.primary, width: `${percent}%` }]} />
          </View>
          <ThemedText themeColor="textSecondary" style={styles.footerText}>
            {item.completed} of {item.total} lessons · {percent}%
          </ThemedText>
        </View>
      </Pressable>
    </View>
  );
}

export function MCATSectionGrid({ onPressItem }: { onPressItem?: (item: MCATSectionCardData) => void }) {
  return (
    <View style={styles.grid}>
      {mcatSectionCards.map((item) => (
        <View key={item.id} style={styles.gridItem}>
          <MCATSectionCard item={item} onPress={onPressItem ? () => onPressItem(item) : undefined} />
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
    padding: 14,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: '58%',
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  body: {
    marginTop: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    minHeight: 36,
  },
  tags: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  footer: {
    marginTop: 12,
    gap: 6,
  },
  track: {
    height: 5,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
