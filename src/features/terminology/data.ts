// A small real starter glossary — factually accurate medical terms and
// definitions, not placeholder text — standing in for the web app's full
// terminology database (lib/terminology.ts there has hundreds of terms
// across every specialty) until the mobile app reads that same real
// source. This is content, not user data: safe to ship as real,
// unlike the per-user "terms learned" counts below, which start at 0
// and only grow from something the signed-in student actually does.
//
// aiExplanation/clinicalRelevance/relatedTermIds mirror the extra fields
// the web app's Term type carries (lib/terminology.ts) and power the
// expanded term panel (components/ExpandedTermPanel.tsx) — real authored
// content for every term here, not generated text, same standard as the
// definitions themselves.
export type TermEntry = {
  id: string;
  term: string;
  category: string;
  definition: string;
  aiExplanation: string;
  clinicalRelevance: string;
  relatedTermIds: string[];
};

export const termGlossary: TermEntry[] = [
  {
    id: 'hemostasis',
    term: 'Hemostasis',
    category: 'Cardiovascular',
    definition: 'The physiological process that stops bleeding, involving vasoconstriction, platelet plug formation, and coagulation.',
    aiExplanation:
      "Hemostasis is your body's own emergency repair crew — the second a blood vessel is damaged, it constricts, patches the leak with platelets, then reinforces the patch with a mesh of clotting proteins.",
    clinicalRelevance:
      'Disorders here (hemophilia, DIC, liver failure) show up as either bleeding too easily or clotting too much — knowing the three steps tells you exactly where a bleeding disorder is breaking down.',
    relatedTermIds: ['petechial', 'jaundice'],
  },
  {
    id: 'dyspnea',
    term: 'Dyspnea',
    category: 'Respiratory',
    definition: 'The subjective sensation of difficult or uncomfortable breathing; shortness of breath.',
    aiExplanation:
      "Dyspnea is the medical word for feeling like you can't get a full, comfortable breath — it's a symptom the patient reports, not something you can see directly on an X-ray.",
    clinicalRelevance:
      "It's one of the most common ED complaints and sits at the top of a huge differential — cardiac, pulmonary, and even anxiety-driven causes all present this way, so the accompanying findings do the real narrowing.",
    relatedTermIds: ['tachypnea', 'pleuritic'],
  },
  {
    id: 'bradycardia',
    term: 'Bradycardia',
    category: 'Cardiology',
    definition: 'A resting heart rate slower than 60 beats per minute in adults.',
    aiExplanation:
      'Bradycardia just means the heart is beating unusually slowly — under 60 beats a minute in an adult — which is normal in fit athletes but can signal trouble in someone acutely unwell.',
    clinicalRelevance:
      "Reflex bradycardia paired with chest pain is a classic sign of inferior-wall MI, since the artery that's often blocked also feeds the heart's natural pacemaker.",
    relatedTermIds: ['diaphoresis', 'dyspnea'],
  },
  {
    id: 'tachypnea',
    term: 'Tachypnea',
    category: 'Respiratory',
    definition: 'Abnormally rapid breathing, typically more than 20 breaths per minute at rest in adults.',
    aiExplanation:
      "Tachypnea is simply breathing faster than normal — over about 20 breaths a minute at rest — often the body's way of blowing off extra CO2 or compensating for low oxygen.",
    clinicalRelevance:
      "It's an early, sensitive vital-sign clue — it often shows up before oxygen saturation drops, so a rising respiratory rate deserves attention even if the pulse ox still looks fine.",
    relatedTermIds: ['dyspnea', 'pleuritic'],
  },
  {
    id: 'edema',
    term: 'Edema',
    category: 'General',
    definition: 'Swelling caused by excess fluid trapped in the body’s tissues.',
    aiExplanation:
      "Edema is fluid building up where it shouldn't — under the skin, in the lungs, or around organs — because pressure or leaky vessels pushed more fluid out of the blood than the lymphatics can drain.",
    clinicalRelevance:
      'Its location is a diagnostic clue in itself: bilateral leg edema points toward heart or kidney failure, while one swollen calf raises suspicion for a DVT.',
    relatedTermIds: ['jaundice', 'dyspnea'],
  },
  {
    id: 'nystagmus',
    term: 'Nystagmus',
    category: 'Neurology',
    definition: 'Involuntary, rhythmic oscillation of the eyes, often indicating a vestibular or neurological issue.',
    aiExplanation:
      "Nystagmus is when the eyes drift and then jerk back rhythmically, almost like they're stuck trying to track something that isn't moving.",
    clinicalRelevance:
      'The direction and pattern help localize the problem to the inner ear (peripheral) versus the brainstem or cerebellum (central) — a distinction that changes how urgently it needs to be worked up.',
    relatedTermIds: ['anisocoria', 'ophthalmoplegia'],
  },
  {
    id: 'anisocoria',
    term: 'Anisocoria',
    category: 'Neurology',
    definition: 'A condition where the two pupils are unequal in size.',
    aiExplanation:
      'Anisocoria just means the two pupils are different sizes — sometimes completely normal for a person, sometimes a red flag depending on what else is going on.',
    clinicalRelevance:
      'New anisocoria with a headache or altered consciousness is a neurosurgical emergency until proven otherwise — it can be the first visible sign of rising pressure on the brain.',
    relatedTermIds: ['nystagmus', 'ophthalmoplegia'],
  },
  {
    id: 'jaundice',
    term: 'Jaundice',
    category: 'Hepatology',
    definition: 'Yellowing of the skin and eyes caused by elevated bilirubin levels in the blood.',
    aiExplanation:
      'Jaundice is the yellow tint you see in the skin and eyes when bilirubin — a byproduct of broken-down red blood cells — builds up faster than the liver can clear it.',
    clinicalRelevance:
      'Where the problem sits (before, in, or after the liver) changes the whole workup, so jaundice is almost always paired with liver enzymes and a look at urine/stool color to localize it.',
    relatedTermIds: ['hemostasis', 'edema'],
  },
  // Added so the Daily Medical Case's real narratives (features/dailycase/
  // data.ts) actually contain words this glossary can highlight — each of
  // these appears verbatim in at least one real ported case.
  {
    id: 'diaphoresis',
    term: 'Diaphoresis',
    category: 'General',
    definition: 'Excessive, often abnormal sweating, frequently associated with a physiological stress response such as a cardiac event.',
    aiExplanation:
      "Diaphoresis is just excessive sweating — but in a medical context, sweating that comes on suddenly and doesn't fit the room temperature is the finding that matters.",
    clinicalRelevance:
      "Sudden diaphoresis alongside chest pain is one of the classic warning signs of a heart attack, driven by the sympathetic 'fight or flight' surge the body triggers under real physiological stress.",
    relatedTermIds: ['bradycardia', 'tachypnea'],
  },
  {
    id: 'petechial',
    term: 'Petechial',
    category: 'Dermatology',
    definition: 'Describing petechiae — tiny, pinpoint, non-blanching red or purple spots caused by minor bleeding under the skin.',
    aiExplanation:
      "A petechial rash is made of tiny, pinpoint spots — smaller than a freckle — caused by small blood vessels leaking under the skin, and unlike most rashes, it won't fade when you press on it.",
    clinicalRelevance:
      'A petechial rash with fever is treated as a possible meningococcemia emergency until ruled out — that non-blanching detail is the single exam finding that most changes how fast a patient gets antibiotics.',
    relatedTermIds: ['hemostasis', 'xanthochromia'],
  },
  {
    id: 'crepitus',
    term: 'Crepitus',
    category: 'General',
    definition: 'A crackling or grating sensation or sound, here caused by gas trapped within soft tissue.',
    aiExplanation:
      "Crepitus is a crackling or popping feeling — sometimes you can even hear it — happening here because gas has gotten trapped somewhere it shouldn't be, under the skin.",
    clinicalRelevance:
      "Skin crepitus over a rapidly spreading, disproportionately painful area is a hallmark of necrotizing fasciitis — gas-forming bacteria in the tissue — and it means the patient needs surgery, not just antibiotics.",
    relatedTermIds: ['edema'],
  },
  {
    id: 'xanthochromia',
    term: 'Xanthochromia',
    category: 'Neurology',
    definition: 'A yellowish discoloration of cerebrospinal fluid caused by the breakdown of red blood cells, a key sign of subarachnoid hemorrhage.',
    aiExplanation:
      "Xanthochromia is a yellow tinge in spinal fluid that shows up once blood that's leaked into it has had a few hours to start breaking down.",
    clinicalRelevance:
      "It's the key finding that lets a lumbar puncture catch a subarachnoid hemorrhage that a CT scan missed — CT sensitivity drops off after about 6–12 hours, exactly when xanthochromia becomes reliable.",
    relatedTermIds: ['petechial', 'nystagmus'],
  },
  {
    id: 'ophthalmoplegia',
    term: 'Ophthalmoplegia',
    category: 'Neurology',
    definition: 'Paralysis or weakness of one or more of the muscles that control eye movement.',
    aiExplanation:
      "Ophthalmoplegia means one or more of the muscles that move the eye aren't working properly, so the eye can't fully look in every direction.",
    clinicalRelevance:
      "It's a core finding across conditions from cranial nerve palsies to botulism, where descending paralysis often affects the eye muscles before it reaches the limbs.",
    relatedTermIds: ['nystagmus', 'anisocoria'],
  },
  {
    id: 'pleuritic',
    term: 'Pleuritic',
    category: 'Respiratory',
    definition: 'Describing pain that worsens with breathing or coughing, typically from inflammation of the lining around the lungs.',
    aiExplanation:
      "Pleuritic just describes pain that gets sharply worse when you breathe in, cough, or move your chest — a clue that the irritation is coming from the lining around the lung, not the lung tissue itself.",
    clinicalRelevance:
      "It narrows a chest-pain differential fast — pulmonary embolism, pneumonia, and pneumothorax all classically cause pleuritic pain, while a squeezing, exertional pain points more toward cardiac ischemia instead.",
    relatedTermIds: ['dyspnea', 'tachypnea'],
  },
];
