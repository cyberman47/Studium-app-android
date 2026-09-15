import { supabase } from './supabase';

/**
 * Real question-bank content, read straight from Supabase — the phone
 * app's only source for MCAT/Nursing subjects, lessons, and practice
 * questions. Every lesson select below names its columns explicitly and
 * never includes the reading-content columns real rows also carry
 * (mcat_lessons.simplified_explanation, document_intro_*, key_takeaways,
 * etc. — that's exactly the "lesson" material the app deliberately no
 * longer shows; only mcat_lesson_concepts/mcat_flashcards would ever
 * surface it, and nothing here reads those tables). RLS on every table
 * below is locked to `authenticated`, same as `profiles`/`leaderboard`
 * elsewhere in this app — an anon session gets a permission error, so
 * every function here assumes a signed-in Supabase session already exists.
 */

export type BankTrack = 'mcat' | 'nursing';

export type BankSubject = {
  id: string;
  name: string;
  sectionId?: string; // mcat only
  topicId?: string; // nursing only
  position: number;
};

export type BankTopic = {
  id: string;
  title: string;
  position: number;
};

export type BankLesson = {
  id: string;
  title: string;
  subjectId: string;
  position: number;
  difficulty: string;
  estimatedMinutes?: number;
};

export type BankQuestion = {
  id: string;
  lessonId: string;
  position: number;
  question: string;
  concept: string;
  options: string[];
  correctIndex: number;
  optionExplanations: string[];
};

export async function getMcatSubjects(): Promise<BankSubject[]> {
  const { data, error } = await supabase
    .from('mcat_subjects')
    .select('id, name, section_id, position')
    .order('section_id')
    .order('position');
  if (error) throw error;
  return (data ?? []).map((r) => ({ id: r.id, name: r.name, sectionId: r.section_id, position: r.position }));
}

export async function getMcatLessons(subjectId: string): Promise<BankLesson[]> {
  const { data, error } = await supabase
    .from('mcat_lessons')
    .select('id, title, subject_id, position, difficulty, estimated_minutes')
    .eq('subject_id', subjectId)
    .order('position');
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    subjectId: r.subject_id,
    position: r.position,
    difficulty: r.difficulty,
    estimatedMinutes: r.estimated_minutes ?? undefined,
  }));
}

export async function getMcatQuestions(lessonId: string): Promise<BankQuestion[]> {
  const { data, error } = await supabase
    .from('mcat_practice_questions')
    .select('id, lesson_id, position, question, concept, options, correct_index, option_explanations')
    .eq('lesson_id', lessonId)
    .order('position');
  if (error) throw error;
  return toBankQuestions(data ?? []);
}

export async function getNursingTopics(): Promise<BankTopic[]> {
  const { data, error } = await supabase.from('nursing_topics').select('id, title, position').order('position');
  if (error) throw error;
  return data ?? [];
}

export async function getNursingSubjects(topicId: string): Promise<BankSubject[]> {
  const { data, error } = await supabase
    .from('nursing_subjects')
    .select('id, name, topic_id, position')
    .eq('topic_id', topicId)
    .order('position');
  if (error) throw error;
  return (data ?? []).map((r) => ({ id: r.id, name: r.name, topicId: r.topic_id, position: r.position }));
}

export async function getNursingLessons(subjectId: string): Promise<BankLesson[]> {
  const { data, error } = await supabase
    .from('nursing_lessons')
    .select('id, title, subject_id, position, difficulty')
    .eq('subject_id', subjectId)
    .order('position');
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    subjectId: r.subject_id,
    position: r.position,
    difficulty: r.difficulty,
  }));
}

export async function getNursingQuestions(lessonId: string): Promise<BankQuestion[]> {
  const { data, error } = await supabase
    .from('nursing_quiz_questions')
    .select('id, lesson_id, position, question, concept, options, correct_index, option_explanations')
    .eq('lesson_id', lessonId)
    .order('position');
  if (error) throw error;
  return toBankQuestions(data ?? []);
}

export async function getQuestionsForLesson(track: BankTrack, lessonId: string): Promise<BankQuestion[]> {
  return track === 'mcat' ? getMcatQuestions(lessonId) : getNursingQuestions(lessonId);
}

export async function getLessonsForSubject(track: BankTrack, subjectId: string): Promise<BankLesson[]> {
  return track === 'mcat' ? getMcatLessons(subjectId) : getNursingLessons(subjectId);
}

// Every MCAT subject with its real lessons, one round trip per subject
// (run in parallel) — used by the Study tab's section cards to compute
// real per-section lesson counts without hardcoding them.
export async function getAllMcatSubjectsWithLessons(): Promise<{ subject: BankSubject; lessons: BankLesson[] }[]> {
  const subjects = await getMcatSubjects();
  const lessonsBySubject = await Promise.all(subjects.map((s) => getMcatLessons(s.id)));
  return subjects.map((subject, i) => ({ subject, lessons: lessonsBySubject[i] }));
}

// PostgREST has no per-group count without a bespoke view/RPC, so this
// pulls just the `lesson_id` column (no question text/options/
// explanations) for every lesson and tallies client-side. This project's
// PostgREST caps any response at 1000 rows regardless of how many actually
// match (confirmed: an unfiltered mcat_practice_questions fetch returns
// exactly 1000 of its real 1400 rows) — MCAT alone has 1400 questions, so
// a single request silently drops whichever lessons' rows land past that
// cutoff. Paginating with `.range()` until a page comes back under 1000
// rows is what actually gets every row, at any scale.
const COUNT_PAGE_SIZE = 1000;

export async function getQuestionCountsForLessons(track: BankTrack, lessonIds: string[]): Promise<Record<string, number>> {
  if (lessonIds.length === 0) return {};
  const table = track === 'mcat' ? 'mcat_practice_questions' : 'nursing_quiz_questions';
  const counts: Record<string, number> = {};
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from(table)
      .select('lesson_id')
      .in('lesson_id', lessonIds)
      .range(from, from + COUNT_PAGE_SIZE - 1);
    if (error) throw error;
    for (const row of data ?? []) {
      counts[row.lesson_id] = (counts[row.lesson_id] ?? 0) + 1;
    }
    if (!data || data.length < COUNT_PAGE_SIZE) break;
    from += COUNT_PAGE_SIZE;
  }
  return counts;
}

type RawQuestionRow = {
  id: string;
  lesson_id: string;
  position: number;
  question: string;
  concept: string;
  options: string[];
  correct_index: number;
  option_explanations: string[];
};

function toBankQuestions(rows: RawQuestionRow[]): BankQuestion[] {
  return rows.map((r) => ({
    id: r.id,
    lessonId: r.lesson_id,
    position: r.position,
    question: r.question,
    concept: r.concept,
    options: r.options,
    correctIndex: r.correct_index,
    optionExplanations: r.option_explanations,
  }));
}
