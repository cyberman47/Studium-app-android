import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ScreenHeader } from '@/components/screen-header';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The redesigned Settings entry point — three clearly separated
// categories rather than one long list, reached from More > Settings
// (renamed from "Your Profile", which is now one row inside App >
// Account). Mobile gets this stacked category list; on a wide viewport
// (react-native-web) the same three rows would read naturally as a
// sidebar's top level without needing a second layout — this app doesn't
// have a real desktop surface today, so a literal side-by-side sidebar
// isn't built, but nothing here is mobile-only either.
export function SettingsHubScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Settings" />

          <GroupedList>
            <ListRow
              icon="person-circle-outline"
              iconColor={theme.primary}
              iconBackground={theme.primaryMuted}
              title="App"
              subtitle="Account, preferences, subscription, and more"
              onPress={() => router.push('/settings-app')}
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
});
