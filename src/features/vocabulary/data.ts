import { type VocabularyWord } from './types';

// Realistic placeholder data — there's no real language-learning backend
// wired into Studium yet (its real content is medical terminology and
// clinical cases), so this stands in for it the same honest way every
// other "no backend yet" feature in this app does: real, accurate content
// authored by hand, not lorem ipsum. покаже is a genuine Bulgarian verb
// form (3rd person singular, present/subjunctive of the perfective
// покажа — "to show"), and the grammar note about Bulgarian having no
// infinitive is a real fact about the language, not invented.
export const sampleVocabularyWord: VocabularyWord = {
  id: 'bg-pokazhe',
  word: 'покаже',
  language: 'Bulgarian',
  speechLocale: 'bg-BG',
  pronunciation: 'po-KA-zhe',
  partOfSpeech: 'verb · perfective, 3rd person singular',
  primaryTranslation: '(that) he/she/it shows',
  definitions: [
    { meaning: 'To show or display something to someone.', partOfSpeech: 'verb' },
    { meaning: 'To demonstrate or prove something through action.', partOfSpeech: 'verb' },
    { meaning: 'Покаже се — to show oneself; to appear or come into view.', partOfSpeech: 'verb, reflexive' },
  ],
  examples: [
    { sentence: 'Тя иска да му покаже новата снимка.', translation: 'She wants to show him the new photo.' },
    { sentence: 'Ако покаже документа си, ще влезе без проблем.', translation: 'If he shows his ID, he will get in without a problem.' },
  ],
  grammar: [
    { label: 'Aspect', value: 'Perfective — paired with the imperfective показва ("shows, is showing")' },
    { label: 'No infinitive', value: 'Bulgarian has no infinitive form; да покаже ("to show") fills that role instead' },
    { label: 'Present tense', value: 'аз покажа · ти покажеш · той/тя/то покаже · ние покажем · вие покажете · те покажат' },
  ],
  synonyms: ['демонстрира', 'разкрие'],
  relatedWords: ['показвам (imperfective)', 'показ (noun — a display, a show)', 'показалец (noun — index finger)'],
  contextSentence: 'Учителят помоли ученика да покаже домашното си на дъската.',
  contextTranslation: 'The teacher asked the student to show his homework on the board.',
};
