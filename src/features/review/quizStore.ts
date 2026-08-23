import { useSyncExternalStore } from 'react';

/**
 * What Create > New Quiz actually creates, and what the Review tab's
 * Quizzes panel lists. There's no quiz-taking engine anywhere in this
 * app yet (no scoring, no attempt history), so unlike Flashcards/Notes
 * this store only tracks the quizzes themselves — real, user-created,
 * genuinely persisted for the session — not fabricated scores or
 * "resume" state that doesn't exist. Same module-level
 * useSyncExternalStore pattern as features/mycontent/store.ts.
 */

export type QuizQuestion = { question: string; options: string[]; correctIndex: number };

export type Quiz = {
  id: string;
  title: string;
  subject: string;
  questions: QuizQuestion[];
  createdAt: number;
};

let quizzes: Quiz[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useQuizzes(): Quiz[] {
  return useSyncExternalStore(subscribe, () => quizzes);
}

export function addQuiz(title: string, subject: string, questions: QuizQuestion[]) {
  const quiz: Quiz = { id: `quiz-${Date.now()}`, title, subject, questions, createdAt: Date.now() };
  quizzes = [quiz, ...quizzes];
  emit();
}

export function removeQuiz(id: string) {
  quizzes = quizzes.filter((q) => q.id !== id);
  emit();
}
