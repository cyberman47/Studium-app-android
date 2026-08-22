import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { LibraryCategoryGrid } from './components/LibraryCategoryGrid';
import { mockLibrary } from './data';

// The mobile equivalent of the web app's Library page
// (app/dashboard/(main)/library/page.tsx): the six main categories as a
// card grid, then a compact "More from your workspace" list for the
// features that predate that page's redesign (decks, flagged questions,
// the mistake vault). The web page also surfaces a full Daily Case widget
// with its own accuracy/streak stats and an archive calendar — that's
// already the Home dashboard's Daily Case card here, so it isn't
// duplicated on this tab too.
//
// Every card and row is a real, working button now — each opens a
// LibraryDetailScreen (app/libraryitem/[id].tsx) with real content.
export function LibraryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const data = mockLibrary;

  function openItem(id: string) {
    router.push(`/libraryitem/${id}`);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Library</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Explore lessons, articles, resources, and community content.
            </ThemedText>
          </View>

          <LibraryCategoryGrid data={data} onPressCategory={openItem} />

          <View>
            <ThemedText themeColor="textSecondary" style={styles.label}>
              MORE FROM YOUR WORKSPACE
            </ThemedText>
            <GroupedList>
              <ListRow
                icon="albums-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="My Decks"
                subtitle={`${data.decks} deck${data.decks === 1 ? '' : 's'}`}
                onPress={() => openItem('decks')}
              />
              <ListRow
                icon="flag-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Flagged Questions"
                subtitle={`${data.flagged} flagged`}
                onPress={() => openItem('flagged')}
              />
              <ListRow
                icon="alert-circle-outline"
                iconColor={theme.rose}
                iconBackground={theme.roseMuted}
                title="Mistake Vault"
                subtitle={`${data.missed} to review`}
                onPress={() => openItem('mistakes')}
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
  label: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    marginBottom: Spacing.two + 2,
  },
});
