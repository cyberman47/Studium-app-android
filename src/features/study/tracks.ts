import { Ionicons } from '@expo/vector-icons';

import type { PathId } from '@/constants/paths';

// The seven Courses tracks, mirroring the web app's Courses "Browse
// Courses" grid exactly (app/dashboard/(main)/courses/page.tsx) — same
// tracks, same order, same per-track color. Shared between the grid
// (StudyingPathsSection) and each track's detail screen (app/track/[id].tsx)
// so the two can never drift out of sync on id/icon/color.
export type TrackId = 'mcat' | 'medical-school' | 'nursing' | 'anatomy' | 'pharmacology' | 'medical-cases' | 'usmle';

export type Track = {
  id: TrackId;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  meta: string;
  bg: string;
  fg: string;
};

export const tracks: Track[] = [
  { id: 'mcat', name: 'MCAT', icon: 'clipboard-outline', meta: '4 Sections · 90 Lessons', bg: 'rgba(124, 58, 237, 0.12)', fg: '#7C3AED' },
  { id: 'medical-school', name: 'Medical School', icon: 'school-outline', meta: 'Coming soon', bg: 'rgba(15, 139, 141, 0.12)', fg: '#0F8B8D' },
  { id: 'nursing', name: 'Nursing', icon: 'heart-outline', meta: '11 Topics', bg: 'rgba(219, 39, 119, 0.12)', fg: '#DB2777' },
  { id: 'anatomy', name: 'Anatomy', icon: 'body-outline', meta: '7 Sections · 111 Cards', bg: 'rgba(225, 29, 72, 0.12)', fg: '#E11D48' },
  { id: 'pharmacology', name: 'Pharmacology', icon: 'medkit-outline', meta: 'Coming soon', bg: 'rgba(79, 70, 229, 0.12)', fg: '#4F46E5' },
  { id: 'medical-cases', name: 'Medical Cases', icon: 'pulse-outline', meta: 'Coming soon', bg: 'rgba(244, 63, 94, 0.12)', fg: '#F43F5E' },
  { id: 'usmle', name: 'USMLE', icon: 'medal-outline', meta: 'Coming soon', bg: 'rgba(217, 119, 6, 0.12)', fg: '#D97706' },
];

export function findTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

// Which Courses tiles are actually relevant to each "currently studying"
// path — mirrors the web's lib/currentPath.ts relevantCourseTiles exactly
// for the three paths that have a real, direct equivalent here (mcat,
// medical-school, nursing), and extends the same idea to Pharmacy, the
// one remaining path with an obvious real track of its own
// (Pharmacology). Every clinically-oriented path pulls in Anatomy and
// Medical Cases as real, relevant supporting content, same reasoning as
// the web. The track matching the path itself is listed first, so it
// sorts to the front of the grid.
//
// Dentistry, Biomedical Sciences, and Other have no equivalent on the
// web and no obviously "right" curated subset here — rather than invent
// one, a path with no entry below shows every track unfiltered (see
// relevantTracksForPath's use in StudyingPathsSection).
export const relevantTracksForPath: Partial<Record<PathId, TrackId[]>> = {
  mcat: ['mcat', 'anatomy', 'medical-cases'],
  'medical-school': ['medical-school', 'anatomy', 'medical-cases', 'usmle'],
  nursing: ['nursing', 'anatomy', 'medical-cases'],
  pharmacy: ['pharmacology', 'anatomy', 'medical-cases'],
};

// The one Courses tile that structurally IS the selected path — drives
// the "Current" badge in the grid, same as the web's `matches === pathId`
// check (lib/currentPath.ts / app/dashboard/(main)/courses/page.tsx).
export const trackIdForPath: Partial<Record<PathId, TrackId>> = {
  mcat: 'mcat',
  'medical-school': 'medical-school',
  nursing: 'nursing',
  pharmacy: 'pharmacology',
};

// Narrows the full track list down to what's relevant to the given path,
// own track first — falls back to every track when the path has no
// curated mapping above.
export function relevantTracks(pathId: PathId): Track[] {
  const ids = relevantTracksForPath[pathId];
  if (!ids) return tracks;
  return ids.map((id) => findTrack(id)).filter((t): t is Track => t !== undefined);
}
