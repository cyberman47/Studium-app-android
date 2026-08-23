// Data feeding the MCAT-only section grid (features/study/components/
// MCATSectionGrid.tsx) — deliberately separate from trackDetails.ts's
// generic `rows` (title/subtitle pairs shared by all 7 tracks) so this
// card redesign, scoped to MCAT only, doesn't touch the data shape every
// other track's LessonGrid still reads from.
//
// completed/total are representative placeholder numbers, same honesty
// as trackDetails.ts's MCAT rows they replace here — Biology is the one
// subject with real, completable lessons today, everything else is
// still a browsable structure with no real per-lesson progress tracked
// yet.
export type MCATSectionCardData = {
  id: string;
  title: string;
  tags: string[];
  completed: number;
  total: number;
  icon: 'dna' | 'flask-outline' | 'brain' | 'book-open-variant';
};

export const mcatSectionCards: MCATSectionCardData[] = [
  {
    id: 'bio-biochem',
    title: 'Biological & Biochemical Foundations of Living Systems',
    tags: ['Biology', 'Biochemistry'],
    completed: 9,
    total: 48,
    icon: 'dna',
  },
  {
    id: 'chem-phys',
    title: 'Chemical & Physical Foundations of Biological Systems',
    tags: ['General Chem', 'Organic Chem', 'Physics'],
    completed: 0,
    total: 42,
    icon: 'flask-outline',
  },
  {
    id: 'psych-social',
    title: 'Psychological, Social & Biological Foundations of Behavior',
    tags: ['Psychology', 'Sociology'],
    completed: 0,
    total: 50,
    icon: 'brain',
  },
  {
    id: 'cars',
    title: 'Critical Analysis & Reasoning Skills',
    tags: ['CARS Strategy', 'Practice'],
    completed: 0,
    total: 50,
    icon: 'book-open-variant',
  },
];
