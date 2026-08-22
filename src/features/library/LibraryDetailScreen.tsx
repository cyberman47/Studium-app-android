import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { type LibraryItemId, libraryDetails } from './libraryDetails';

// What tapping a Library card or "More from your workspace" row actually
// opens now — a real list for that category, same pattern as Study
// Paths' track detail screens.
export function LibraryDetailScreen({ id }: { id: string }) {
  const theme = useTheme();
  const detail = libraryDetails[id as LibraryItemId];

  if (!detail) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={styles.inner}>
          <ScreenHeader title="Not found" />
          <ThemedText themeColor="textSecondary" style={styles.description}>
            That Library section doesn't exist.
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title={detail.title} />
          <ThemedText themeColor="textSecondary" style={styles.description}>
            {detail.description}
          </ThemedText>

          <GroupedList>
            {detail.rows.map((row) => (
              <ListRow
                key={row.title}
                icon={detail.icon}
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title={row.title}
                subtitle={row.subtitle}
              />
            ))}
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
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
});
