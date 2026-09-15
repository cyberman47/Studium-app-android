// Intentionally empty. This used to carry 11 cases ported verbatim from
// the web app's lib/clinicalCases.ts; they were removed on request, and
// per that same request, real case content going forward is meant to be
// pulled from Supabase rather than bundled as static TS data like this —
// see the note on getCaseOfTheDay in logic.ts for what that migration
// actually needs before it can happen. Until then, Medical Cases is
// honestly blank everywhere it's shown (Daily Case card/screen, the
// Medical Cases track's browse list) rather than showing stale content.
export type ClinicalCase = {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  stem: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  patientIntro: string;
  narrative: string[];
  optionRationales: string[];
  keyClues: string[];
};

export const clinicalCases: ClinicalCase[] = [];
