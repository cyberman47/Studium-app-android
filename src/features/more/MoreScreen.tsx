import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// What the Profile tab's gear icon opens now — a real menu hub, not a
// straight jump into profile editing. "Your Profile" (the avatar/
// username/bio editor) is one destination among several here, the same
// shape most apps' "More"/Settings hub takes. A settings menu is a
// genuine list — the one place this app's "vary the pattern by content
// type" rule says a grouped list is still the right call.
export function MoreScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="More" />

          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              ACCOUNT
            </ThemedText>
            <GroupedList>
              <ListRow
                icon="person-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Your Profile"
                subtitle="Name, avatar, bio"
                onPress={() => router.push('/settings')}
              />
            </GroupedList>
          </View>

          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              PREFERENCES
            </ThemedText>
            <GroupedList>
              <ListRow
                icon="notifications-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Notifications"
                subtitle="Reminders, replies, and updates"
                onPress={() => router.push('/notifications')}
              />
            </GroupedList>
          </View>

          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              COMMUNITY
            </ThemedText>
            <GroupedList>
              <ListRow
                icon="person-add-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Invite Friends"
                subtitle="Share Studium with your study group"
                onPress={() => router.push('/invite')}
              />
              <ListRow
                icon="trophy-outline"
                iconColor={theme.amber}
                iconBackground={theme.amberMuted}
                title="Challenges"
                subtitle="Join a challenge, track real progress"
                onPress={() => router.push('/challenges')}
              />
            </GroupedList>
          </View>

          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              SUPPORT
            </ThemedText>
            <GroupedList>
              <ListRow
                icon="help-circle-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Help & Support"
                subtitle="FAQs and how to reach us"
                onPress={() => router.push('/help')}
              />
              <ListRow
                icon="information-circle-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="About Studium"
                subtitle="Version, links, and credits"
                onPress={() => router.push('/about')}
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
    paddingBottom: Spacing.six,
  },
  inner: {
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.four,
  },
  section: {
    gap: Spacing.two,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
});
