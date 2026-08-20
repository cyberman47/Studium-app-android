import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { IdentityCard } from './components/IdentityCard';
import { PassportCard } from './components/PassportCard';
import { ProfileStatChips } from './components/ProfileStatChips';
import { mockProfile } from './data';

// The mobile equivalent of the web app's Community "My Profile" page
// (app/dashboard/(main)/community/profile/page.tsx) — same identity, same
// stats, same Passport and Recent Posts/Community Activity sections, but
// composed with the same "vary the visual weight" language as the Home
// restructure: one card for identity, a light tinted-chip row for the
// headline numbers, one more card for the Passport (it's the one
// gamified feature here, so it earns the extra presence), then a single
// grouped list for the two currently-empty activity sections instead of
// two more near-empty full-height cards.
export function ProfileScreen() {
  const theme = useTheme();
  const data = mockProfile;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>My Profile</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              What other students see about you.
            </ThemedText>
          </View>

          <IdentityCard
            name={data.name}
            avatarInitial={data.avatarInitial}
            pathLabel={data.pathLabel}
            pathEmoji={data.pathEmoji}
            level={data.level}
            levelName={data.levelName}
            joinedLabel={data.joinedLabel}
          />

          <ProfileStatChips totalKP={data.totalKP} streakDays={data.streakDays} />

          <PassportCard
            unlocked={data.achievementsUnlocked}
            total={data.achievementsTotal}
            topicsMasteredCount={data.topicsMasteredCount}
          />

          <GroupedList>
            <ListRow
              icon="chatbubbles-outline"
              iconColor={theme.primary}
              iconBackground={theme.primaryMuted}
              title="Recent Posts"
              subtitle={
                data.hasPosts
                  ? 'Your latest activity in the Forum'
                  : "You haven't posted yet — Ask the Community"
              }
            />
            <ListRow
              icon="sparkles-outline"
              iconColor={theme.primary}
              iconBackground={theme.primaryMuted}
              title="Community Activity"
              subtitle={
                data.hasCommunityActivity
                  ? 'Discussions, answers, and reactions'
                  : 'Not available yet — post to start building this'
              }
            />
          </GroupedList>
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
    paddingBottom: BottomTabInset + Spacing.five,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 12,
  },
  header: {
    gap: 2,
    marginBottom: 2,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 29,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
});
