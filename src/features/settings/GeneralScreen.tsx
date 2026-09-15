import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ListRow } from '@/components/list-row';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { PathId, pathOptions } from '@/constants/paths';
import { Spacing } from '@/constants/theme';
import { AppearanceMode, setAppearanceMode, useAppearanceMode } from '@/features/settings/appearanceStore';
import { ExpandableField } from '@/features/settings/components/ExpandableField';
import { PillGroup } from '@/features/settings/components/PillGroup';
import { SavedIndicator, useSavedFeedback } from '@/features/settings/components/SavedIndicator';
import { languageOptions, setLanguage, useLanguage } from '@/features/settings/generalStore';
import { setCurrentPathId, useCurrentPathId } from '@/features/study/currentPathStore';
import { useTheme } from '@/hooks/use-theme';

const appearanceOptions: AppearanceMode[] = ['system', 'light', 'dark'];
const appearanceLabels: Record<AppearanceMode, string> = { system: 'System', light: 'Light', dark: 'Dark' };

// Settings > Preferences > General. Appearance is the one real, working
// control here — see features/settings/appearanceStore.ts — everything
// else on this screen is honest local state. Notifications links to the
// existing full Notifications screen rather than a second copy of the
// same toggles living in two places at once.
export function GeneralScreen() {
  const theme = useTheme();
  const router = useRouter();
  const appearance = useAppearanceMode();
  const language = useLanguage();
  const currentPathId = useCurrentPathId();
  const { visible, trigger } = useSavedFeedback();
  const currentPathOption = pathOptions.find((p) => p.id === currentPathId) ?? pathOptions[0];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="General" />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
                LANGUAGE
              </ThemedText>
              <SavedIndicator visible={visible} />
            </View>
            <ExpandableField title="Language" summary={language}>
              <PillGroup
                options={languageOptions}
                selected={language}
                onSelect={(value) => {
                  setLanguage(value);
                  trigger();
                }}
              />
            </ExpandableField>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
                APPEARANCE
              </ThemedText>
            </View>
            <ExpandableField title="Appearance" summary={appearanceLabels[appearance]}>
              <PillGroup
                options={appearanceOptions}
                selected={appearance}
                getLabel={(v) => appearanceLabels[v as AppearanceMode]}
                onSelect={(value) => {
                  setAppearanceMode(value as AppearanceMode);
                  trigger();
                }}
              />
            </ExpandableField>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
                STUDY PATH
              </ThemedText>
            </View>
            {/* Deliberately collapsed by default and buried here rather than
                a one-tap badge on Home/Learn (see components/current-path-
                badge.tsx) — switching what you're studying for (MCAT vs
                Nursing vs ...) changes what shows up across Courses/Learn,
                so it shouldn't be something you bump into by accident. */}
            <ExpandableField title="Study Path" summary={currentPathOption.label} summaryColor={currentPathOption.color}>
              <PillGroup
                options={pathOptions.map((p) => p.id)}
                selected={currentPathId}
                getLabel={(id) => {
                  const option = pathOptions.find((p) => p.id === id);
                  return option ? option.label : String(id);
                }}
                getColor={(id) => {
                  const option = pathOptions.find((p) => p.id === id);
                  return { color: option?.color ?? theme.primary, colorMuted: option?.colorMuted ?? theme.primaryMuted };
                }}
                onSelect={(id) => {
                  setCurrentPathId(id as PathId);
                  trigger();
                }}
              />
            </ExpandableField>
          </View>

          <View style={styles.section}>
            <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
              NOTIFICATIONS
            </ThemedText>
            <GroupedList>
              <ListRow
                icon="notifications-outline"
                iconColor={theme.primary}
                iconBackground={theme.primaryMuted}
                title="Notifications"
                subtitle="Study reminders, streaks, community, and more"
                onPress={() => router.push('/notifications')}
              />
            </GroupedList>
          </View>
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
  section: { gap: Spacing.two },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: { fontSize: 11, fontWeight: '500', letterSpacing: 0.4 },
});
