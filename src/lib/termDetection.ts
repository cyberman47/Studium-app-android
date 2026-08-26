// Scans a block of plain text and finds real Terminology entries inside
// it, so any text in the app (clinical case narratives, question text,
// rationales) can become interactive without special-casing content —
// port of the web app's lib/termDetection.ts, operating on this app's
// own (smaller, mobile-scoped) glossary instead of the web's full term
// database. Only the first occurrence of each term per block is tagged,
// so repeated mentions don't turn into a wall of highlights.

import { termGlossary, type TermEntry } from '@/features/terminology/data';

export type TextSegment = { type: 'text'; value: string } | { type: 'term'; value: string; term: TermEntry };

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Longest names first so a multi-word term would match as a whole phrase
// before any shorter term could grab part of it (no multi-word terms in
// this app's starter glossary yet, but keeps this correct once there are).
const sortedByLength = [...termGlossary].sort((a, b) => b.term.length - a.term.length);
const pattern = new RegExp(`\\b(${sortedByLength.map((t) => escapeRegExp(t.term)).join('|')})\\b`, 'gi');
const byLowerName = new Map(termGlossary.map((t) => [t.term.toLowerCase(), t]));

export function detectTerms(text: string): TextSegment[] {
  if (!text || termGlossary.length === 0) return [{ type: 'text', value: text }];

  const segments: TextSegment[] = [];
  const seen = new Set<string>();
  let lastIndex = 0;

  pattern.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const matchedText = match[0];
    const term = byLowerName.get(matchedText.toLowerCase());
    if (!term || seen.has(term.id)) continue;
    if (match.index > lastIndex) segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    segments.push({ type: 'term', value: matchedText, term });
    seen.add(term.id);
    lastIndex = match.index + matchedText.length;
  }
  if (lastIndex < text.length) segments.push({ type: 'text', value: text.slice(lastIndex) });
  return segments;
}
