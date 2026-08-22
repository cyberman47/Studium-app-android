import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { IdentityCard } from './components/IdentityCard';
import { PassportCard } from './components/PassportCard';
import { ProfileStatChips } from './components/ProfileStatChips';
import { mockProfile } from './data';
import { useEditableProfile } from './store';

// The mobile equivalent of the web app's Community "My Profile" page
// (app/dashboard/(main)/community/profile/page.tsx) — same identity, same
// stats, same Passport and Recent Posts/Community Activity sections, plus
// a tile grid into the rest of Community (Forum, Challenges, Study
// Groups, Contribute — lib/dashboardNav.ts's five Community children,
// this tab being "My Profile"). Composed with the same "vary the visual
// weight, and vary the visual pattern by what the content actually is"
// language as the rest of this app: one card for identity, a light
// tinted-chip row for the headline numbers, one more card for the
// Passport (it's the one gamified feature here, so it earns the extra
// presence), a list for the two activity feeds (Recent Posts/Community
// Activity — those genuinely are feeds), and a tile grid for Community
// (a hub you go somewhere from, not content you scan).
// Community is a hub into four destinations, not a feed to scan — a 2x2
// tile grid reads as "go somewhere" the way a settings-style list of
// chevron rows doesn't.
function CommunityTile({
  icon,
  iconColor,
  iconBackground,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  label: string;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.tileWrap}>
      <View style={[styles.tileShadow, Shadow.card]}>
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          style={({ pressed }) => [
            styles.tile,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            pressed && { backgroundColor: theme.backgroundSelected },
          ]}>
          <View style={[styles.tileIcon, { backgroundColor: iconBackground }]}>
            <Ionicons name={icon} size={19} color={iconColor} />
          </View>
          <ThemedText numberOfLines={1} style={styles.tileLabel}>
            {label}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

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
            <View style={styles.communityGrid}>
              <CommunityTile
                icon="chatbubble-ellipses-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                label="Forum"
                onPress={() => router.push('/forum')}
              />
              <CommunityTile
                icon="trophy-outline"
                iconColor={theme.amber}
                iconBackground={theme.amberMuted}
                label="Challenges"
                onPress={() => router.push('/challenges')}
              />
              <CommunityTile
                icon="people-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                label="Study Groups"
                onPress={() => router.push('/study-groups')}
              />
              <CommunityTile
                icon="add-circle-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                label="Contribute"
                onPress={() => router.push('/contribute')}
              />
            </View>
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
  communityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tileWrap: {
    width: '47%',
    flexGrow: 1,
  },
  tileShadow: {
    borderRadius: Radius.lg,
  },
  tile: {
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 18,
    gap: 8,
  },
  tileIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
});
