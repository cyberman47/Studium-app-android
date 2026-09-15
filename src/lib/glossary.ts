import { supabase } from './supabase';

/**
 * Studium's real terminology database — the same term/definition pairs
 * that back the Nursing and UCAT question banks' lessons (see
 * lib/contentBank.ts), searchable here on their own rather than scoped to
 * one lesson. `nursing_lesson_terms` (718 real rows) and
 * `ucat_lesson_terms` (101 real rows) are the two term tables that exist
 * server-side today — MCAT's real content has no discrete term table of
 * its own (its glossary-equivalent content lives as prose inside
 * mcat_lesson_concepts, not a searchable {term, definition} row), so it
 * isn't part of this search. Both tables are RLS-locked to
 * `authenticated`, same as every other real content table this app reads.
 */

export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  source: 'nursing' | 'ucat';
};

const SEARCH_LIMIT = 25;

export async function searchGlossaryTerms(query: string): Promise<GlossaryTerm[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const [nursing, ucat] = await Promise.all([
    supabase.from('nursing_lesson_terms').select('id, term, definition').ilike('term', `%${trimmed}%`).limit(SEARCH_LIMIT),
    supabase.from('ucat_lesson_terms').select('id, term, definition').ilike('term', `%${trimmed}%`).limit(SEARCH_LIMIT),
  ]);
  if (nursing.error) throw nursing.error;
  if (ucat.error) throw ucat.error;

  const results: GlossaryTerm[] = [
    ...(nursing.data ?? []).map((r) => ({ id: r.id, term: r.term, definition: r.definition, source: 'nursing' as const })),
    ...(ucat.data ?? []).map((r) => ({ id: r.id, term: r.term, definition: r.definition, source: 'ucat' as const })),
  ];

  // Exact/prefix matches first, then alphabetical — a query like "hemo"
  // should surface "Hemostasis" before an unrelated term that merely
  // contains "hemo" mid-word.
  const lower = trimmed.toLowerCase();
  results.sort((a, b) => {
    const aStarts = a.term.toLowerCase().startsWith(lower) ? 0 : 1;
    const bStarts = b.term.toLowerCase().startsWith(lower) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    return a.term.localeCompare(b.term);
  });

  return results.slice(0, SEARCH_LIMIT);
}
