/**
 * Mock study groups — the real seed data from
 * supabase/migrations/0011_study_groups.sql, copied verbatim (name,
 * description, category). Member counts are mocked but modest, matching
 * the real seed's "honestly starting at 0 members" comment rather than
 * inventing a busy community that doesn't exist yet.
 */

export type StudyGroup = {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  joined: boolean;
};

export const mockStudyGroups: StudyGroup[] = [
  { id: 'mcat-biology', name: 'MCAT Biology', description: 'Working through MCAT Biology & Biochemistry together.', category: 'MCAT', memberCount: 24, joined: false },
  { id: 'pre-med-students', name: 'Pre-Med Students', description: 'General support and study group for pre-med students.', category: 'MCAT', memberCount: 41, joined: true },
  { id: 'anatomy-study-group', name: 'Anatomy Study Group', description: 'Studying human anatomy together, region by region.', category: 'Anatomy', memberCount: 12, joined: false },
  { id: 'nursing-students', name: 'Nursing Students', description: 'A study group for nursing students at any stage.', category: 'Nursing', memberCount: 18, joined: false },
];
