import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ScreenHeader } from '@/components/screen-header';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Settings > App. About and Notifications already exist as their own
// real screens (More > About Studium / More > Notifications) — this
// links straight to those rather than rebuilding them a second time, so
// there's exactly one real place each setting lives.
export function AppSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="App" />

          <GroupedList>
            <ListRow
              icon="person-outline"
              iconColor={theme.primary}
              iconBackground={theme.primaryMuted}
              title="Account"
              subtitle="Name, email, password, and account details"
              onPress={() => router.push('/settings-account')}
            />
          </GroupedList>

          <GroupedList>
            <ListRow
              icon="options-outline"
              iconColor={theme.primary}
              iconBackground={theme.primaryMuted}
              title="General"
              subtitle="Language, appearance, and notifications"
              onPress={() => router.push('/settings-general')}
            />
          </GroupedList>

          <GroupedList>
            <ListRow
              icon="card-outline"
              iconColor={theme.amber}
              iconBackground={theme.amberMuted}
              title="Subscription"
              subtitle="Plan, billing, and renewal"
              onPress={() => router.push('/settings-subscription')}
            />
          </GroupedList>

          <GroupedList>
            <ListRow
              icon="chatbox-ellipses-outline"
              iconColor={theme.primary}
              iconBackground={theme.primaryMuted}
              title="Give Feedback"
              subtitle="Tell us what's working and what isn't"
              onPress={() => router.push('/settings-feedback')}
            />
          </GroupedList>

          <GroupedList>
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
    gap: 14,
  },
});
