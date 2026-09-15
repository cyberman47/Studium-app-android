import type { TrackId } from './tracks';

export type TrackDetail = {
  description: string;
};

/**
 * Just the per-track description shown under TrackDetailScreen's header.
 * The actual subject/topic/lesson content below it is real, fetched live
 * from Supabase (see lib/contentBank.ts) for the two tracks that have it
 * (MCAT via MCATSectionList, Nursing via TrackDetailScreen's own
 * useNursingTopics) — this file used to also hold a fabricated `rows`
 * list of subject/topic counts for every track, which is gone now that
 * real data (or an honest empty state, for the tracks below with no real
 * backend content) has replaced it everywhere.
 */
export const trackDetails: Record<TrackId, TrackDetail> = {
  mcat: {
    description: 'The four real MCAT sections, with real subjects, lessons, and practice questions.',
  },
  'medical-school': {
    description: 'Core pre-clinical and clinical topics. Nothing here yet — real content is coming.',
  },
  nursing: {
    description: 'Foundations through NCLEX preparation, with real topics, subjects, and practice questions.',
  },
  anatomy: {
    description: 'Region-by-region anatomy, from terminology to neuroanatomy.',
  },
  pharmacology: {
    description: 'Drug classes, mechanisms, and interactions by system. Nothing here yet — real content is coming.',
  },
  'medical-cases': {
    description: 'Real clinical case challenges. Nothing here yet — new cases are coming.',
  },
  usmle: {
    description: 'Systems-based review, matching the real USMLE Step blueprint. Nothing here yet — real content is coming.',
  },
};
