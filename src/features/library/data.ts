/**
 * Mock data for the Library tab — mirrors the shape the web app's Library
 * page (app/dashboard/(main)/library/page.tsx) reads live from
 * lib/mcatPath.ts, lib/myLibrary.ts, lib/communityLessons.ts,
 * lib/articles.ts, lib/resources.ts, lib/flashcardDecks.ts, and
 * lib/practiceHistory.ts. Nothing here talks to real content yet;
 * swapping this module for real fetching later shouldn't require
 * touching any component below, since every component takes this same
 * shape as props — same pattern as features/dashboard/data.ts.
 */

export type LibraryData = {
  lessons: number;
  saved: number;
  community: number;
  articles: number;
  resources: number;
  decks: number;
  flagged: number;
  missed: number;
};

export const mockLibrary: LibraryData = {
  lessons: 42,
  saved: 7,
  community: 18,
  articles: 24,
  resources: 15,
  decks: 5,
  flagged: 9,
  missed: 14,
};
