import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { biologyCurriculum } from './curriculum';
import { UnitSection } from './components/UnitSection';

// The redesigned "All Lessons" — a curriculum timeline instead of a flat
// list of rows. Weight scales with what each lesson actually is: the
// current lesson gets a real card, done lessons are lightweight rows with
// a mastery bar, locked lessons are dim and connected into the rail so
// "what's next" reads as a path rather than a wall of "Locked" labels.
export function AllLessonsScreen() {
  const theme = useTheme();
  const totalLessons = biologyCurriculum.reduce((sum, u) => sum + u.lessons.length, 0);
  const doneLessons = biologyCurriculum.reduce(
    (sum, u) => sum + u.lessons.filter((l) => l.status === 'mastered' || l.status === 'completed').length,
    0,
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="All Lessons" />

          <View style={styles.subjectStrip}>
            <ThemedText themeColor="primary" style={styles.subjectLabel}>
              BIOLOGY
            </ThemedText>
            <ThemedText style={styles.subjectStat}>
              {doneLessons} of {totalLessons} lessons complete
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subjectCaption}>
              Only Biology has real, completable lessons today — the rest of Studium's curriculum is a
              browsable structure.
            </ThemedText>
          </View>

          <View style={styles.units}>
            {biologyCurriculum.map((unit) => (
              <UnitSection key={unit.id} unit={unit} />
            ))}
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
    maxWidth: 800,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.four,
  },
  subjectStrip: {
    gap: 4,
  },
  subjectLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subjectStat: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  subjectCaption: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  units: {
    gap: Spacing.five,
  },
});
