import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { findTrack } from './tracks';
import { trackDetails } from './trackDetails';

// What tapping a Studying Paths card actually opens now — a real topic/
// lesson list for that track, mirrored from the web app's own lib/
// *Path.ts files (see trackDetails.ts). The mobile equivalent of
// drilling into one of the web's Learning Paths "Browse Paths" cards.
export function TrackDetailScreen({ id }: { id: string }) {
  const theme = useTheme();
  const track = findTrack(id);
  const detail = track ? trackDetails[track.id] : undefined;

  if (!track || !detail) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={styles.inner}>
          <ScreenHeader title="Not found" />
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            That studying path doesn't exist.
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
          <ScreenHeader title={track.name} />

          <View style={styles.metaRow}>
            <View style={[styles.metaPill, { backgroundColor: track.bg }]}>
              <ThemedText style={[styles.metaPillText, { color: track.fg }]}>{track.meta}</ThemedText>
            </View>
          </View>

          <ThemedText themeColor="textSecondary" style={styles.description}>
            {detail.description}
          </ThemedText>

          <GroupedList>
            {detail.rows.map((row) => (
              <ListRow
                key={row.title}
                icon={track.icon}
                iconColor={track.fg}
                iconBackground={track.bg}
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
  metaRow: {
    flexDirection: 'row',
    marginTop: -6,
  },
  metaPill: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: 5,
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
});
