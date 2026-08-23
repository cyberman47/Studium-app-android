import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { useChatSessions } from './store';

function relativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

// Reached from the clock icon on Studium AI's header. Real conversations
// only — a session is saved the moment it gets its first reply (see
// AIChatScreen), so this list is never padded with placeholders. Tapping
// a row resumes that exact conversation by pushing back into /ai-chat
// with its session id.
export function ChatHistoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const sessions = useChatSessions();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Chat History" />
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Your past conversations with Studium AI.
          </ThemedText>

          {sessions.length === 0 ? (
            <View style={styles.emptyWrap}>
              <View style={[styles.emptyIcon, { backgroundColor: theme.primaryMuted }]}>
                <Ionicons name="time-outline" size={26} color={theme.primary} />
              </View>
              <ThemedText style={styles.emptyTitle}>No conversations yet</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.emptyDescription}>
                Chats you have with Studium AI will show up here.
              </ThemedText>
              <Pressable
                onPress={() => router.push('/ai-chat')}
                accessibilityRole="button"
                accessibilityLabel="Start a chat"
                style={({ pressed }) => [
                  styles.emptyButton,
                  { backgroundColor: theme.primary },
                  pressed && { opacity: 0.85 },
                ]}>
                <ThemedText style={styles.emptyButtonText}>Start a Chat</ThemedText>
              </Pressable>
            </View>
          ) : (
            <GroupedList>
              {sessions.map((session) => (
                <ListRow
                  key={session.id}
                  icon="chatbubble-ellipses-outline"
                  iconColor={theme.primary}
                  iconBackground={theme.primaryMuted}
                  title={session.title}
                  subtitle={`${relativeTime(session.updatedAt)} · ${session.messages.length} messages${session.lessonTitle ? ` · ${session.lessonTitle}` : ''}`}
                  onPress={() => router.push({ pathname: '/ai-chat', params: { session: session.id } })}
                />
              ))}
            </GroupedList>
          )}
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
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
    gap: 8,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptyDescription: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 260,
  },
  emptyButton: {
    marginTop: Spacing.two,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: 11,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
