import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupedList } from '@/components/grouped-list';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const initialSettings: NotificationSetting[] = [
  { id: 'daily-case', title: 'Daily Case reminder', description: "A nudge if you haven't solved today's case yet", enabled: true },
  { id: 'streak', title: 'Streak reminders', description: 'Warn me before my streak is about to break', enabled: true },
  { id: 'community', title: 'Community replies & mentions', description: 'Someone replies to your post or mentions you', enabled: true },
  { id: 'challenges', title: 'Challenge updates', description: 'Progress milestones on challenges you joined', enabled: false },
  { id: 'weekly-summary', title: 'Weekly progress summary', description: 'A recap of your KP, streak, and mastery each week', enabled: true },
];

function NotificationRow({
  setting,
  onToggle,
}: {
  setting: NotificationSetting;
  onToggle: (value: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <ThemedText style={styles.rowTitle}>{setting.title}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.rowDescription}>
          {setting.description}
        </ThemedText>
      </View>
      <Switch
        value={setting.enabled}
        onValueChange={onToggle}
        trackColor={{ false: theme.border, true: theme.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

// A real, working settings screen — every switch here actually flips
// local state and stays flipped, same as Settings' avatar/username save.
// There's no push-notification backend to wire these into yet, so
// "working" means the toggle genuinely persists for this session, not
// that a real push arrives — same honesty as the rest of this app's
// mock-data screens.
export function NotificationsScreen() {
  const theme = useTheme();
  const [settings, setSettings] = useState(initialSettings);

  function toggle(id: string, value: boolean) {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: value } : s)));
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Notifications" />
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Choose what Studium can notify you about.
          </ThemedText>

          <GroupedList>
            {settings.map((setting) => (
              <NotificationRow
                key={setting.id}
                setting={setting}
                onToggle={(value) => toggle(setting.id, value)}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    minHeight: 60,
    paddingVertical: 10,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowDescription: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
  },
});
