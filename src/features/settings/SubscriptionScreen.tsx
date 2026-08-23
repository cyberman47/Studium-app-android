import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Settings > App > Subscription. No billing system is connected yet
// (matches the web app — see app/dashboard/settings/account/page.tsx's
// "Subscription: Free (no billing connected)" row), so every number here
// is honest mock data and every button is a real, tappable interaction
// with a real (if currently unconnected) outcome, not a disabled-looking
// stub — exactly what the spec asks for: build the complete UI now,
// ready for a real billing provider to slot in later.
const mockPlan = {
  name: 'Studium Free',
  status: 'Active',
  renewalDate: null as string | null,
};

export function SubscriptionScreen() {
  const theme = useTheme();
  const [cancelling, setCancelling] = useState(false);
  const [notice, setNotice] = useState('');

  function showNotConnected(action: string) {
    setNotice(`${action} isn't connected to a real billing provider yet.`);
    setTimeout(() => setNotice(''), 2600);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Subscription" />

          <View style={[styles.planShadow, Shadow.raised]}>
            <View style={[styles.planCard, { backgroundColor: theme.primary }]}>
              <View style={styles.planHeaderRow}>
                <ThemedText style={styles.planName}>{mockPlan.name}</ThemedText>
                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <ThemedText style={styles.statusText}>{mockPlan.status}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.planRenewal}>
                {mockPlan.renewalDate ? `Renews ${mockPlan.renewalDate}` : 'No renewal date — free plan'}
              </ThemedText>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={() => showNotConnected('Upgrading your plan')}
              accessibilityRole="button"
              accessibilityLabel="Upgrade plan"
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.primary },
                pressed && styles.buttonPressed,
              ]}>
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              <ThemedText style={styles.primaryButtonText}>Upgrade Plan</ThemedText>
            </Pressable>

            <Pressable
              onPress={() => showNotConnected('Managing your subscription')}
              accessibilityRole="button"
              accessibilityLabel="Manage subscription"
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: theme.border },
                pressed && { backgroundColor: theme.backgroundSelected },
              ]}>
              <ThemedText style={styles.secondaryButtonText}>Manage Subscription</ThemedText>
            </Pressable>
          </View>

          <View style={styles.dangerZone}>
            <ThemedText themeColor="rose" style={styles.dangerLabel}>
              CANCEL PLAN
            </ThemedText>
            {!cancelling ? (
              <Pressable
                onPress={() => setCancelling(true)}
                accessibilityRole="button"
                accessibilityLabel="Cancel subscription"
                style={({ pressed }) => [
                  styles.cancelButton,
                  { borderColor: theme.roseMuted },
                  pressed && { backgroundColor: theme.roseMuted },
                ]}>
                <ThemedText themeColor="rose" style={styles.cancelButtonText}>
                  Cancel Subscription
                </ThemedText>
              </Pressable>
            ) : (
              <View style={[styles.cancelConfirmBox, { borderColor: theme.roseMuted }]}>
                <ThemedText style={styles.cancelMessage}>
                  You&apos;re on the free plan — there&apos;s nothing to cancel yet. Once billing is connected,
                  cancelling here will end your subscription at the end of the current period.
                </ThemedText>
                <Pressable
                  onPress={() => setCancelling(false)}
                  style={({ pressed }) => [
                    styles.cancelDismiss,
                    { borderColor: theme.border },
                    pressed && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  <ThemedText style={styles.cancelDismissText}>Got it</ThemedText>
                </Pressable>
              </View>
            )}
          </View>

          {notice.length > 0 && (
            <View style={[styles.noticeBox, { backgroundColor: theme.primaryMuted }]}>
              <Ionicons name="information-circle-outline" size={15} color={theme.primary} />
              <ThemedText themeColor="primary" style={styles.noticeText}>
                {notice}
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: 800, paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: 16 },
  planShadow: { borderRadius: Radius.xl },
  planCard: { borderRadius: Radius.xl, padding: Spacing.four, gap: 6 },
  planHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planName: { color: '#FFFFFF', fontSize: 19, fontWeight: '800' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
  statusText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  planRenewal: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '500' },
  actions: { gap: 10 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: Radius.pill, paddingVertical: 15, minHeight: 50 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 15, minHeight: 50 },
  secondaryButtonText: { fontSize: 14, fontWeight: '700' },
  buttonPressed: { opacity: 0.85 },
  dangerZone: { gap: Spacing.two, marginTop: Spacing.two },
  dangerLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  cancelButton: { alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 13 },
  cancelButtonText: { fontSize: 13, fontWeight: '700' },
  cancelConfirmBox: { borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three, gap: 12 },
  cancelMessage: { fontSize: 12, lineHeight: 18 },
  cancelDismiss: { alignSelf: 'flex-start', borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: Spacing.three, paddingVertical: 9 },
  cancelDismissText: { fontSize: 12, fontWeight: '700' },
  noticeBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: Radius.md, padding: Spacing.three },
  noticeText: { flex: 1, fontSize: 12, fontWeight: '600', lineHeight: 17 },
});
