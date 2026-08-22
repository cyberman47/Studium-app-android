import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { type StudyGroup, mockStudyGroups } from './data';

function GroupCard({ group, onToggle }: { group: StudyGroup; onToggle: () => void }) {
  const theme = useTheme();
  return (
    <View style={[styles.shadowWrap, Shadow.card]}>
      <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <View style={styles.topRow}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
            <Ionicons name="people-outline" size={18} color={theme.primary} />
          </View>
          <View style={[styles.categoryPill, { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText themeColor="textSecondary" style={styles.categoryText}>
              {group.category}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.name}>{group.name}</ThemedText>
        <ThemedText themeColor="textSecondary" numberOfLines={2} style={styles.description}>
          {group.description}
        </ThemedText>

        <View style={styles.footerRow}>
          <ThemedText themeColor="textSecondary" style={styles.memberCount}>
            {group.memberCount} member{group.memberCount === 1 ? '' : 's'}
          </ThemedText>
          <Pressable
            onPress={onToggle}
            accessibilityRole="button"
            accessibilityLabel={group.joined ? `Leave ${group.name}` : `Join ${group.name}`}
            style={({ pressed }) => [
              styles.joinButton,
              group.joined
                ? { borderWidth: StyleSheet.hairlineWidth, borderColor: theme.border }
                : { backgroundColor: theme.primary },
              pressed && styles.joinButtonPressed,
            ]}>
            <ThemedText style={[styles.joinButtonText, { color: group.joined ? theme.textSecondary : '#FFFFFF' }]}>
              {group.joined ? 'Joined' : 'Join'}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// The mobile equivalent of the web app's Study Groups
// (app/dashboard/(main)/community/study-groups/page.tsx) — same four
// real seed groups (supabase/migrations/0011_study_groups.sql), same
// real join/leave toggle.
export function StudyGroupsScreen() {
  const theme = useTheme();
  const [groups, setGroups] = useState(mockStudyGroups);

  function toggle(id: string) {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, joined: !g.joined } : g)));
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Study Groups" />
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Find your people — real members, real discussions.
          </ThemedText>

          {groups.map((group) => (
            <GroupCard key={group.id} group={group} onToggle={() => toggle(group.id)} />
          ))}
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
    marginTop: -8,
  },
  shadowWrap: {
    borderRadius: Radius.lg,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPill: {
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  memberCount: {
    fontSize: 11,
    fontWeight: '600',
  },
  joinButton: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: 7,
    minHeight: 32,
    justifyContent: 'center',
  },
  joinButtonPressed: {
    opacity: 0.8,
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
