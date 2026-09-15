import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { GlossaryTerm, searchGlossaryTerms } from '@/lib/glossary';

import { addMyWord, MyWord, removeMyWord, useMyWords } from './myWordsStore';

type Mode = 'lookup' | 'manual';

const SOURCE_LABEL: Record<MyWord['source'], string> = { manual: 'Your own', nursing: 'Nursing', ucat: 'UCAT' };

// Create > New Word. Two real ways to add a word — search Studium's own
// terminology database (lib/glossary.ts: nursing_lesson_terms +
// ucat_lesson_terms, 819 real term/definition pairs) or type your own
// word and definition by hand — both saving into one persisted "My
// Words" list (myWordsStore.ts) shown below. Replaces the old demo
// screen that only ever showed one hardcoded Bulgarian word with no real
// lookup or save behind it.
export function NewWordScreen() {
  const theme = useTheme();
  const myWords = useMyWords();

  const [mode, setMode] = useState<Mode>('lookup');

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlossaryTerm[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(null);
      setSearching(false);
      setSearchError(false);
      return;
    }
    setSearching(true);
    setSearchError(false);
    let cancelled = false;
    const timer = setTimeout(() => {
      searchGlossaryTerms(trimmed)
        .then((terms) => {
          if (!cancelled) setResults(terms);
        })
        .catch(() => {
          if (!cancelled) setSearchError(true);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const [manualTerm, setManualTerm] = useState('');
  const [manualDefinition, setManualDefinition] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  function saveManualWord() {
    const term = manualTerm.trim();
    const definition = manualDefinition.trim();
    if (!term || !definition) return;
    addMyWord(term, definition, 'manual');
    setManualTerm('');
    setManualDefinition('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  }

  function saveGlossaryTerm(t: GlossaryTerm) {
    addMyWord(t.term, t.definition, t.source, `${t.source}-${t.id}`);
  }

  const savedIds = new Set(myWords.map((w) => w.id));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <ScreenHeader title="New Word" />
        </View>

        <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.modeRow, { backgroundColor: theme.backgroundSelected }]}>
            <Pressable
              onPress={() => setMode('lookup')}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === 'lookup' }}
              style={[styles.modeButton, mode === 'lookup' && { backgroundColor: theme.backgroundElement }, Shadow.card]}>
              <Ionicons name="search" size={14} color={mode === 'lookup' ? theme.primary : theme.textSecondary} />
              <ThemedText style={[styles.modeText, { color: mode === 'lookup' ? theme.primary : theme.textSecondary }]}>
                Look Up
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => setMode('manual')}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === 'manual' }}
              style={[styles.modeButton, mode === 'manual' && { backgroundColor: theme.backgroundElement }, Shadow.card]}>
              <Ionicons name="create-outline" size={14} color={mode === 'manual' ? theme.primary : theme.textSecondary} />
              <ThemedText style={[styles.modeText, { color: mode === 'manual' ? theme.primary : theme.textSecondary }]}>
                Add Your Own
              </ThemedText>
            </Pressable>
          </View>

          {mode === 'lookup' ? (
            <View style={styles.section}>
              <View style={[styles.searchBar, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
                <Ionicons name="search" size={16} color={theme.textSecondary} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search Studium's terminology database"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.searchInput, { color: theme.text }]}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {query.length > 0 && (
                  <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Clear search">
                    <Ionicons name="close-circle" size={16} color={theme.textSecondary} />
                  </Pressable>
                )}
              </View>

              {searching && (
                <View style={styles.centerRow}>
                  <ActivityIndicator color={theme.primary} />
                </View>
              )}

              {searchError && (
                <ThemedText themeColor="rose" style={styles.helperText}>
                  Couldn't search right now. Check your connection and try again.
                </ThemedText>
              )}

              {!searching && !searchError && results && results.length === 0 && (
                <ThemedText themeColor="textSecondary" style={styles.helperText}>
                  No terms found for "{query.trim()}".
                </ThemedText>
              )}

              {!searching && results && results.length > 0 && (
                <View style={styles.resultsList}>
                  {results.map((t) => {
                    const id = `${t.source}-${t.id}`;
                    const saved = savedIds.has(id);
                    return (
                      <View key={id} style={[styles.resultCard, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
                        <View style={styles.resultTextCol}>
                          <View style={styles.resultTitleRow}>
                            <ThemedText style={styles.resultTerm}>{t.term}</ThemedText>
                            <View style={[styles.sourcePill, { backgroundColor: theme.primaryMuted }]}>
                              <ThemedText themeColor="primary" style={styles.sourcePillText}>
                                {SOURCE_LABEL[t.source]}
                              </ThemedText>
                            </View>
                          </View>
                          <ThemedText themeColor="textSecondary" style={styles.resultDefinition}>
                            {t.definition}
                          </ThemedText>
                        </View>
                        <Pressable
                          onPress={() => saveGlossaryTerm(t)}
                          disabled={saved}
                          accessibilityRole="button"
                          accessibilityLabel={saved ? `${t.term} already saved` : `Save ${t.term}`}
                          hitSlop={8}
                          style={styles.saveIconButton}>
                          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={saved ? theme.primary : theme.textSecondary} />
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              )}

              {!query && (
                <ThemedText themeColor="textSecondary" style={styles.helperText}>
                  Real terminology from Studium's Nursing and UCAT lessons — start typing to search.
                </ThemedText>
              )}
            </View>
          ) : (
            <View style={styles.section}>
              <ThemedText themeColor="textSecondary" style={styles.fieldLabel}>
                WORD
              </ThemedText>
              <TextInput
                value={manualTerm}
                onChangeText={setManualTerm}
                placeholder="e.g. Orthopnea"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              />
              <ThemedText themeColor="textSecondary" style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
                DEFINITION
              </ThemedText>
              <TextInput
                value={manualDefinition}
                onChangeText={setManualDefinition}
                placeholder="What does it mean?"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, styles.definitionInput, { color: theme.text, borderColor: theme.border }]}
                multiline
                textAlignVertical="top"
              />
              <Pressable
                onPress={saveManualWord}
                disabled={!manualTerm.trim() || !manualDefinition.trim()}
                accessibilityRole="button"
                accessibilityLabel="Save word"
                style={({ pressed }) => [
                  styles.saveButton,
                  { backgroundColor: manualTerm.trim() && manualDefinition.trim() ? theme.primary : theme.border },
                  pressed && styles.saveButtonPressed,
                ]}>
                <ThemedText style={styles.saveButtonText}>{justSaved ? 'Saved ✓' : 'Save Word'}</ThemedText>
              </Pressable>
            </View>
          )}

          {myWords.length > 0 && (
            <View style={styles.section}>
              <ThemedText themeColor="textSecondary" style={styles.sectionLabel}>
                MY WORDS · {myWords.length}
              </ThemedText>
              <View style={styles.resultsList}>
                {myWords.map((w) => (
                  <View key={w.id} style={[styles.resultCard, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
                    <View style={styles.resultTextCol}>
                      <View style={styles.resultTitleRow}>
                        <ThemedText style={styles.resultTerm}>{w.term}</ThemedText>
                        <View style={[styles.sourcePill, { backgroundColor: theme.backgroundSelected }]}>
                          <ThemedText themeColor="textSecondary" style={styles.sourcePillText}>
                            {SOURCE_LABEL[w.source]}
                          </ThemedText>
                        </View>
                      </View>
                      <ThemedText themeColor="textSecondary" style={styles.resultDefinition}>
                        {w.definition}
                      </ThemedText>
                    </View>
                    <Pressable
                      onPress={() => removeMyWord(w.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${w.term}`}
                      hitSlop={8}
                      style={styles.saveIconButton}>
                      <Ionicons name="trash-outline" size={16} color={theme.rose} />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: { width: '100%', maxWidth: 800, alignSelf: 'center', paddingHorizontal: Spacing.four, paddingTop: Spacing.three },
  scrollContent: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.six,
    gap: 20,
  },
  modeRow: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    padding: 4,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.sm,
    paddingVertical: 10,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  centerRow: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  helperText: {
    fontSize: 12,
    lineHeight: 17,
    paddingVertical: 4,
  },
  resultsList: {
    gap: 8,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  resultTextCol: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultTerm: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  sourcePill: {
    borderRadius: Radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  sourcePillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  resultDefinition: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  saveIconButton: {
    padding: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  fieldLabelSpaced: {
    marginTop: 6,
  },
  input: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  definitionInput: {
    minHeight: 90,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    paddingVertical: 14,
    minHeight: 48,
    marginTop: 4,
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
