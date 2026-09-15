import { Ionicons } from '@expo/vector-icons';

// Mirrors the web app's lib/currentPath.ts exactly — same seven tracks,
// same ids, same labels, same emoji — so the mobile path switcher and
// the web one always agree on what a student can choose from.
export type PathId =
  | 'medical-school'
  | 'mcat'
  | 'nursing'
  | 'dentistry'
  | 'pharmacy'
  | 'biomedical-sciences'
  | 'other';

export type PathOption = {
  id: PathId;
  label: string;
  emoji: string;
  icon: keyof typeof Ionicons.glyphMap;
  // A distinct identity color per path — per feedback, each study path
  // should read as visually its own thing everywhere the current path
  // shows up (Home/Learn's badge, the Settings picker, Profile), not just
  // by its label text. `color` is the solid tone (text/icon/border);
  // `colorMuted` is its soft background tint, same bg/fg pairing
  // convention as tracks.ts's per-track colors.
  color: string;
  colorMuted: string;
};

export const pathOptions: PathOption[] = [
  { id: 'medical-school', label: 'Medical School', emoji: '🩺', icon: 'school-outline', color: '#2563EB', colorMuted: 'rgba(37, 99, 235, 0.12)' },
  { id: 'mcat', label: 'MCAT Preparation', emoji: '🧬', icon: 'clipboard-outline', color: '#DC2626', colorMuted: 'rgba(220, 38, 38, 0.12)' },
  { id: 'nursing', label: 'Nursing', emoji: '👩‍⚕️', icon: 'heart-outline', color: '#DB2777', colorMuted: 'rgba(219, 39, 119, 0.12)' },
  { id: 'dentistry', label: 'Dentistry', emoji: '🦷', icon: 'happy-outline', color: '#0891B2', colorMuted: 'rgba(8, 145, 178, 0.12)' },
  { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', icon: 'medkit-outline', color: '#16A34A', colorMuted: 'rgba(22, 163, 74, 0.12)' },
  { id: 'biomedical-sciences', label: 'Biomedical Sciences', emoji: '🔬', icon: 'flask-outline', color: '#7C3AED', colorMuted: 'rgba(124, 58, 237, 0.12)' },
  { id: 'other', label: 'Other', emoji: '🗺️', icon: 'map-outline', color: '#CA8A04', colorMuted: 'rgba(202, 138, 4, 0.12)' },
];
