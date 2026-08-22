import type { TrackId } from './tracks';

export type TrackDetailRow = { title: string; subtitle: string };

export type TrackDetail = {
  description: string;
  rows: TrackDetailRow[];
};

/**
 * Real section/topic titles copied from the web app's own path data
 * (lib/mcatPath.ts, lib/medicalSchoolPath.ts, lib/nursingPath.ts,
 * lib/anatomyPath.ts, lib/pharmacologyPath.ts, lib/usmlePath.ts,
 * lib/clinicalCases.ts) — not invented. Only MCAT → Biology has real,
 * completable lessons today (see Home's Continue Studying card); every
 * other subtitle here is a representative lesson/topic count until the
 * mobile app reads real per-lesson progress for that track.
 */
export const trackDetails: Record<TrackId, TrackDetail> = {
  mcat: {
    description: 'The four real MCAT sections. Biology has real, completable lessons today — everything else is a browsable structure.',
    rows: [
      { title: 'Biological & Biochemical Foundations of Living Systems', subtitle: '4 subjects · Biology has 9 real lessons' },
      { title: 'Chemical & Physical Foundations of Biological Systems', subtitle: '4 subjects · General/Organic Chem, Physics' },
      { title: 'Psychological, Social & Biological Foundations of Behavior', subtitle: '3 subjects · Psychology, Sociology' },
      { title: 'Critical Analysis & Reasoning Skills', subtitle: '2 subjects · CARS strategy & practice' },
    ],
  },
  'medical-school': {
    description: 'Core pre-clinical and clinical topics, browsable by subject.',
    rows: [
      { title: 'Anatomy', subtitle: '6 topics' },
      { title: 'Physiology', subtitle: '6 topics' },
      { title: 'Pathology', subtitle: '4 topics' },
      { title: 'Pharmacology', subtitle: '5 topics' },
      { title: 'Microbiology', subtitle: '5 topics' },
      { title: 'Immunology', subtitle: '4 topics' },
      { title: 'Biochemistry', subtitle: '5 topics' },
      { title: 'Clinical Medicine', subtitle: '6 topics' },
      { title: 'Clinical Skills', subtitle: '4 topics' },
    ],
  },
  nursing: {
    description: 'Foundations through NCLEX preparation, browsable by topic.',
    rows: [
      { title: 'Foundations of Nursing', subtitle: '5 topics' },
      { title: 'Anatomy & Physiology', subtitle: '5 topics' },
      { title: 'Pharmacology', subtitle: '5 topics' },
      { title: 'Health Assessment', subtitle: '4 topics' },
      { title: 'Medical-Surgical Nursing', subtitle: '6 topics' },
      { title: 'Maternal & Child Nursing', subtitle: '4 topics' },
      { title: 'Mental Health Nursing', subtitle: '3 topics' },
      { title: 'Geriatric Nursing', subtitle: '3 topics' },
      { title: 'Emergency & Critical Care', subtitle: '4 topics' },
      { title: 'Clinical Skills', subtitle: '4 topics' },
      { title: 'NCLEX Preparation', subtitle: '5 topics' },
    ],
  },
  anatomy: {
    description: 'Region-by-region anatomy, from terminology to neuroanatomy.',
    rows: [
      { title: 'Anatomical Terminology', subtitle: '3 topics' },
      { title: 'Upper Limb', subtitle: '5 topics' },
      { title: 'Lower Limb', subtitle: '5 topics' },
      { title: 'Spine and Back', subtitle: '4 topics' },
      { title: 'Thorax', subtitle: '4 topics' },
      { title: 'Abdomen', subtitle: '5 topics' },
      { title: 'Pelvic Girdle and Floor', subtitle: '3 topics' },
      { title: 'Head and Neck', subtitle: '5 topics' },
      { title: 'Neuroanatomy', subtitle: '4 topics' },
    ],
  },
  pharmacology: {
    description: 'Drug classes, mechanisms, and interactions by system.',
    rows: [
      { title: 'General Principles', subtitle: '4 topics' },
      { title: 'Autonomic & CNS Drugs', subtitle: '5 topics' },
      { title: 'Cardiovascular Drugs', subtitle: '5 topics' },
      { title: 'Antimicrobials', subtitle: '5 topics' },
      { title: 'Endocrine & Metabolic Drugs', subtitle: '4 topics' },
      { title: 'Respiratory & GI Drugs', subtitle: '4 topics' },
      { title: 'Oncology & Immunology Drugs', subtitle: '3 topics' },
      { title: 'Toxicology & Drug Interactions', subtitle: '3 topics' },
    ],
  },
  'medical-cases': {
    description: 'Real clinical case challenges — the same content as the Daily Case, browsable all at once.',
    rows: [
      { title: 'Chest Pain After Exertion', subtitle: 'Cardiology · Beginner' },
      { title: 'The Worst Headache of Her Life', subtitle: 'Neurology · Advanced' },
      { title: 'Sudden Breathlessness Postpartum', subtitle: 'Pulmonology · Intermediate' },
      { title: 'Migrating Abdominal Pain', subtitle: 'General Surgery · Intermediate' },
      { title: 'Vomiting and Deep Breathing', subtitle: 'Endocrinology · Intermediate' },
      { title: 'Fever, Stiff Neck, and a Rash', subtitle: 'Infectious Disease · Advanced' },
      { title: 'Sudden Big Toe Pain', subtitle: 'Rheumatology · Beginner' },
      { title: 'Palpitations and an Irregular Pulse', subtitle: 'Cardiology · Intermediate' },
      { title: 'Fainting in a Crowded Room', subtitle: 'Cardiology · Beginner' },
      { title: 'Pain Out of Proportion to Exam', subtitle: 'General Surgery · Advanced' },
      { title: 'Descending Paralysis After a Questionable Meal', subtitle: 'Neurology · Advanced' },
    ],
  },
  usmle: {
    description: 'Systems-based review, matching the real USMLE Step blueprint.',
    rows: [
      { title: 'General Principles', subtitle: '5 topics' },
      { title: 'Cardiovascular System', subtitle: '5 topics' },
      { title: 'Respiratory System', subtitle: '4 topics' },
      { title: 'Gastrointestinal System', subtitle: '4 topics' },
      { title: 'Renal & Urinary System', subtitle: '4 topics' },
      { title: 'Reproductive System', subtitle: '3 topics' },
      { title: 'Endocrine System', subtitle: '3 topics' },
      { title: 'Musculoskeletal System', subtitle: '4 topics' },
      { title: 'Nervous System & Special Senses', subtitle: '5 topics' },
      { title: 'Hematology & Oncology', subtitle: '3 topics' },
      { title: 'Behavioral Health & Biostatistics', subtitle: '3 topics' },
      { title: 'Multisystem Processes & Disorders', subtitle: '3 topics' },
    ],
  },
};
