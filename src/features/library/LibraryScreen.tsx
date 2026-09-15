import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { useMyContent } from '@/features/mycontent/store';

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
//
// A plain pushed screen (/library) now, not a bottom tab — reached from
// the Learn tab's "Library" section — so it uses ScreenHeader's
// back-button instead of the bare title a tab screen doesn't need one
// for.
export function LibraryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const data = mockLibrary;
  const { flashcardSets } = useMyContent();

  function openItem(id: string) {
    router.push(`/libraryitem/${id}`);
  }

  const myContentSubtitle =
    flashcardSets.length === 0
      ? 'Add your first flashcard set from Create'
      : `${flashcardSets.length} set${flashcardSets.length === 1 ? '' : 's'}`;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Library" />
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Explore lessons, articles, resources, and community content.
          </ThemedText>

          <LibraryCategoryGrid data={data} onPressCategory={openItem} />

          <View>
            <ThemedText themeColor="textSecondary" style={styles.label}>
              MORE FROM YOUR WORKSPACE
            </ThemedText>
            <GroupedList>
              <ListRow
                icon="add-circle-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="My Content"
                subtitle={myContentSubtitle}
                onPress={() => router.push('/my-content')}
              />
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
    paddingBottom: Spacing.six,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 12,
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
