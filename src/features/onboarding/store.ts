import AsyncStorage from '@react-native-async-storage/async-storage';

import { setOnboardingComplete } from '@/features/auth/store';
import { studyingForToEducationTrack } from '@/lib/educationTrack';
import { supabase } from '@/lib/supabase';

export type OnboardingAnswers = {
  name: string;
  studyingFor: string | null;
  goal: string | null;
  dailyStudyTime: string | null;
  timeline: string | null;
  learningStyle: string[];
};

export const emptyAnswers: OnboardingAnswers = {
  name: '',
  studyingFor: null,
  goal: null,
  dailyStudyTime: null,
  timeline: null,
  learningStyle: [],
};

export const studyingForOptions = ['MCAT', 'Medical School', 'USMLE', 'Nursing', 'Anatomy', 'General Medical Knowledge', 'Other'];
export const goalOptions = [
  'Get into medical school',
  'Prepare for an exam',
  'Master medical concepts',
  'Improve my grades',
  'Build a strong medical foundation',
];
export const dailyStudyTimeOptions = ['Less than 30 minutes', '30–60 minutes', '1–2 hours', '2–3 hours', '3+ hours'];
export const timelineOptions = ['Within 1 month', '1–3 months', '3–6 months', '6–12 months', 'More than a year', "I'm not sure yet"];
export const learningStyleOptions = [
  'Flashcards & active recall',
  'Practice questions',
  'Videos & visual lessons',
  'Reading & notes',
  'A mix of everything',
];

const LOCAL_ANSWERS_KEY = 'studium_onboarding_local_answers';

// name and studyingFor (mapped to education_track) land on the real
// profiles row — both are genuine existing columns. goal/dailyStudyTime/
// timeline/learningStyle have no backing column anywhere in the product
// yet (checked studium-website's schema first), so they're saved locally
// instead of invented as fake-real Supabase fields — same honesty as
// every other locally-only store in this app. Nothing reads them back yet
// either; they're saved so a real "what you told us" editor (the kind
// Settings > Profile already is on the web app) has real data to show
// once mobile grows one, rather than the answers being thrown away.
export async function completeOnboarding(answers: OnboardingAnswers, userId: string): Promise<void> {
  const educationTrack = studyingForToEducationTrack(answers.studyingFor);
  const { error } = await supabase
    .from('profiles')
    .update({
      name: answers.name.trim(),
      education_track: educationTrack,
      onboarding_complete: true,
    })
    .eq('id', userId);
  if (error) throw error;

  await AsyncStorage.setItem(
    LOCAL_ANSWERS_KEY,
    JSON.stringify({
      goal: answers.goal,
      dailyStudyTime: answers.dailyStudyTime,
      timeline: answers.timeline,
      learningStyle: answers.learningStyle,
    }),
  );

  // Flips the auth store's local copy immediately so the launch gate
  // (app/_layout.tsx) stops redirecting back to Onboarding without
  // waiting on a fresh profiles fetch to notice the update above.
  setOnboardingComplete();
}
