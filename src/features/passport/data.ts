/**
 * Mock data for the Passport screen — mirrors the shape of the web app's
 * richer achievement engine (lib/achievements.ts): categorized, rarity-
 * tiered achievements, each computed from something Studium tracks
 * elsewhere. Two per category here (14 total, matching
 * features/profile/data.ts's achievementsTotal) rather than the real
 * ~25-achievement list, but the real titles/requirements/rarities for a
 * representative one per family.
 */

export type AchievementCategory =
  | 'knowledge'
  | 'studying'
  | 'flashcards'
  | 'questions'
  | 'medicalKnowledge'
  | 'clinical'
  | 'community';

export const categoryLabels: Record<AchievementCategory, string> = {
  knowledge: 'Knowledge',
  studying: 'Studying',
  flashcards: 'Flashcards',
  questions: 'Questions',
  medicalKnowledge: 'Medical Knowledge',
  clinical: 'Clinical',
  community: 'Community',
};

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export const rarityColors: Record<AchievementRarity, string> = {
  common: '#64748B',
  uncommon: '#0F8B8D',
  rare: '#0369A1',
  epic: '#7C3AED',
  legendary: '#D97706',
};

export type Achievement = {
  id: string;
  category: AchievementCategory;
  title: string;
  requirement: string;
  rarity: AchievementRarity;
  unlocked: boolean;
};

// All locked — matches the profile's real "0 of 14 unlocked" state
// (a brand-new account, 110 lifetime KP), not a fabricated head start.
export const mockAchievements: Achievement[] = [
  { id: 'knowledge0', category: 'knowledge', title: '1,000 Knowledge Points', requirement: 'Reach 1,000 KP', rarity: 'common', unlocked: false },
  { id: 'knowledge1', category: 'knowledge', title: '5,000 Knowledge Points', requirement: 'Reach 5,000 KP', rarity: 'uncommon', unlocked: false },
  { id: 'studying0', category: 'studying', title: 'First Study Session', requirement: 'Complete 1 study session', rarity: 'common', unlocked: false },
  { id: 'studying1', category: 'studying', title: '7-Day Streak', requirement: 'Reach a 7-day streak', rarity: 'uncommon', unlocked: false },
  { id: 'flashcards0', category: 'flashcards', title: 'Master 100 Flashcards', requirement: 'Master 100 flashcards', rarity: 'common', unlocked: false },
  { id: 'flashcards1', category: 'flashcards', title: 'Master 500 Flashcards', requirement: 'Master 500 flashcards', rarity: 'uncommon', unlocked: false },
  { id: 'questions0', category: 'questions', title: '100 Questions Answered', requirement: 'Answer 100 practice questions', rarity: 'common', unlocked: false },
  { id: 'questions1', category: 'questions', title: '80% Accuracy', requirement: 'Reach 80% accuracy over 50+ questions', rarity: 'rare', unlocked: false },
  { id: 'medicalKnowledge0', category: 'medicalKnowledge', title: 'First Terms Learned', requirement: 'Learn 25 medical terms', rarity: 'common', unlocked: false },
  { id: 'medicalKnowledge1', category: 'medicalKnowledge', title: 'Terminology Master', requirement: 'Master 200 medical terms', rarity: 'rare', unlocked: false },
  { id: 'clinical0', category: 'clinical', title: 'First Case Solved', requirement: 'Solve your first Daily Case', rarity: 'common', unlocked: false },
  { id: 'clinical1', category: 'clinical', title: '7-Day Case Streak', requirement: 'Solve 7 Daily Cases in a row', rarity: 'uncommon', unlocked: false },
  { id: 'community0', category: 'community', title: 'First Post', requirement: 'Post in the Forum for the first time', rarity: 'common', unlocked: false },
  { id: 'community1', category: 'community', title: 'Helpful Answer', requirement: 'Get 5 reactions on a Forum answer', rarity: 'uncommon', unlocked: false },
];
