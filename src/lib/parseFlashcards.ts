/**
 * Turns an AI tutor reply into real flashcards, when it looks like one was
 * asked for — this is what actually closes the loop on "build me
 * flashcards from this": before this, Studium AI's replies were always
 * just chat text, with no way to turn a reply into a real saved deck (see
 * features/mycontent/store.ts's addFlashcardSet, the one real place
 * flashcards live in this app).
 *
 * Deliberately tolerant of formatting drift rather than requiring one
 * exact template: the model isn't always perfectly consistent, so this
 * accepts "Front:"/"Back:" or "Q:"/"A:" (either label, case-insensitive,
 * optionally wrapped in markdown bold/italics or a leading "- "/number),
 * on the same line or split across two — real flashcard content commonly
 * comes out in one of these shapes without needing a rigid contract.
 */

export type ParsedFlashcard = { front: string; back: string };

const LABEL = '(?:\\*{0,2}_{0,2}\\s*(?:front|question|q)\\s*\\*{0,2}_{0,2}\\s*:)';
const ANSWER_LABEL = '(?:\\*{0,2}_{0,2}\\s*(?:back|answer|a)\\s*\\*{0,2}_{0,2}\\s*:)';

// Matches one FRONT...BACK pair, with BACK's content running until the
// next FRONT-style label, a blank line (a paragraph break — e.g. trailing
// "Hope that helps!" prose after the last card), or the end of the text —
// this is what lets "Front: x\nBack: y" and "Front: x Back: y" both work
// with the same pattern.
const PAIR_RE = new RegExp(
  `(?:^|\\n)\\s*(?:[-*\\d.)]+\\s*)?${LABEL}\\s*([\\s\\S]*?)\\s*${ANSWER_LABEL}\\s*([\\s\\S]*?)(?=(?:\\n\\s*(?:[-*\\d.)]+\\s*)?${LABEL})|(?:\\n\\s*\\n)|\\s*$)`,
  'gi',
);

// Strips a leading/trailing run of markdown emphasis markers (`**`, `__`,
// mixed) that the label regex doesn't consume itself — e.g. "**Front:**
// text**" leaves a stray "**" at each end of the captured text.
function stripEmphasis(value: string): string {
  return value.trim().replace(/^[*_]+/, '').replace(/[*_]+$/, '').trim();
}

export function parseFlashcardsFromText(text: string): ParsedFlashcard[] {
  const cards: ParsedFlashcard[] = [];
  for (const match of text.matchAll(PAIR_RE)) {
    const front = stripEmphasis(match[1] ?? '');
    const back = stripEmphasis(match[2] ?? '');
    if (front && back) cards.push({ front, back });
  }
  return cards;
}
