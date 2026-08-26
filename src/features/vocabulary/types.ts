// Generic vocabulary/new-word data shape — deliberately not tied to any
// one language or subject, so the same VocabularyWordCard can show a
// Bulgarian verb, a French noun, or (later) a medical term someone
// encountered in running text. Distinct from features/terminology's
// TermEntry on purpose: that type models a definition in the student's
// own study language (English medical prose); this one models a foreign
// word being translated INTO a language the student already knows, which
// needs fields (pronunciation, transliteration, grammar/conjugation,
// translated examples) TermEntry has no reason to carry.

export type VocabularyDefinition = {
  meaning: string;
  partOfSpeech?: string;
};

export type VocabularyExample = {
  sentence: string;
  translation: string;
};

// A single labeled grammar fact — flexible on purpose (gender/case for a
// noun, aspect/conjugation for a verb, comparison forms for an adjective)
// rather than a rigid per-part-of-speech shape.
export type VocabularyGrammarFact = {
  label: string;
  value: string;
};

export type VocabularyWord = {
  id: string;
  word: string;
  language: string;
  // BCP-47 tag for real on-device text-to-speech (expo-speech), e.g.
  // "bg-BG" — separate from `language` (a human-readable label) since a
  // TTS engine needs the exact tag, not a display name.
  speechLocale?: string;
  // Romanized/phonetic reading, shown under the word — not every language
  // needs one (skip for French, show for Bulgarian/Japanese/Arabic).
  pronunciation?: string;
  partOfSpeech: string;
  primaryTranslation: string;
  definitions: VocabularyDefinition[];
  examples: VocabularyExample[];
  grammar: VocabularyGrammarFact[];
  synonyms: string[];
  relatedWords: string[];
  // The sentence the student actually encountered this word in, if any —
  // omitted (both fields) for a word looked up cold, e.g. from a search.
  contextSentence?: string;
  contextTranslation?: string;
};
