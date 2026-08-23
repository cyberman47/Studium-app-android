import { Ionicons } from '@expo/vector-icons';
import { Pressable, Share, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// A real invite flow: the "Share Invite" button opens the device's
// actual native share sheet (RN's built-in Share API — no backend
// needed for that part to genuinely work). There's no referral-tracking
// backend yet, so the code below is a real-looking placeholder, not a
// redeemable one — same honesty as everywhere else mock data is used in
// this app.
const inviteCode = 'STUDIUM-ALEX42';
const inviteMessage = `Join me on Studium — it's how I'm studying for the MCAT. Use my code ${inviteCode} when you sign up: https://studium-website-three.vercel.app`;

export function InviteScreen() {
  const theme = useTheme();

  async function handleShare() {
    try {
      await Share.share({ message: inviteMessage });
    } catch {
      // User dismissed the share sheet — nothing to do.
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.inner}>
        <ScreenHeader title="Invite Friends" />

        <View style={styles.center}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
            <Ionicons name="person-add-outline" size={28} color={theme.primary} />
          </View>
          <ThemedText style={styles.title}>Study together</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.description}>
            Share your invite code — when a friend joins, you'll both know exactly where the invite
            came from.
          </ThemedText>

          <View style={[styles.shadowWrap, Shadow.card]}>
            <View style={[styles.codeCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <ThemedText themeColor="textSecondary" style={styles.codeLabel}>
                YOUR CODE
              </ThemedText>
              <ThemedText selectable style={styles.code}>
                {inviteCode}
              </ThemedText>
            </View>
          </View>

          <Pressable
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Share invite"
            style={({ pressed }) => [
              styles.shareButton,
              { backgroundColor: theme.primary },
              pressed && styles.shareButtonPressed,
            ]}>
            <Ionicons name="share-outline" size={16} color="#FFFFFF" />
            <ThemedText style={styles.shareButtonText}>Share Invite</ThemedText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 300,
  },
  shadowWrap: {
    borderRadius: Radius.lg,
    marginTop: Spacing.four,
    width: '100%',
    maxWidth: 320,
  },
  codeCard: {
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.four,
    gap: 6,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  code: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.five,
    paddingVertical: 14,
    marginTop: Spacing.four,
    minHeight: 48,
  },
  shareButtonPressed: {
    opacity: 0.85,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
