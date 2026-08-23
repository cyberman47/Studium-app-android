// A small "recent lessons" list for the chat's lesson picker. Mirrors the
// subjects already used elsewhere in the app's mock data (Home's
// nextLesson, Progress's focusAreas) rather than inventing new ones, so
// the picker feels like it's pulling from the same curriculum.
export type RecentLesson = { id: string; title: string; subject: string };

export const recentLessons: RecentLesson[] = [
  { id: 'cell-membrane', title: 'Cell Membrane & Transport', subject: 'Biology' },
  { id: 'enzyme-kinetics', title: 'Enzyme Kinetics', subject: 'Biochemistry' },
  { id: 'acid-base', title: 'Acid-Base Balance', subject: 'Physics' },
  { id: 'organic-reactions', title: 'Common Organic Reactions', subject: 'Organic Chemistry' },
];
