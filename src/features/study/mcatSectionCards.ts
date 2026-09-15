// Static per-section metadata (title/tags/icon) for the MCAT section grid
// (features/study/components/MCATSectionList.tsx) — real lesson counts and
// completion are no longer hardcoded here; MCATSectionList fetches them
// live from Supabase (lib/contentBank.ts) and merges them with this
// metadata at render time. `id` matches mcat_subjects.section_id exactly
// for all 14 real subjects in the database.
export type MCATSectionCardData = {
  id: string;
  title: string;
  tags: string[];
  icon: 'dna' | 'flask-outline' | 'brain' | 'book-open-variant';
};

export const mcatSectionCards: MCATSectionCardData[] = [
  {
    id: 'bio-biochem',
    title: 'Biological & Biochemical Foundations of Living Systems',
    tags: ['Biology', 'Biochemistry'],
    icon: 'dna',
  },
  {
    id: 'chem-phys',
    title: 'Chemical & Physical Foundations of Biological Systems',
    tags: ['General Chem', 'Organic Chem', 'Physics'],
    icon: 'flask-outline',
  },
  {
    id: 'psych-social',
    title: 'Psychological, Social & Biological Foundations of Behavior',
    tags: ['Psychology', 'Sociology'],
    icon: 'brain',
  },
  {
    id: 'cars',
    title: 'Critical Analysis & Reasoning Skills',
    tags: ['CARS Strategy', 'Practice'],
    icon: 'book-open-variant',
  },
];
