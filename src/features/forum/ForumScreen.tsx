import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { mockForumPosts } from './data';

// The mobile equivalent of the web app's Community Forum
// (app/dashboard/(main)/community/forum/*) — browsing only for now
// (posting a new thread needs a composer this pass doesn't build), same
// as every other mock-data screen in this app so far.
export function ForumScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Forum" />
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Real questions from real students.
          </ThemedText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ask the community"
            style={({ pressed }) => [
              styles.askButton,
              { backgroundColor: theme.primary },
              pressed && styles.askButtonPressed,
            ]}>
            <Ionicons name="add-circle-outline" size={17} color="#FFFFFF" />
            <ThemedText numberOfLines={1} style={styles.askButtonText}>
              Ask the Community
            </ThemedText>
          </Pressable>

          <GroupedList>
            {mockForumPosts.map((post) => (
              <ListRow
                key={post.id}
                icon="chatbubble-ellipses-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title={post.title}
                subtitle={`${post.category} · ${post.relativeTime} · ${post.reactionCount} reactions · ${post.commentCount} comments`}
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
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: -8,
  },
  askButton: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.pill,
    paddingVertical: 13,
    paddingHorizontal: Spacing.three,
    minHeight: 46,
  },
  askButtonPressed: {
    opacity: 0.85,
  },
  askButtonText: {
    flexShrink: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
