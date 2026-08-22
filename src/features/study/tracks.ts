import { Ionicons } from '@expo/vector-icons';

// The seven Studying Paths tracks, mirroring the web app's Learning Paths
// "Browse Paths" grid exactly (app/dashboard/(main)/learning-paths/
// page.tsx) — same tracks, same order, same per-track color. Shared
// between the grid (StudyingPathsSection) and each track's detail screen
// (app/track/[id].tsx) so the two can never drift out of sync on
// id/icon/color.
export type TrackId = 'mcat' | 'medical-school' | 'nursing' | 'anatomy' | 'pharmacology' | 'medical-cases' | 'usmle';

export type Track = {
  id: TrackId;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  meta: string;
  bg: string;
  fg: string;
  current?: boolean;
};

export const tracks: Track[] = [
  { id: 'mcat', name: 'MCAT', icon: 'clipboard-outline', meta: '4 Sections · 190 Lessons', bg: 'rgba(124, 58, 237, 0.12)', fg: '#7C3AED', current: true },
  { id: 'medical-school', name: 'Medical School', icon: 'school-outline', meta: '9 Topics', bg: 'rgba(15, 139, 141, 0.12)', fg: '#0F8B8D' },
  { id: 'nursing', name: 'Nursing', icon: 'heart-outline', meta: '11 Topics', bg: 'rgba(219, 39, 119, 0.12)', fg: '#DB2777' },
  { id: 'anatomy', name: 'Anatomy', icon: 'body-outline', meta: '9 Regions', bg: 'rgba(225, 29, 72, 0.12)', fg: '#E11D48' },
  { id: 'pharmacology', name: 'Pharmacology', icon: 'medkit-outline', meta: '8 Topics', bg: 'rgba(79, 70, 229, 0.12)', fg: '#4F46E5' },
  { id: 'medical-cases', name: 'Medical Cases', icon: 'pulse-outline', meta: '11 Cases', bg: 'rgba(244, 63, 94, 0.12)', fg: '#F43F5E' },
  { id: 'usmle', name: 'USMLE', icon: 'medal-outline', meta: '12 Topics', bg: 'rgba(217, 119, 6, 0.12)', fg: '#D97706' },
];

export function findTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}
