import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow } from '@/constants/theme';

import { MCATSectionCardData, mcatSectionCards } from '../mcatSectionCards';

// ONLY the MCAT track's section list — every other Studying Path still
// renders LessonGrid.tsx. Deliberately its own file/component so this
// redesign doesn't ripple into Nursing/Anatomy/USMLE/etc.
//
// Was a 2x2 grid of square cards (see git history); now a vertical stack
// of full-width rows per follow-up feedback. Fixed dark-navy/teal
// palette (#0F1B2B / #009B77) below is intentionally NOT read from
// useTheme() like the rest of the app — per explicit request these exact
// colors stay fixed regardless of the user's own light/dark Appearance
// setting, unlike every other themed surface in Studium.
const CARD_BG = '#0F1B2B';
const CARD_BG_PRESSED = '#152640';
const ACCENT = '#009B77';
const ACCENT_MUTED = 'rgba(0, 155, 119, 0.16)';
const BORDER = 'rgba(255, 255, 255, 0.08)';
const TRACK_BG = 'rgba(255, 255, 255, 0.10)';
const BADGE_MUTED_BG = 'rgba(255, 255, 255, 0.06)';
const TEXT_MUTED = 'rgba(255, 255, 255, 0.55)';
const CHEVRON_COLOR = 'rgba(255, 255, 255, 0.35)';

function MCATSectionRow({ item, onPress }: { item: MCATSectionCardData; onPress?: () => void }) {
  const percent = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
  const started = item.completed > 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}: ${item.completed} of ${item.total} lessons complete`}
      style={({ pressed }) => [styles.row, { backgroundColor: pressed ? CARD_BG_PRESSED : CARD_BG, borderColor: BORDER }]}>
      {/* Left: icon + title/tags stacked */}
      <View style={styles.left}>
        <View style={[styles.iconCircle, { backgroundColor: ACCENT_MUTED }]}>
          <MaterialCommunityIcons name={item.icon} size={20} color={ACCENT} />
        </View>
        <View style={styles.textCol}>
          <ThemedText numberOfLines={2} style={[styles.title, { color: '#FFFFFF' }]}>
            {item.title}
          </ThemedText>
          <ThemedText numberOfLines={1} style={[styles.tags, { color: TEXT_MUTED }]}>
            {item.tags.join(' • ')}
          </ThemedText>
        </View>
      </View>

      {/* Right: progress badge + bar, then a trailing chevron */}
      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: started ? ACCENT_MUTED : BADGE_MUTED_BG }]}>
          <ThemedText numberOfLines={1} style={[styles.badgeText, { color: started ? ACCENT : TEXT_MUTED }]}>
            {item.completed}/{item.total} Lessons
          </ThemedText>
        </View>
        <View style={[styles.track, { backgroundColor: TRACK_BG }]}>
          <View style={[styles.fill, { backgroundColor: ACCENT, width: `${percent}%` }]} />
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={CHEVRON_COLOR} />
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
