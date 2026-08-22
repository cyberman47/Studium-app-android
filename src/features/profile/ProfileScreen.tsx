import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
import { useEditableProfile } from './store';

// The mobile equivalent of the web app's Community "My Profile" page
// (app/dashboard/(main)/community/profile/page.tsx) — same identity, same
// stats, same Passport and Recent Posts/Community Activity sections, plus
// a grouped list into the rest of Community (Forum, Challenges, Study
// Groups, Contribute — lib/dashboardNav.ts's five Community children,
// this tab being "My Profile"). Composed with the same "vary the visual
// weight" language as the Home restructure: one card for identity, a
// light tinted-chip row for the headline numbers, one more card for the
// Passport (it's the one gamified feature here, so it earns the extra
// presence), then two grouped lists instead of stacking near-empty cards.
export function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const data = mockProfile;
  const editable = useEditableProfile();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <ThemedText style={styles.title}>My Profile</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                What other students see about you.
              </ThemedText>
            </View>
            <Pressable
              onPress={() => router.push('/settings')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              style={({ pressed }) => [
                styles.settingsButton,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                pressed && styles.settingsButtonPressed,
              ]}>
              <Ionicons name="settings-outline" size={18} color={theme.text} />
            </Pressable>
          </View>

          <IdentityCard
            name={editable.name}
            avatarInitial={editable.name.trim().charAt(0).toUpperCase() || data.avatarInitial}
            avatarColor={editable.avatarColor}
            bio={editable.bio}
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
            onViewPassport={() => router.push('/passport')}
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
              onPress={() => router.push('/forum')}
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

          <View>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              COMMUNITY
            </ThemedText>
            <GroupedList>
              <ListRow
                icon="chatbubble-ellipses-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Forum"
                subtitle="Ask questions, share what's working"
                onPress={() => router.push('/forum')}
              />
              <ListRow
                icon="trophy-outline"
                iconColor={theme.amber}
                iconBackground={theme.amberMuted}
                title="Challenges"
                subtitle="Join a challenge, track real progress"
                onPress={() => router.push('/challenges')}
              />
              <ListRow
                icon="people-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Study Groups"
                subtitle="Find your people, by subject or exam"
                onPress={() => router.push('/study-groups')}
              />
              <ListRow
                icon="add-circle-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Contribute"
                subtitle="Publish lessons and study guides"
                onPress={() => router.push('/contribute')}
              />
            </GroupedList>
          </View>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginBottom: 2,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
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
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  settingsButtonPressed: {
    opacity: 0.7,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    marginBottom: Spacing.two + 2,
  },
});
