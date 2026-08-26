import { clinicalCases } from '@/features/dailycase/data';

import { type TermEntry } from './data';

export type RelatedCondition = { id: string; title: string; category: string };

// A real cross-reference, not a fabricated conditions database: a case
// "features" a term when the term's exact name genuinely appears
// somewhere in its real ported text (stem, patient intro, narrative
// beats, explanation, key clues, option rationales) — searched against
// the same 11 real cases features/dailycase/data.ts already ships, the
// mobile equivalent of the web app's lib/termConditions.ts without
// inventing a second, separate content set.
export function getConditionsForTerm(term: TermEntry): RelatedCondition[] {
  const needle = new RegExp(`\\b${term.term}\\b`, 'i');
  return clinicalCases
    .filter((c) => {
      const haystack = [c.stem, c.patientIntro, c.explanation, ...c.narrative, ...c.keyClues, ...c.optionRationales].join(' ');
      return needle.test(haystack);
    })
    .map((c) => ({ id: c.id, title: c.title, category: c.category }));
}
