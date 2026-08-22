/**
 * The curriculum data behind the redesigned "All Lessons" screen — real
 * lesson titles and real progress (only MCAT → Biology has actual
 * completable lessons today, matching Home's Continue Studying card
 * exactly: lesson 5 of 9, "Cell Membranes & Transport", in progress).
 * Mastery percentages, time, and question counts are representative mock
 * detail layered on top of that real title/order/status, same as every
 * other mock-data screen in this app.
 */

export type LessonStatus = 'mastered' | 'completed' | 'current' | 'locked';

export type CurriculumLesson = {
  id: string;
  title: string;
  status: LessonStatus;
  masteryPercent?: number;
  minutes: number;
  questions: number;
};

export type CurriculumUnit = {
  id: string;
  title: string;
  lessons: CurriculumLesson[];
};

export const biologyCurriculum: CurriculumUnit[] = [
  {
    id: 'foundations',
    title: 'Foundations of Cell Biology & Genetics',
    lessons: [
      { id: 'cell-structure-organelles', title: 'Cell Structure & Organelles', status: 'mastered', masteryPercent: 96, minutes: 18, questions: 24 },
      { id: 'cell-communication-signaling', title: 'Cell Communication & Signaling', status: 'mastered', masteryPercent: 91, minutes: 16, questions: 20 },
      { id: 'cell-cycle-mitosis-meiosis', title: 'Cell Cycle, Mitosis & Meiosis', status: 'completed', masteryPercent: 84, minutes: 20, questions: 22 },
      { id: 'mendelian-genetics-inheritance', title: 'Mendelian Genetics & Inheritance', status: 'completed', masteryPercent: 88, minutes: 17, questions: 19 },
    ],
  },
  {
    id: 'membranes-molecular',
    title: 'Membranes & Molecular Biology',
    lessons: [
      { id: 'cell-membranes-transport', title: 'Cell Membranes & Transport', status: 'current', minutes: 22, questions: 26 },
      { id: 'dna-replication-repair', title: 'DNA Replication & Repair', status: 'locked', minutes: 19, questions: 21 },
      { id: 'transcription-rna', title: 'Transcription & RNA', status: 'locked', minutes: 18, questions: 20 },
      { id: 'translation-protein-synthesis', title: 'Translation & Protein Synthesis', status: 'locked', minutes: 21, questions: 23 },
      { id: 'gene-regulation-mutations', title: 'Gene Regulation & Mutations', status: 'locked', minutes: 20, questions: 22 },
    ],
  },
];

export function unitProgress(unit: CurriculumUnit): { done: number; total: number; percent: number } {
  const done = unit.lessons.filter((l) => l.status === 'mastered' || l.status === 'completed').length;
  const total = unit.lessons.length;
  return { done, total, percent: Math.round((done / total) * 100) };
}
