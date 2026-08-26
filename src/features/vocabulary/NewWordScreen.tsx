import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { VocabularyWordCard } from './components/VocabularyWordCard';
import { sampleVocabularyWord } from './data';

// Demo home for the reusable VocabularyWordCard (component + real,
// persisted store live in this same feature folder) — reached from
// Create > New Word. Real backend vocabulary content doesn't exist in
// this app yet (Studium's real subject matter is medical terminology),
// so this shows the card with one realistic, hand-authored word
// (features/vocabulary/data.ts) exactly as the card would render for
// any real word once that content exists.
//
// No header row above the card on purpose — the card's own default
// height math (window height minus safe-area insets) assumes nothing
// else in this screen competes for vertical space, so the only chrome
// here is a small floating back button that doesn't participate in
// layout flow.
export function NewWordScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={10}
        style={({ pressed }) => [styles.backButton, Shadow.card, { backgroundColor: theme.backgroundElement }, pressed && styles.pressed]}>
        <Ionicons name="chevron-back" size={20} color={theme.text} />
      </Pressable>

      <View style={styles.cardWrap}>
        <VocabularyWordCard word={sampleVocabularyWord} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Spacing.three,
    left: Spacing.four,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  cardWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
});
