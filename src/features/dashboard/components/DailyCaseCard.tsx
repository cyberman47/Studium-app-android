import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';

// The one exception to the Home screen's grouped-list pattern: Daily Case
// stays a distinct, high-priority dark card rather than folding into the
// list below it — but shrunk to roughly list-row height plus the one
// extra line the case title needs, not the full card it used to be. The
// whole card is the tap target now (trailing chevron), no separate CTA.
export function DailyCaseCard({
  title,
  category,
  difficulty,
  onPress,
}: {
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  onPress?: () => void;
}) {
  return (
    <View style={[styles.shadowWrap, Shadow.raised]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Daily case challenge: ${title}, ${category}, ${difficulty}`}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <Ionicons name="pulse" size={90} color="rgba(255,255,255,0.05)" style={styles.watermark} />

        <View style={[styles.iconCircle]}>
          <Ionicons name="pulse-outline" size={16} color="#5EEAD4" />
        </View>

        <View style={styles.textCol}>
          <ThemedText numberOfLines={1} style={styles.eyebrow}>
            DAILY CASE <ThemedText style={styles.eyebrowMeta}>· {category} · {difficulty}</ThemedText>
          </ThemedText>
          <ThemedText style={styles.title} numberOfLines={2}>
            {title}
          </ThemedText>
        </View>

        <Ionicons name="chevron-forward" size={16} color="#5EEAD4" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
    backgroundColor: '#0F172A',
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 14,
    paddingHorizontal: 18,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
  },
  watermark: {
    position: 'absolute',
    right: -16,
    top: -16,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(94, 234, 212, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  eyebrow: {
    color: '#5EEAD4',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  eyebrowMeta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '400',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
});
