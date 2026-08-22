import type { Ionicons } from '@expo/vector-icons';

export type LibraryItemId =
  | 'lessons'
  | 'saved'
  | 'recent'
  | 'community'
  | 'articles'
  | 'resources'
  | 'decks'
  | 'flagged'
  | 'mistakes';

export type LibraryDetailRow = { title: string; subtitle: string };

export type LibraryDetail = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  rows: LibraryDetailRow[];
};

/**
 * What each Library card/row actually opens. "All Lessons" uses the same
 * real MCAT → Biology lesson titles and progress as Home's Continue
 * Studying card (lesson 5, "Cell Membranes & Transport", mid-list —
 * matching "Lesson 5 of 9" exactly) rather than inventing a different
 * lesson order. Everything else is representative mock content, same as
 * the rest of this app's mock-data screens.
 */
export const libraryDetails: Record<LibraryItemId, LibraryDetail> = {
  lessons: {
    title: 'All Lessons',
    description: 'Every official Studium lesson. Only MCAT → Biology has real, completable lessons today.',
    icon: 'book-outline',
    rows: [
      { title: 'Cell Structure & Organelles', subtitle: 'Biology · Completed' },
      { title: 'Cell Communication & Signaling', subtitle: 'Biology · Completed' },
      { title: 'Cell Cycle, Mitosis & Meiosis', subtitle: 'Biology · Completed' },
      { title: 'Mendelian Genetics & Inheritance', subtitle: 'Biology · Completed' },
      { title: 'Cell Membranes & Transport', subtitle: 'Biology · In progress' },
      { title: 'DNA Replication & Repair', subtitle: 'Biology · Locked' },
      { title: 'Transcription & RNA', subtitle: 'Biology · Locked' },
      { title: 'Translation & Protein Synthesis', subtitle: 'Biology · Locked' },
      { title: 'Gene Regulation & Mutations', subtitle: 'Biology · Locked' },
    ],
  },
  saved: {
    title: 'Saved',
    description: "Everything you've bookmarked — Studium and Community content together.",
    icon: 'layers-outline',
    rows: [
      { title: 'Cell Membranes & Transport', subtitle: 'Lesson · Biology' },
      { title: 'How to Build a Study Schedule That Sticks', subtitle: 'Article · Study Strategies' },
      { title: 'MCAT Official Guide (AAMC)', subtitle: 'Resource · Official source' },
      { title: 'Anki vs. Studium Flashcards: What the Research Says', subtitle: 'Article · Study Strategies' },
      { title: 'Cardiovascular Physiology', subtitle: 'Community guide · By Priya S.' },
      { title: 'NCLEX Question Bank Comparison', subtitle: 'Resource · Nursing' },
      { title: 'The Pomodoro Technique for Long Study Sessions', subtitle: 'Article · Productivity' },
    ],
  },
  recent: {
    title: 'Recently Added',
    description: 'The newest official lessons and community study guides.',
    icon: 'time-outline',
    rows: [
      { title: 'Gene Regulation & Mutations', subtitle: 'Lesson · Added 2d ago' },
      { title: 'Anatomy Study Group: Brachial Plexus Cheat Sheet', subtitle: 'Community guide · Added 3d ago' },
      { title: 'What Changed on the 2025 MCAT', subtitle: 'Article · Added 4d ago' },
      { title: 'NBME Practice Exam Score Correlator', subtitle: 'Resource · Added 5d ago' },
      { title: 'Translation & Protein Synthesis', subtitle: 'Lesson · Added 6d ago' },
    ],
  },
  community: {
    title: 'Community',
    description: 'Study guides published by fellow students — preview, then add to your Library.',
    icon: 'globe-outline',
    rows: [
      { title: 'Cardiovascular Physiology, Simplified', subtitle: 'By Priya S. · 41 saves' },
      { title: 'My Full MCAT Biochem Review Doc', subtitle: 'By Marcus T. · 33 saves' },
      { title: 'Brachial Plexus Cheat Sheet', subtitle: 'By Elena R. · 27 saves' },
      { title: 'NCLEX Pharm Mnemonics That Actually Work', subtitle: 'By Jordan K. · 22 saves' },
      { title: 'CARS Passage Breakdown: 10 Real Examples', subtitle: 'By Priya S. · 19 saves' },
    ],
  },
  articles: {
    title: 'Articles',
    description: 'Short, focused reads on real study skills and exam concepts.',
    icon: 'document-text-outline',
    rows: [
      { title: 'How to Build a Study Schedule That Sticks', subtitle: 'Study Strategies · 6 min read' },
      { title: 'Active Recall vs. Re-Reading: What the Research Says', subtitle: 'Study Strategies · 5 min read' },
      { title: 'The Pomodoro Technique for Long Study Sessions', subtitle: 'Productivity · 4 min read' },
      { title: 'What Changed on the 2025 MCAT', subtitle: 'MCAT · 7 min read' },
      { title: 'A Realistic Timeline for NCLEX Prep', subtitle: 'Nursing · 6 min read' },
      { title: 'Why Spaced Repetition Beats Cramming', subtitle: 'Study Strategies · 5 min read' },
    ],
  },
  resources: {
    title: 'Resources',
    description: 'Real reference material and official sources worth bookmarking.',
    icon: 'link-outline',
    rows: [
      { title: 'MCAT Official Guide (AAMC)', subtitle: 'Official source · MCAT' },
      { title: 'NCLEX-RN Test Plan (NCSBN)', subtitle: 'Official source · Nursing' },
      { title: 'USMLE Step 1 Content Outline', subtitle: 'Official source · USMLE' },
      { title: 'Gray’s Anatomy for Students, Online Edition', subtitle: 'Reference · Anatomy' },
      { title: 'NBME Self-Assessment Exams', subtitle: 'Practice exams · USMLE' },
    ],
  },
  decks: {
    title: 'My Decks',
    description: 'Your flashcard decks, ready to review.',
    icon: 'albums-outline',
    rows: [
      { title: 'Biochemistry Pathways', subtitle: '84 cards' },
      { title: 'Organic Chemistry Reactions', subtitle: '62 cards' },
      { title: 'Anatomy: Upper Limb', subtitle: '47 cards' },
      { title: 'Pharmacology: Cardiovascular Drugs', subtitle: '58 cards' },
      { title: 'CARS Vocabulary', subtitle: '35 cards' },
    ],
  },
  flagged: {
    title: 'Flagged Questions',
    description: "Questions you've flagged to come back to.",
    icon: 'flag-outline',
    rows: [
      { title: 'Which enzyme catalyzes the rate-limiting step of glycolysis?', subtitle: 'Biology' },
      { title: 'A patient presents with pleuritic chest pain and hypoxia...', subtitle: 'Clinical Reasoning' },
      { title: 'What is the primary mechanism of action of beta-blockers?', subtitle: 'Pharmacology' },
      { title: 'Identify the passage’s primary rhetorical strategy.', subtitle: 'CARS' },
      { title: 'Which cranial nerve is responsible for the corneal reflex?', subtitle: 'Anatomy' },
    ],
  },
  mistakes: {
    title: 'Mistake Vault',
    description: 'Questions you missed, worth reviewing before they show up again.',
    icon: 'alert-circle-outline',
    rows: [
      { title: 'What distinguishes competitive from noncompetitive inhibition?', subtitle: 'Biochemistry' },
      { title: 'A 34-year-old presents with sudden dyspnea 2 weeks postpartum...', subtitle: 'Clinical Reasoning' },
      { title: 'Which acid-base disorder produces a compensatory respiratory response?', subtitle: 'Physiology' },
      { title: 'Which nursing intervention takes priority in this scenario?', subtitle: 'Nursing' },
      { title: 'What does the author’s tone in paragraph 3 suggest?', subtitle: 'CARS' },
    ],
  },
};
