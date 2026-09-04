import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { logOut } from '@/features/auth/store';
import { useTheme } from '@/hooks/use-theme';

// The one real Settings destination — reached from Profile's gear icon
// and its "Settings" row alike. Used to be split three ways: this hub
// only listed App/Reader/Review, "App" was its own extra screen nesting
// Account/General/Subscription/Feedback/About a level deeper, and the
// gear icon bypassed all of that to open a *different* screen (/more)
// for Notifications/Invite Friends/Challenges/Help/About/Log Out —
// three inconsistent "settings-ish" starting points, two of them
// duplicating destinations Profile itself also linked to directly. This
// flattens all of it into one screen, one level deep: every real setting
// or account/support action lives here, grouped, nothing bypasses it.
export function SettingsHubScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogOut() {
    setLoggingOut(true);
    // Real Supabase sign-out — replace, not push, so going back doesn't
    // drop the student right back into the app they just left.
    await logOut();
    setLoggingOut(false);
    router.replace('/signup');
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Settings" />

          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              ACCOUNT
            </ThemedText>
            <GroupedList>
              <ListRow
                icon="person-circle-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Account"
                subtitle="Name, email, password, and account details"
                onPress={() => router.push('/settings-account')}
              />
              <ListRow
                icon="card-outline"
                iconColor={theme.amber}
                iconBackground={theme.amberMuted}
                title="Subscription"
                subtitle="Plan, billing, and renewal"
                onPress={() => router.push('/settings-subscription')}
              />
            </GroupedList>
          </View>

          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              PREFERENCES
            </ThemedText>
            <GroupedList>
              <ListRow
                icon="options-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="General"
                subtitle="Language, appearance, and notifications"
                onPress={() => router.push('/settings-general')}
              />
              <ListRow
                icon="book-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Reader"
                subtitle="How reading content looks, and text-to-speech"
                onPress={() => router.push('/settings-reader')}
              />
              <ListRow
                icon="albums-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Review"
                subtitle="Flashcard sessions and how you practice"
                onPress={() => router.push('/settings-review')}
              />
            </GroupedList>
          </View>

          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              SUPPORT
            </ThemedText>
            <GroupedList>
              <ListRow
                icon="chatbox-ellipses-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Give Feedback"
                subtitle="Tell us what's working and what isn't"
                onPress={() => router.push('/settings-feedback')}
              />
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

          <Pressable
            onPress={handleLogOut}
            disabled={loggingOut}
            accessibilityRole="button"
            accessibilityLabel="Log out"
            style={({ pressed }) => [
              styles.logOutButton,
              { borderColor: theme.roseMuted },
              pressed && !loggingOut && { backgroundColor: theme.roseMuted },
              loggingOut && styles.logOutButtonDisabled,
            ]}>
            <Ionicons name="log-out-outline" size={16} color={theme.rose} />
            <ThemedText themeColor="rose" style={styles.logOutText}>
              {loggingOut ? 'Logging out…' : 'Log Out'}
            </ThemedText>
          </Pressable>
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
  logOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 13,
  },
  logOutText: {
    fontSize: 14,
    fontWeight: '700',
  },
  logOutButtonDisabled: {
    opacity: 0.6,
  },
});
