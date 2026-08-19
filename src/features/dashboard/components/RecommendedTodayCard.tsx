import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Matches the web dashboard's real "Recommended for Today" card
// (app/dashboard/(main)/page.tsx): a teal-tinted panel, not the neutral
// white card every other section uses — it's meant to stand out as today's
// single actionable pick, not blend in as just another status card.
export function RecommendedTodayCard({
  subjectName,
  label,
  kp,
  minutes,
  onPress,
}: {
  subjectName: string;
  label: string;
  kp: number;
  minutes: number;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.primaryMuted, borderColor: theme.border }]}>
      <ThemedText themeColor="primary" style={styles.eyebrow}>
        Recommended for Today
      </ThemedText>
      <ThemedText style={styles.subject}>{subjectName}</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="flash" size={12} color={theme.primary} />
          <ThemedText themeColor="textSecondary" style={styles.metaText}>
            +{kp} KP
          </ThemedText>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={12} color={theme.textSecondary} />
          <ThemedText themeColor="textSecondary" style={styles.metaText}>
            ~{minutes} min
          </ThemedText>
        </View>
      </View>

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Start studying ${subjectName}: ${label}`}
        hitSlop={8}
        style={({ pressed }) => [
          styles.cta,
          { backgroundColor: theme.primary },
          pressed && styles.ctaPressed,
        ]}>
        <Ionicons name="play" size={13} color="#FFFFFF" />
        <ThemedText style={styles.ctaText}>Start Studying</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  subject: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: Spacing.two,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 8,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.three,
    marginTop: Spacing.four,
    minHeight: 44,
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
