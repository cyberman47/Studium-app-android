// Ported verbatim from the web app's lib/clinicalCases.ts (its 11
// built-in cases, full progressive-reveal fields) — same real content,
// same ids, not reinvented for mobile. The web file's admin-authored
// "custom cases" layer (localStorage-backed, admin-only) isn't ported;
// this app has no admin surface.
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

export const clinicalCases: ClinicalCase[] = [
  {
    id: 'inferior-mi',
    title: 'Chest Pain After Exertion',
    category: 'Cardiology',
    difficulty: 'Intermediate',
    stem: 'A 58-year-old man presents to the ED with 30 minutes of crushing substernal chest pain radiating to his left arm, associated with diaphoresis and nausea. His ECG shows ST-segment elevation in leads II, III, and aVF.',
    question: 'Which coronary artery is most likely occluded?',
    options: ['Right coronary artery', 'Left anterior descending artery', 'Circumflex artery', 'Left main artery'],
    correctIndex: 0,
    explanation:
      'ST elevation in the inferior leads (II, III, aVF) reflects an inferior wall infarction, which is supplied by the right coronary artery in roughly 80–90% of people.',
    patientIntro: 'A 58-year-old man arrives at the ED clutching his chest, visibly uncomfortable.',
    narrative: [
      "He describes 30 minutes of crushing, substernal chest pain that hasn't let up.",
      "The pain radiates down his left arm, and he's sweating and nauseated.",
      'Vitals show a heart rate of 58 bpm and blood pressure of 100/64 — mildly bradycardic for someone in this much distress.',
      'A 12-lead ECG shows ST-segment elevation in leads II, III, and aVF.',
      'Troponin I comes back elevated at 4.2 ng/mL (normal is under 0.04).',
    ],
    optionRationales: [
      'ST elevation confined to II, III, aVF localizes to the inferior wall, supplied by the RCA in ~80–90% of people—the reflex bradycardia here also fits an RCA lesion.',
      'LAD occlusion produces anterior STEMI (ST elevation in V1–V4), not this inferior lead pattern.',
      'Circumflex occlusion usually causes lateral (I, aVL, V5–V6) changes and is a less common cause of isolated inferior elevation than the RCA.',
      'Left main occlusion is typically catastrophic with diffuse ST changes and hemodynamic collapse, not an isolated inferior pattern like this.',
    ],
    keyClues: [
      'Bradycardia + relative hypotension in acute chest pain hints at inferior/RCA territory',
      'ST elevation confined to II, III, aVF localizes the infarct',
      'An elevated troponin confirms true infarction, not just ischemia',
    ],
  },
  {
    id: 'thunderclap-headache',
    title: 'The Worst Headache of Her Life',
    category: 'Neurology',
    difficulty: 'Advanced',
    stem: "A 42-year-old woman presents with the 'worst headache of her life,' sudden onset, reaching maximum intensity within seconds. She has photophobia and neck stiffness but no focal neurologic deficits. A non-contrast CT of the head is unremarkable.",
    question: 'What is the most likely diagnosis?',
    options: ['Subarachnoid hemorrhage', 'Migraine', 'Bacterial meningitis', 'Tension headache'],
    correctIndex: 0,
    explanation:
      'This is a classic subarachnoid hemorrhage presentation. CT sensitivity drops after 6–12 hours, so a lumbar puncture looking for xanthochromia is the next step when CT is negative but suspicion remains high.',
    patientIntro: 'A 42-year-old woman is brought in gripping her head, describing the worst headache of her life.',
    narrative: [
      "She describes the headache reaching maximum intensity within seconds—a true 'thunderclap' onset.",
      "She's photophobic and her neck is stiff, but there are no focal neurologic deficits on exam.",
      "Blood pressure is elevated at 162/94; she's otherwise stable.",
      'A non-contrast CT of the head shows no acute hemorrhage.',
      "Given the story, a lumbar puncture is performed: it shows xanthochromia, and the red cell count isn't decreasing between tubes 1 and 4.",
    ],
    optionRationales: [
      'Thunderclap onset plus xanthochromia on LP—after a falsely-reassuring negative CT—is classic for SAH, most often from a ruptured aneurysm.',
      "Migraines build over minutes to hours, not seconds, and don't cause xanthochromia on LP.",
      "Meningitis usually brings fever and a more gradual (though still rapid) symptom evolution, not an instantaneous thunderclap peak, and CSF would show pleocytosis/organisms rather than isolated xanthochromia.",
      "Tension headaches are gradual, bilateral, and non-thunderclap, and wouldn't warrant an LP at all.",
    ],
    keyClues: [
      '"Worst headache of life" with thunderclap onset is a red flag for SAH',
      "A negative CT doesn't rule out SAH after 6–12 hours",
      'Xanthochromia distinguishes true SAH from a traumatic tap',
    ],
  },
  {
    id: 'postpartum-pe',
    title: 'Sudden Breathlessness Postpartum',
    category: 'Pulmonology',
    difficulty: 'Intermediate',
    stem: 'A 34-year-old woman, 2 weeks postpartum, presents with sudden-onset pleuritic chest pain and shortness of breath. Heart rate is 118 bpm, and SpO2 is 91% on room air. She has unilateral calf swelling.',
    question: 'What is the most likely diagnosis?',
    options: ['Pulmonary embolism', 'Community-acquired pneumonia', 'Panic attack', 'Spontaneous pneumothorax'],
    correctIndex: 0,
    explanation:
      'The postpartum period is hypercoagulable. Pleuritic pain, tachycardia, hypoxia, and signs of a DVT (calf swelling) together point strongly to pulmonary embolism.',
    patientIntro: 'A 34-year-old woman, 2 weeks postpartum, presents with sudden shortness of breath.',
    narrative: [
      'She describes sudden-onset pleuritic chest pain that came on out of nowhere.',
      'Heart rate is 118 bpm and SpO2 is 91% on room air.',
      'One calf is visibly more swollen than the other.',
      'D-dimer comes back markedly elevated.',
      'CT pulmonary angiogram shows a filling defect in the right main pulmonary artery, and a Doppler ultrasound confirms a non-compressible right popliteal vein.',
    ],
    optionRationales: [
      'Hypoxia, tachycardia, pleuritic pain, and a DVT source in a hypercoagulable postpartum patient—confirmed by the CTPA filling defect—is classic PE.',
      'No fever or cough is described, and imaging shows a vascular filling defect rather than a consolidation.',
      "Panic attacks don't cause hypoxia, a positive D-dimer, or a demonstrable clot on imaging.",
      'Pneumothorax would show absent breath sounds and a visible pleural line on imaging, not a pulmonary artery filling defect.',
    ],
    keyClues: [
      'The postpartum state is strongly hypercoagulable',
      'Calf swelling suggests a DVT source for the embolus',
      'Pleuritic pain + hypoxia + tachycardia is the PE triad to remember',
    ],
  },
  {
    id: 'migrating-abdominal-pain',
    title: 'Migrating Abdominal Pain',
    category: 'Gastroenterology',
    difficulty: 'Beginner',
    stem: "A 21-year-old man presents with periumbilical pain that migrated to the right lower quadrant over 12 hours, along with anorexia and a low-grade fever. He has rebound tenderness at McBurney's point.",
    question: 'What is the most likely diagnosis?',
    options: ['Acute appendicitis', 'Acute pancreatitis', 'Mesenteric adenitis', 'Ovarian torsion'],
    correctIndex: 0,
    explanation:
      "Periumbilical pain migrating to the RLQ with anorexia, low-grade fever, and McBurney's point tenderness is the textbook presentation of acute appendicitis.",
    patientIntro: 'A 21-year-old man presents with worsening abdominal pain over the last 12 hours.',
    narrative: [
      'His pain started around the belly button and has migrated to the right lower quadrant over the past 12 hours.',
      "He's lost his appetite and has a low-grade fever.",
      "On exam, he has rebound tenderness at McBurney's point.",
      'White blood cell count is mildly elevated at 13,500/µL.',
      'An abdominal CT shows a dilated, non-compressible appendix with surrounding fat stranding.',
    ],
    optionRationales: [
      "The classic migratory periumbilical-to-RLQ pain with McBurney's point tenderness and confirmatory CT findings is textbook appendicitis.",
      "Pancreatitis causes epigastric pain radiating to the back, not RLQ migration, and wouldn't produce these appendix findings on CT.",
      'Mesenteric adenitis mimics appendicitis but usually follows a viral illness and lacks the classic migratory pattern and CT findings seen here.',
      'Only relevant in females—this patient is male—and would show adnexal findings, not an inflamed appendix.',
    ],
    keyClues: [
      'Migration from periumbilical to RLQ is the textbook appendicitis pattern',
      "McBurney's point tenderness plus systemic signs (anorexia, fever) support it",
      'CT confirms the diagnosis when the picture is equivocal',
    ],
  },
  {
    id: 'dka-management',
    title: 'Vomiting and Deep Breathing',
    category: 'Endocrinology',
    difficulty: 'Intermediate',
    stem: 'A 19-year-old woman with type 1 diabetes presents with 2 days of nausea, vomiting, and abdominal pain. She appears dehydrated with deep, rapid breathing. Glucose is 480 mg/dL and serum bicarbonate is 10 mEq/L.',
    question: 'What is the most likely diagnosis?',
    options: ['Diabetic ketoacidosis', 'Gastroenteritis', 'Hyperosmolar hyperglycemic state', 'Salicylate toxicity'],
    correctIndex: 0,
    explanation:
      'In DKA, fluid resuscitation comes first to restore perfusion and help correct the metabolic derangement, with insulin therapy started shortly after. Bicarbonate is reserved for severe, refractory acidosis.',
    patientIntro: 'A 19-year-old woman with type 1 diabetes presents feeling weak and unwell for 2 days.',
    narrative: [
      'She has type 1 diabetes and describes 2 days of nausea, vomiting, and abdominal pain.',
      'She appears dehydrated, breathing deep and fast.',
      'Point-of-care glucose is 480 mg/dL.',
      'A venous blood gas shows a pH of 7.18 and a serum bicarbonate of 10 mEq/L.',
      'Serum and urine ketones both come back strongly positive.',
    ],
    optionRationales: [
      'Hyperglycemia, metabolic acidosis with a low bicarbonate, Kussmaul breathing, and positive ketones together confirm DKA in a known type 1 diabetic.',
      "Gastroenteritis doesn't explain the markedly elevated glucose, acidosis, or ketosis.",
      'HHS occurs mainly in type 2 diabetes with much higher glucose and minimal ketosis/acidosis—this profile fits DKA, not HHS.',
      "Can cause a mixed acid-base picture, but wouldn't explain the hyperglycemia or positive ketones in this clinical context.",
    ],
    keyClues: [
      'Kussmaul breathing is the body compensating for metabolic acidosis',
      'Low bicarbonate + positive ketones + hyperglycemia is the DKA triad',
      'Fluids come before insulin in initial management',
    ],
  },
  {
    id: 'meningococcemia',
    title: 'Fever, Stiff Neck, and a Rash',
    category: 'Infectious Disease',
    difficulty: 'Advanced',
    stem: 'A 24-year-old college student presents with fever, severe headache, neck stiffness, and photophobia for 6 hours. He appears toxic, and a petechial rash is noted on his trunk and legs.',
    question: 'What is the most appropriate immediate action?',
    options: ['Start empiric IV antibiotics immediately', 'Wait for lumbar puncture results before treating', 'Discharge with oral antibiotics', 'Order an outpatient MRI'],
    correctIndex: 0,
    explanation:
      'This presentation is concerning for meningococcal meningitis, a life-threatening emergency. Empiric antibiotics should be started immediately and never delayed for imaging or lumbar puncture.',
    patientIntro: 'A 24-year-old college student is brought in appearing acutely ill with fever.',
    narrative: [
      "He's febrile with a severe headache, neck stiffness, and photophobia that started 6 hours ago.",
      'He looks acutely unwell, and a petechial rash is spreading across his trunk and legs.',
      'Vitals show a temperature of 39.4°C, a heart rate of 128 bpm, and a blood pressure of 88/54 — trending toward shock.',
      'Blood cultures are drawn and later grow gram-negative diplococci.',
      'A lumbar puncture shows cloudy CSF with a high neutrophil count and low glucose.',
    ],
    optionRationales: [
      'This is a sepsis emergency—empiric antibiotics must start immediately and should never be delayed for confirmatory testing when meningococcemia is suspected.',
      'Waiting for LP/culture results before treating a toxic-appearing patient with a petechial rash risks rapid deterioration and death.',
      'This presentation (toxic appearance, hypotension, petechiae) needs emergent IV treatment and monitoring, not outpatient management.',
      'An MRI does nothing to address the immediate life threat and would dangerously delay treatment.',
    ],
    keyClues: [
      'Fever + meningismus + petechial rash is a sepsis emergency',
      'Never delay antibiotics for confirmatory testing in suspected meningococcemia',
      'Trending hypotension signals impending septic shock',
    ],
  },
  {
    id: 'podagra',
    title: 'Sudden Big Toe Pain',
    category: 'Rheumatology',
    difficulty: 'Beginner',
    stem: 'A 55-year-old man presents with sudden, severe pain and swelling of his right first metatarsophalangeal joint that woke him from sleep. The joint is red, warm, and exquisitely tender. He drinks alcohol regularly.',
    question: 'Which finding on joint aspiration would confirm the diagnosis?',
    options: ['Needle-shaped, negatively birefringent crystals', 'Rhomboid, positively birefringent crystals', 'Gram-positive cocci in clusters', 'Elevated white count with no crystals'],
    correctIndex: 0,
    explanation:
      'This is classic podagra from gout. Monosodium urate crystals are needle-shaped and negatively birefringent, distinguishing gout from pseudogout (rhomboid, positively birefringent CPPD crystals).',
    patientIntro: 'A 55-year-old man wakes at night with severe pain in his big toe.',
    narrative: [
      'He wakes at night with sudden, severe pain and swelling in his right big toe.',
      'The joint is red, warm, and exquisitely tender—even the weight of a bedsheet is unbearable.',
      'He mentions he drinks alcohol regularly.',
      'Serum uric acid comes back elevated at 9.2 mg/dL.',
      'Joint aspiration under polarized microscopy shows needle-shaped, negatively birefringent crystals.',
    ],
    optionRationales: [
      'Needle-shaped, negatively birefringent crystals are monosodium urate—diagnostic of gout, which fits this classic podagra presentation.',
      'Rhomboid, positively birefringent crystals are CPPD (pseudogout), the opposite finding of what\'s seen here, and pseudogout more often affects the knee or wrist.',
      'Gram-positive cocci would suggest septic arthritis, a reasonable differential to rule out, but not what\'s found on this aspiration.',
      'A high WBC with no crystals would point away from gout, not confirm it.',
    ],
    keyClues: [
      'The first MTP joint ("podagra") is the classic gout location',
      'Needle-shaped, negatively birefringent crystals confirm gout over pseudogout',
      'Regular alcohol use is a known gout risk factor',
    ],
  },
  {
    id: 'irregularly-irregular',
    title: 'Palpitations and an Irregular Pulse',
    category: 'Cardiology',
    difficulty: 'Beginner',
    stem: 'A 67-year-old woman presents with palpitations and mild dyspnea for the past 3 hours. Her pulse is irregularly irregular at 132 bpm. ECG shows no discernible P waves with an irregular ventricular response.',
    question: 'What is the most likely diagnosis?',
    options: ['Atrial fibrillation', 'Ventricular tachycardia', 'Sinus tachycardia', 'Atrial flutter with fixed block'],
    correctIndex: 0,
    explanation: 'An irregularly irregular rhythm with absent P waves is the hallmark of atrial fibrillation.',
    patientIntro: 'A 67-year-old woman presents with palpitations and mild breathlessness.',
    narrative: [
      'She describes palpitations and mild breathlessness that started 3 hours ago.',
      'Her pulse is irregularly irregular, running around 132 bpm.',
      'A 12-lead ECG shows no discernible P waves, with an irregular ventricular response.',
      'Thyroid function tests come back normal.',
      'An echocardiogram shows a mildly dilated left atrium with no visible thrombus.',
    ],
    optionRationales: [
      'An irregularly irregular pulse with absent P waves on ECG is the hallmark of atrial fibrillation.',
      'VT typically shows wide, regular QRS complexes, not an irregularly irregular narrow-complex rhythm.',
      'Sinus tachycardia has normal P waves before every QRS and a regular rhythm, unlike what\'s described here.',
      'Flutter with a fixed block produces a regular, not irregularly irregular, ventricular rate.',
    ],
    keyClues: [
      'An irregularly irregular pulse is the key exam finding',
      'Absent P waves on ECG confirm atrial fibrillation over flutter',
      'Checking thyroid function is a standard part of the AFib workup',
    ],
  },
  {
    id: 'vasovagal-syncope',
    title: 'Fainting in a Crowded Room',
    category: 'Neurology',
    difficulty: 'Beginner',
    stem: 'A 19-year-old man faints after standing for a long time at a crowded event. He reports nausea and tunnel vision just before losing consciousness and recovered quickly afterward with no confusion. He has no cardiac history.',
    question: 'What is the most likely cause of his syncope?',
    options: ['Vasovagal syncope', 'Ventricular arrhythmia', 'Orthostatic hypotension from medication', 'Seizure'],
    correctIndex: 0,
    explanation:
      'Prolonged standing, a clear prodrome of nausea and tunnel vision, and rapid recovery without confusion are typical of vasovagal (reflex) syncope.',
    patientIntro: 'A 19-year-old man briefly loses consciousness while standing at a crowded event.',
    narrative: [
      'He briefly loses consciousness after standing for a long time at a crowded event.',
      'He remembers feeling nauseated with tunnel vision right before he went down, and recovered quickly afterward with no confusion.',
      'He has no history of heart problems.',
      'Orthostatic vitals are normal, both lying and standing.',
      'His ECG shows a normal sinus rhythm, and his bedside glucose is 92 mg/dL.',
    ],
    optionRationales: [
      'A clear prodrome (nausea, tunnel vision), a known trigger (prolonged standing/crowding), rapid recovery without confusion, and a normal cardiac workup together point to vasovagal syncope.',
      'Would be expected to show ECG abnormalities and often lacks a clear prodrome—the normal ECG argues against it.',
      'Normal orthostatic vital signs on testing make a primary blood-pressure-drop cause less likely here.',
      'Seizures typically cause post-ictal confusion and lack this clean prodrome-then-recovery pattern.',
    ],
    keyClues: [
      'Situational trigger + prodrome + fast recovery is the vasovagal pattern',
      'No post-event confusion argues against seizure',
      'A normal ECG lowers suspicion for a dangerous arrhythmia',
    ],
  },
  {
    id: 'necrotizing-fasciitis',
    title: 'Pain Out of Proportion to Exam',
    category: 'Dermatology',
    difficulty: 'Advanced',
    stem: 'A 48-year-old man with diabetes presents with a rapidly spreading, exquisitely painful red area on his leg, with pain out of proportion to the exam findings. He is febrile, and crepitus is palpable over the area.',
    question: 'What is the most likely diagnosis?',
    options: ['Necrotizing fasciitis', 'Simple cellulitis', 'Contact dermatitis', 'Deep vein thrombosis'],
    correctIndex: 0,
    explanation:
      'Pain out of proportion to exam findings plus crepitus (gas in the tissue) points to necrotizing fasciitis—a surgical emergency requiring urgent debridement.',
    patientIntro: 'A 48-year-old man with diabetes presents with a rapidly worsening leg infection.',
    narrative: [
      'He has diabetes and presents with a rapidly spreading, exquisitely painful red area on his leg.',
      'The pain is dramatically out of proportion to how the skin actually looks.',
      "He's febrile, and crepitus—a crackling sensation—is palpable over the area.",
      'A CT of the leg shows gas tracking along the fascial planes.',
      "In the OR, the fascia is grey, doesn't bleed, and has a foul odor.",
    ],
    optionRationales: [
      'Pain out of proportion to exam, crepitus, fascial gas on CT, and necrotic non-bleeding fascia intraoperatively together confirm necrotizing fasciitis—a surgical emergency.',
      "Cellulitis doesn't cause crepitus, gas on imaging, or pain this disproportionate to how mild the skin looks.",
      'A superficial, itchy rash—not a systemic, rapidly progressive, gas-forming infection like this one.',
      'DVT causes swelling and tenderness but not crepitus, fever this high, or fascial gas.',
    ],
    keyClues: [
      'Pain out of proportion to exam findings is a critical red flag',
      'Crepitus suggests gas-forming organisms in the tissue',
      'This is a surgical emergency requiring urgent debridement, not just antibiotics',
    ],
  },
  {
    id: 'foodborne-botulism',
    title: 'Descending Paralysis After a Questionable Meal',
    category: 'Infectious Disease',
    difficulty: 'Advanced',
    stem: 'A 47-year-old man presents to the ED for dyspnea and a sensation of his tongue swelling, with no swelling actually seen on exam. Treatment for presumed anaphylaxis fails, and he develops descending paralysis with absent reflexes over the following days. A neurotoxin is isolated from stool and serum.',
    question: "What's the diagnosis?",
    options: ['Foodborne botulism', 'Anaphylaxis', 'Guillain-Barré syndrome', 'Myasthenic crisis'],
    correctIndex: 0,
    explanation:
      'Descending paralysis that starts with the cranial nerves (ophthalmoplegia, muffled speech), fails to respond to anaphylaxis treatment, and progresses to areflexic respiratory failure—in someone with a history of eating improperly stored food—is classic foodborne botulism from preformed Clostridium botulinum neurotoxin, confirmed here by CDC toxin testing.',
    patientIntro: 'A 47-year-old man presents to the ED for dyspnea and a sensation of his tongue swelling.',
    narrative: [
      "Physical exam shows muffled speech and ophthalmoplegia—though no actual tongue swelling is seen.",
      'Epinephrine, diphenhydramine, and glucocorticoids are all given for presumed anaphylaxis, but none of it helps. He goes into respiratory failure and needs to be intubated.',
      'On re-examination on day 3 of admission, he has new absence of all reflexes, including his cough and gag.',
      "His mother mentions he has a habit of eating food that's been left out at room temperature for days.",
      'Stool and serum samples are sent to the CDC for testing, and a neurotoxin is isolated.',
    ],
    optionRationales: [
      'Descending paralysis starting with the cranial nerves, failure of anaphylaxis treatment, new areflexia, a food-storage risk factor, and a confirmed neurotoxin together make this classic foodborne botulism.',
      "Anaphylaxis would respond to epinephrine and antihistamines, and doesn't cause ophthalmoplegia or progressive areflexic paralysis over days.",
      'GBS also causes progressive paralysis and areflexia, but doesn\'t explain these specific early cranial nerve findings or a positive neurotoxin isolated from stool and serum.',
      "Myasthenic crisis can affect eye muscles with fluctuating weakness, but it doesn't cause absent reflexes—myasthenia classically spares reflexes—or a positive toxin test.",
    ],
    keyClues: [
      'Descending paralysis starting with the cranial nerves (ophthalmoplegia, muffled speech) is the classic botulism pattern',
      'Failure to respond to epinephrine/antihistamines/steroids argues against anaphylaxis',
      'New absent reflexes, including cough/gag, signal the paralysis progressing toward respiratory failure',
      'Improperly stored food is the classic vehicle for preformed botulinum toxin',
    ],
  },
];
