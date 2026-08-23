// A small real starter glossary — factually accurate medical terms and
// definitions, not placeholder text — standing in for the web app's full
// terminology database (lib/terminology.ts there has hundreds of terms
// across every specialty) until the mobile app reads that same real
// source. This is content, not user data: safe to ship as real,
// unlike the per-user "terms learned" counts below, which start at 0
// and only grow from something the signed-in student actually does.
export type TermEntry = {
  id: string;
  term: string;
  category: string;
  definition: string;
};

export const termGlossary: TermEntry[] = [
  { id: 'hemostasis', term: 'Hemostasis', category: 'Cardiovascular', definition: 'The physiological process that stops bleeding, involving vasoconstriction, platelet plug formation, and coagulation.' },
  { id: 'dyspnea', term: 'Dyspnea', category: 'Respiratory', definition: 'The subjective sensation of difficult or uncomfortable breathing; shortness of breath.' },
  { id: 'bradycardia', term: 'Bradycardia', category: 'Cardiology', definition: 'A resting heart rate slower than 60 beats per minute in adults.' },
  { id: 'tachypnea', term: 'Tachypnea', category: 'Respiratory', definition: 'Abnormally rapid breathing, typically more than 20 breaths per minute at rest in adults.' },
  { id: 'edema', term: 'Edema', category: 'General', definition: 'Swelling caused by excess fluid trapped in the body’s tissues.' },
  { id: 'nystagmus', term: 'Nystagmus', category: 'Neurology', definition: 'Involuntary, rhythmic oscillation of the eyes, often indicating a vestibular or neurological issue.' },
  { id: 'anisocoria', term: 'Anisocoria', category: 'Neurology', definition: 'A condition where the two pupils are unequal in size.' },
  { id: 'jaundice', term: 'Jaundice', category: 'Hepatology', definition: 'Yellowing of the skin and eyes caused by elevated bilirubin levels in the blood.' },
];
