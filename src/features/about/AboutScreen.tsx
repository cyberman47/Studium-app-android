import { Image } from 'expo-image';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Reached from More > About Studium and Settings > App > About Studium —
// one real screen, two entry points. Terms/Privacy/Licenses link out to
// studium-website's own real pages (app/terms, app/privacy, app/licenses
// there) rather than duplicating that content natively.
const websiteUrl = 'https://studium-website-three.vercel.app';
const termsUrl = `${websiteUrl}/terms`;
const privacyUrl = `${websiteUrl}/privacy`;
const licensesUrl = `${websiteUrl}/licenses`;

export function AboutScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="About Studium" />

          <View style={styles.header}>
            <Image
              source={require('@/assets/images/studium-logo-full.png')}
              style={styles.logo}
              contentFit="contain"
              accessible
              accessibilityLabel="Studium"
            />
            <ThemedText themeColor="textSecondary" style={styles.tagline}>
              Medical learning, accessible to everyone.
            </ThemedText>
          </View>

          <GroupedList>
            <ListRow
              icon="information-circle-outline"
              iconColor={theme.primary}
              iconBackground={theme.primaryMuted}
              title="Version"
              subtitle="1.0.0"
            />
            <ListRow
              icon="document-text-outline"
              iconColor={theme.primary}
              iconBackground={theme.primaryMuted}
              title="Terms of Service"
              subtitle="The rules for using Studium"
              onPress={() => Linking.openURL(termsUrl)}
            />
            <ListRow
              icon="shield-checkmark-outline"
              iconColor={theme.primary}
              iconBackground={theme.primaryMuted}
              title="Privacy Policy"
              subtitle="How your data is handled"
              onPress={() => Linking.openURL(privacyUrl)}
            />
            <ListRow
              icon="code-slash-outline"
              iconColor={theme.primary}
              iconBackground={theme.primaryMuted}
              title="Licenses"
              subtitle="Open source software used in Studium"
              onPress={() => Linking.openURL(licensesUrl)}
            />
            <ListRow
              icon="mail-outline"
              iconColor={theme.primary}
              iconBackground={theme.primaryMuted}
              title="Contact & Support"
              subtitle="support@studium.app"
              onPress={() => Linking.openURL('mailto:support@studium.app')}
            />
            <ListRow
              icon="globe-outline"
              iconColor={theme.primary}
              iconBackground={theme.primaryMuted}
              title="Studium Website"
              subtitle="studium-website-three.vercel.app"
              onPress={() => Linking.openURL(websiteUrl)}
            />
          </GroupedList>

          <ThemedText themeColor="textSecondary" style={styles.footer}>
            By using Studium, you agree to our{' '}
            <ThemedText themeColor="primary" style={styles.footerLink} onPress={() => Linking.openURL(termsUrl)}>
              Terms of Service
            </ThemedText>{' '}
            and{' '}
            <ThemedText themeColor="primary" style={styles.footerLink} onPress={() => Linking.openURL(privacyUrl)}>
              Privacy Policy
            </ThemedText>
            .
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: 800, paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: 20 },
  header: { alignItems: 'center', gap: 6, paddingVertical: Spacing.two },
  logo: { height: 30, aspectRatio: 779 / 303 },
  tagline: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  footer: { fontSize: 11, lineHeight: 17, textAlign: 'center', paddingHorizontal: Spacing.two },
  footerLink: { fontSize: 11, fontWeight: '700' },
});
