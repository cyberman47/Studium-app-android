// Mirrors studium-website's lib/currentPath.ts CurrentPathId, label, and
// pathEmoji map exactly — same column (profiles.education_track, see
// supabase/migrations/0008_education_track.sql), same real values, so a
// student's track reads identically on mobile and web. Kept as a small
// standalone module here rather than importing across repos (this is a
// separate app/repo from studium-website).
export type EducationTrack =
  | 'medical-school'
  | 'mcat'
  | 'nursing'
  | 'dentistry'
  | 'pharmacy'
  | 'biomedical-sciences'
  | 'other';

const LABELS: Record<EducationTrack, string> = {
  'medical-school': 'Medical School',
  mcat: 'MCAT Preparation',
  nursing: 'Nursing',
  dentistry: 'Dentistry',
  pharmacy: 'Pharmacy',
  'biomedical-sciences': 'Biomedical Sciences',
  other: 'Other',
};

const EMOJI: Record<EducationTrack, string> = {
  'medical-school': '🩺',
  mcat: '🧬',
  nursing: '👩‍⚕️',
  dentistry: '🦷',
  pharmacy: '💊',
  'biomedical-sciences': '🔬',
  other: '🗺️',
};

function isEducationTrack(value: string): value is EducationTrack {
  return value in LABELS;
}

export function educationTrackLabel(value: string | null | undefined): string {
  return value && isEducationTrack(value) ? LABELS[value] : LABELS.mcat;
}

export function educationTrackEmoji(value: string | null | undefined): string {
  return value && isEducationTrack(value) ? EMOJI[value] : EMOJI.mcat;
}
