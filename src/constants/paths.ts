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
};

export const pathOptions: PathOption[] = [
  { id: 'medical-school', label: 'Medical School', emoji: '🩺', icon: 'school-outline' },
  { id: 'mcat', label: 'MCAT Preparation', emoji: '🧬', icon: 'clipboard-outline' },
  { id: 'nursing', label: 'Nursing', emoji: '👩‍⚕️', icon: 'heart-outline' },
  { id: 'dentistry', label: 'Dentistry', emoji: '🦷', icon: 'happy-outline' },
  { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', icon: 'medkit-outline' },
  { id: 'biomedical-sciences', label: 'Biomedical Sciences', emoji: '🔬', icon: 'flask-outline' },
  { id: 'other', label: 'Other', emoji: '🗺️', icon: 'map-outline' },
];
