// Anatomy flashcard sections — one card per term from the "Anatomy
// Studium Checklist", originally a verbatim copy of the web app's
// lib/anatomyFlashcards.ts (studium-website). Cards that have no matching
// image anywhere have been pruned entirely rather than shown with a
// text-only fallback — every remaining card here has a real image.
//
// The "anatomy-images" Supabase Storage bucket is the actual source of
// truth for coverage, not the website: it holds 120 files across
// bones/ (96), positional/ (12), movements/ (5), basic-anatomy/ (3),
// planes/ (3), and one root file — a superset of what studium-website's
// public/images/anatomy folder has (that one only has bones/ + positional/
// + the root file). The anon Supabase key can't list bucket contents
// (no SELECT policy on storage.objects for listing — list() silently
// returns [] regardless of page size), so coverage was confirmed by
// probing known/guessed paths' public URLs directly.
//
// `imageUrl` is a "/images/anatomy/<folder>/<file>.png" path (same shape
// the web app's data uses); anatomyImageUri resolves it against the
// "anatomy-images" public Supabase Storage bucket (same project as
// src/lib/supabase.ts) rather than the deployed website, so the phone
// doesn't depend on the website's own hosting for these images.
//
// When re-syncing new terms from the web file, re-copy everything from
// `export type AnatomyFlashcard` down, then re-run the same prune (drop
// any card whose imageUrl has no matching object in the Supabase bucket)
// before shipping.

import { supabase } from '@/lib/supabase';

const ANATOMY_IMAGES_BUCKET = 'anatomy-images';

export function anatomyImageUri(imageUrl: string): string {
  const path = imageUrl.replace(/^\/images\/anatomy\//, '');
  return supabase.storage.from(ANATOMY_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
}

export type AnatomyFlashcard = {
  id: string;
  term: string;
  prompt: string;
  concept: string;
  options: string[];
  correctIndex: number;
  optionExplanations: string[];
  imageUrl?: string;
};

export type AnatomyFlashcardGroup = { id: string; title: string };

export type AnatomyFlashcardSection = {
  id: string;
  title: string;
  description: string;
  groups: AnatomyFlashcardGroup[];
  cards: AnatomyFlashcard[];
};

export const anatomyFlashcardSections: AnatomyFlashcardSection[] = [
  {
    "id": "terminology",
    "title": "Terminology",
    "description": "Directional terms, anatomical planes, joint movements, and basic tissue vocabulary used throughout the rest of anatomy.",
    "groups": [
      {
        "id": "directional-terms",
        "title": "Directional Terms"
      },
      {
        "id": "planes",
        "title": "Planes"
      },
      {
        "id": "movements",
        "title": "Movements"
      },
      {
        "id": "basic-anatomy",
        "title": "Basic Anatomy"
      }
    ],
    "cards": [
      {
        "id": "af-terminology-directional-terms-superior",
        "term": "Superior",
        "prompt": "Positioned toward the head, along the body's long axis.",
        "concept": "Directional Terms",
        "options": [
          "Inferior",
          "Superior",
          "Anterior",
          "Medial"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Superior, not the Inferior.",
          "Correct—this is the Superior.",
          "Incorrect—the structure described is the Superior, not the Anterior.",
          "Incorrect—the structure described is the Superior, not the Medial."
        ],
        "imageUrl": "/images/anatomy/positional/superior.png"
      },
      {
        "id": "af-terminology-directional-terms-inferior",
        "term": "Inferior",
        "prompt": "Positioned toward the feet, along the body's long axis.",
        "concept": "Directional Terms",
        "options": [
          "Superior",
          "Posterior",
          "Inferior",
          "Lateral"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Inferior, not the Superior.",
          "Incorrect—the structure described is the Inferior, not the Posterior.",
          "Correct—this is the Inferior.",
          "Incorrect—the structure described is the Inferior, not the Lateral."
        ],
        "imageUrl": "/images/anatomy/positional/inferior.png"
      },
      {
        "id": "af-terminology-directional-terms-anterior",
        "term": "Anterior",
        "prompt": "Positioned toward the front of the body; also called ventral.",
        "concept": "Directional Terms",
        "options": [
          "Anterior",
          "Posterior",
          "Proximal",
          "Superior"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Anterior.",
          "Incorrect—the structure described is the Anterior, not the Posterior.",
          "Incorrect—the structure described is the Anterior, not the Proximal.",
          "Incorrect—the structure described is the Anterior, not the Superior."
        ],
        "imageUrl": "/images/anatomy/positional/anterior.png"
      },
      {
        "id": "af-terminology-directional-terms-posterior",
        "term": "Posterior",
        "prompt": "Positioned toward the back of the body; also called dorsal.",
        "concept": "Directional Terms",
        "options": [
          "Anterior",
          "Distal",
          "Posterior",
          "Inferior"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Posterior, not the Anterior.",
          "Incorrect—the structure described is the Posterior, not the Distal.",
          "Correct—this is the Posterior.",
          "Incorrect—the structure described is the Posterior, not the Inferior."
        ],
        "imageUrl": "/images/anatomy/positional/posterior.png"
      },
      {
        "id": "af-terminology-directional-terms-medial",
        "term": "Medial",
        "prompt": "Positioned closer to the body's midline.",
        "concept": "Directional Terms",
        "options": [
          "Lateral",
          "Medial",
          "Superficial",
          "Anterior"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Medial, not the Lateral.",
          "Correct—this is the Medial.",
          "Incorrect—the structure described is the Medial, not the Superficial.",
          "Incorrect—the structure described is the Medial, not the Anterior."
        ],
        "imageUrl": "/images/anatomy/positional/medial.png"
      },
      {
        "id": "af-terminology-directional-terms-lateral",
        "term": "Lateral",
        "prompt": "Positioned farther from the body's midline.",
        "concept": "Directional Terms",
        "options": [
          "Medial",
          "Deep",
          "Lateral",
          "Posterior"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Lateral, not the Medial.",
          "Incorrect—the structure described is the Lateral, not the Deep.",
          "Correct—this is the Lateral.",
          "Incorrect—the structure described is the Lateral, not the Posterior."
        ],
        "imageUrl": "/images/anatomy/positional/lateral.png"
      },
      {
        "id": "af-terminology-directional-terms-proximal",
        "term": "Proximal",
        "prompt": "Positioned closer to a limb's point of attachment to the trunk.",
        "concept": "Directional Terms",
        "options": [
          "Distal",
          "Proximal",
          "Internal",
          "Medial"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Proximal, not the Distal.",
          "Correct—this is the Proximal.",
          "Incorrect—the structure described is the Proximal, not the Internal.",
          "Incorrect—the structure described is the Proximal, not the Medial."
        ],
        "imageUrl": "/images/anatomy/positional/proximal.png"
      },
      {
        "id": "af-terminology-directional-terms-distal",
        "term": "Distal",
        "prompt": "Positioned farther from a limb's point of attachment to the trunk.",
        "concept": "Directional Terms",
        "options": [
          "Proximal",
          "External",
          "Distal",
          "Lateral"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Distal, not the Proximal.",
          "Incorrect—the structure described is the Distal, not the External.",
          "Correct—this is the Distal.",
          "Incorrect—the structure described is the Distal, not the Lateral."
        ],
        "imageUrl": "/images/anatomy/positional/distal.png"
      },
      {
        "id": "af-terminology-directional-terms-internal",
        "term": "Internal",
        "prompt": "Positioned inside a body cavity or structure.",
        "concept": "Directional Terms",
        "options": [
          "External",
          "Internal",
          "Superior",
          "Proximal"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Internal, not the External.",
          "Correct—this is the Internal.",
          "Incorrect—the structure described is the Internal, not the Superior.",
          "Incorrect—the structure described is the Internal, not the Proximal."
        ],
        "imageUrl": "/images/anatomy/positional/internal.png"
      },
      {
        "id": "af-terminology-directional-terms-external",
        "term": "External",
        "prompt": "Positioned outside a body cavity or structure.",
        "concept": "Directional Terms",
        "options": [
          "Internal",
          "External",
          "Inferior",
          "Distal"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the External, not the Internal.",
          "Correct—this is the External.",
          "Incorrect—the structure described is the External, not the Inferior.",
          "Incorrect—the structure described is the External, not the Distal."
        ],
        "imageUrl": "/images/anatomy/positional/external.png"
      },
      {
        "id": "af-terminology-directional-terms-ipsilateral",
        "term": "Ipsilateral",
        "prompt": "On the same side of the body as a reference structure.",
        "concept": "Directional Terms",
        "options": [
          "Contralateral",
          "Ipsilateral",
          "Superficial",
          "Internal"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Ipsilateral, not the Contralateral.",
          "Correct—this is the Ipsilateral.",
          "Incorrect—the structure described is the Ipsilateral, not the Superficial.",
          "Incorrect—the structure described is the Ipsilateral, not the Internal."
        ],
        "imageUrl": "/images/anatomy/positional/ipsilateral.png"
      },
      {
        "id": "af-terminology-directional-terms-contralateral",
        "term": "Contralateral",
        "prompt": "On the opposite side of the body from a reference structure.",
        "concept": "Directional Terms",
        "options": [
          "Ipsilateral",
          "Deep",
          "Contralateral",
          "External"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Contralateral, not the Ipsilateral.",
          "Incorrect—the structure described is the Contralateral, not the Deep.",
          "Correct—this is the Contralateral.",
          "Incorrect—the structure described is the Contralateral, not the External."
        ],
        "imageUrl": "/images/anatomy/positional/contralateral.png"
      },
      {
        "id": "af-terminology-planes-sagittal",
        "term": "Sagittal",
        "prompt": "A vertical plane that divides the body into right and left parts.",
        "concept": "Planes",
        "options": [
          "Transverse",
          "Oblique",
          "Midsagittal",
          "Sagittal"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Sagittal, not the Transverse.",
          "Incorrect—the structure described is the Sagittal, not the Oblique.",
          "Incorrect—the structure described is the Sagittal, not the Midsagittal.",
          "Correct—this is the Sagittal."
        ],
        "imageUrl": "/images/anatomy/planes/sagittal.png"
      },
      {
        "id": "af-terminology-planes-coronal",
        "term": "Coronal",
        "prompt": "A vertical plane, also called frontal, that divides the body into anterior and posterior parts.",
        "concept": "Planes",
        "options": [
          "Sagittal",
          "Oblique",
          "Coronal",
          "Midsagittal"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Coronal, not the Sagittal.",
          "Incorrect—the structure described is the Coronal, not the Oblique.",
          "Correct—this is the Coronal.",
          "Incorrect—the structure described is the Coronal, not the Midsagittal."
        ],
        "imageUrl": "/images/anatomy/planes/coronal.png"
      },
      {
        "id": "af-terminology-planes-transverse",
        "term": "Transverse",
        "prompt": "A horizontal plane that divides the body into superior and inferior parts.",
        "concept": "Planes",
        "options": [
          "Transverse",
          "Coronal",
          "Oblique",
          "Sagittal"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Transverse.",
          "Incorrect—the structure described is the Transverse, not the Coronal.",
          "Incorrect—the structure described is the Transverse, not the Oblique.",
          "Incorrect—the structure described is the Transverse, not the Sagittal."
        ],
        "imageUrl": "/images/anatomy/planes/transverse.png"
      },
      {
        "id": "af-terminology-movements-abduction",
        "term": "Abduction",
        "prompt": "Moving a body part away from the midline of the body.",
        "concept": "Movements",
        "options": [
          "External rotation",
          "Eversion",
          "Abduction",
          "Inversion"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Abduction, not the External rotation.",
          "Incorrect—the structure described is the Abduction, not the Eversion.",
          "Correct—this is the Abduction.",
          "Incorrect—the structure described is the Abduction, not the Inversion."
        ],
        "imageUrl": "/images/anatomy/movements/abduction.png"
      },
      {
        "id": "af-terminology-movements-adduction",
        "term": "Adduction",
        "prompt": "Moving a body part toward the midline of the body.",
        "concept": "Movements",
        "options": [
          "Flexion",
          "Adduction",
          "External rotation",
          "Supination"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Adduction, not the Flexion.",
          "Correct—this is the Adduction.",
          "Incorrect—the structure described is the Adduction, not the External rotation.",
          "Incorrect—the structure described is the Adduction, not the Supination."
        ],
        "imageUrl": "/images/anatomy/movements/adduction.png"
      },
      {
        "id": "af-terminology-movements-dorsiflexion",
        "term": "Dorsiflexion",
        "prompt": "Bending the foot upward at the ankle, decreasing the angle between the foot and shin.",
        "concept": "Movements",
        "options": [
          "External rotation",
          "Abduction",
          "Inversion",
          "Dorsiflexion"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Dorsiflexion, not the External rotation.",
          "Incorrect—the structure described is the Dorsiflexion, not the Abduction.",
          "Incorrect—the structure described is the Dorsiflexion, not the Inversion.",
          "Correct—this is the Dorsiflexion."
        ],
        "imageUrl": "/images/anatomy/movements/dorsiflexion.png"
      },
      {
        "id": "af-terminology-movements-plantarflexion",
        "term": "Plantarflexion",
        "prompt": "Bending the foot downward at the ankle, pointing the toes away from the shin.",
        "concept": "Movements",
        "options": [
          "External rotation",
          "Plantarflexion",
          "Supination",
          "Pronation"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Plantarflexion, not the External rotation.",
          "Correct—this is the Plantarflexion.",
          "Incorrect—the structure described is the Plantarflexion, not the Supination.",
          "Incorrect—the structure described is the Plantarflexion, not the Pronation."
        ],
        "imageUrl": "/images/anatomy/movements/plantarflexion.png"
      },
      {
        "id": "af-terminology-movements-eversion",
        "term": "Eversion",
        "prompt": "Tilting the sole of the foot outward, away from the midline.",
        "concept": "Movements",
        "options": [
          "Abduction",
          "Opposition",
          "Plantarflexion",
          "Eversion"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Eversion, not the Abduction.",
          "Incorrect—the structure described is the Eversion, not the Opposition.",
          "Incorrect—the structure described is the Eversion, not the Plantarflexion.",
          "Correct—this is the Eversion."
        ],
        "imageUrl": "/images/anatomy/movements/eversion.png"
      },
      {
        "id": "af-terminology-basic-anatomy-ligament",
        "term": "Ligament",
        "prompt": "A band of fibrous connective tissue that connects bone to bone and stabilizes a joint.",
        "concept": "Basic Anatomy",
        "options": [
          "Tendon",
          "Joint",
          "Ligament",
          "Cartilage"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Ligament, not the Tendon.",
          "Incorrect—the structure described is the Ligament, not the Joint.",
          "Correct—this is the Ligament.",
          "Incorrect—the structure described is the Ligament, not the Cartilage."
        ],
        "imageUrl": "/images/anatomy/basic-anatomy/ligament.png"
      },
      {
        "id": "af-terminology-basic-anatomy-tendon",
        "term": "Tendon",
        "prompt": "A band of fibrous connective tissue that connects muscle to bone and transmits muscular force.",
        "concept": "Basic Anatomy",
        "options": [
          "Bone",
          "Fascia",
          "Tendon",
          "Cartilage"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Tendon, not the Bone.",
          "Incorrect—the structure described is the Tendon, not the Fascia.",
          "Correct—this is the Tendon.",
          "Incorrect—the structure described is the Tendon, not the Cartilage."
        ],
        "imageUrl": "/images/anatomy/basic-anatomy/tendon.png"
      },
      {
        "id": "af-terminology-basic-anatomy-cartilage",
        "term": "Cartilage",
        "prompt": "A flexible connective tissue that cushions joints and forms parts of the skeleton, lacking its own blood supply.",
        "concept": "Basic Anatomy",
        "options": [
          "Tendon",
          "Bone",
          "Joint",
          "Cartilage"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Cartilage, not the Tendon.",
          "Incorrect—the structure described is the Cartilage, not the Bone.",
          "Incorrect—the structure described is the Cartilage, not the Joint.",
          "Correct—this is the Cartilage."
        ],
        "imageUrl": "/images/anatomy/basic-anatomy/cartilage.png"
      }
    ]
  },
  {
    "id": "upper-limb",
    "title": "Upper Limb",
    "description": "Bones and major landmarks of the scapula, humerus, and forearm.",
    "groups": [
      {
        "id": "scapula",
        "title": "Scapula"
      },
      {
        "id": "humerus",
        "title": "Humerus"
      },
      {
        "id": "forearm",
        "title": "Forearm"
      }
    ],
    "cards": [
      {
        "id": "af-upper-limb-scapula-scapula",
        "imageUrl": "/images/anatomy/bones/scapula.png",
        "term": "Scapula",
        "prompt": "A flat, triangular bone on the posterior thorax that forms the shoulder blade and articulates with the humerus and clavicle.",
        "concept": "Scapula",
        "options": [
          "Scapula",
          "Spine (of scapula)",
          "Acromion",
          "Infraspinous fossa"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Scapula.",
          "Incorrect—the structure described is the Scapula, not the Spine (of scapula).",
          "Incorrect—the structure described is the Scapula, not the Acromion.",
          "Incorrect—the structure described is the Scapula, not the Infraspinous fossa."
        ]
      },
      {
        "id": "af-upper-limb-scapula-spine-of-scapula",
        "term": "Spine (of scapula)",
        "prompt": "A prominent ridge running across the posterior scapula, separating the supraspinous and infraspinous fossae.",
        "concept": "Scapula",
        "options": [
          "Spine (of scapula)",
          "Coracoid process",
          "Acromion",
          "Supraspinous fossa"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Spine (of scapula).",
          "Incorrect—the structure described is the Spine (of scapula), not the Coracoid process.",
          "Incorrect—the structure described is the Spine (of scapula), not the Acromion.",
          "Incorrect—the structure described is the Spine (of scapula), not the Supraspinous fossa."
        ],
        "imageUrl": "/images/anatomy/bones/scapula-spine-of-scapula.png"
      },
      {
        "id": "af-upper-limb-scapula-acromion",
        "imageUrl": "/images/anatomy/bones/scapula-acromion.png",
        "term": "Acromion",
        "prompt": "A bony projection at the lateral end of the scapular spine that forms the point of the shoulder and articulates with the clavicle.",
        "concept": "Scapula",
        "options": [
          "Spine (of scapula)",
          "Coracoid process",
          "Glenoid cavity",
          "Acromion"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Acromion, not the Spine (of scapula).",
          "Incorrect—the structure described is the Acromion, not the Coracoid process.",
          "Incorrect—the structure described is the Acromion, not the Glenoid cavity.",
          "Correct—this is the Acromion."
        ]
      },
      {
        "id": "af-upper-limb-scapula-coracoid-process",
        "imageUrl": "/images/anatomy/bones/scapula-coracoid-process.png",
        "term": "Coracoid process",
        "prompt": "A hook-like projection from the anterior scapula that serves as an attachment point for several arm muscles.",
        "concept": "Scapula",
        "options": [
          "Supraspinous fossa",
          "Glenoid cavity",
          "Acromion",
          "Coracoid process"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Coracoid process, not the Supraspinous fossa.",
          "Incorrect—the structure described is the Coracoid process, not the Glenoid cavity.",
          "Incorrect—the structure described is the Coracoid process, not the Acromion.",
          "Correct—this is the Coracoid process."
        ]
      },
      {
        "id": "af-upper-limb-scapula-glenoid-cavity",
        "imageUrl": "/images/anatomy/bones/scapula-glenoid-cavity.png",
        "term": "Glenoid cavity",
        "prompt": "A shallow socket on the lateral scapula that articulates with the head of the humerus to form the shoulder joint.",
        "concept": "Scapula",
        "options": [
          "Spine (of scapula)",
          "Glenoid cavity",
          "Coracoid process",
          "Scapula"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Glenoid cavity, not the Spine (of scapula).",
          "Correct—this is the Glenoid cavity.",
          "Incorrect—the structure described is the Glenoid cavity, not the Coracoid process.",
          "Incorrect—the structure described is the Glenoid cavity, not the Scapula."
        ]
      },
      {
        "id": "af-upper-limb-scapula-supraspinous-fossa",
        "imageUrl": "/images/anatomy/bones/scapula-the-supraspinous-fossa.png",
        "term": "Supraspinous fossa",
        "prompt": "The depression above the scapular spine that houses the supraspinatus muscle.",
        "concept": "Scapula",
        "options": [
          "Spine (of scapula)",
          "Supraspinous fossa",
          "Infraspinous fossa",
          "Scapula"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Supraspinous fossa, not the Spine (of scapula).",
          "Correct—this is the Supraspinous fossa.",
          "Incorrect—the structure described is the Supraspinous fossa, not the Infraspinous fossa.",
          "Incorrect—the structure described is the Supraspinous fossa, not the Scapula."
        ]
      },
      {
        "id": "af-upper-limb-scapula-infraspinous-fossa",
        "imageUrl": "/images/anatomy/bones/scapula-infraspinous-fossa.png",
        "term": "Infraspinous fossa",
        "prompt": "The depression below the scapular spine that houses the infraspinatus muscle.",
        "concept": "Scapula",
        "options": [
          "Infraspinous fossa",
          "Supraspinous fossa",
          "Scapula",
          "Spine (of scapula)"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Infraspinous fossa.",
          "Incorrect—the structure described is the Infraspinous fossa, not the Supraspinous fossa.",
          "Incorrect—the structure described is the Infraspinous fossa, not the Scapula.",
          "Incorrect—the structure described is the Infraspinous fossa, not the Spine (of scapula)."
        ]
      },
      {
        "id": "af-upper-limb-humerus-humerus",
        "term": "Humerus",
        "prompt": "The single long bone of the upper arm, extending from the shoulder to the elbow.",
        "concept": "Humerus",
        "options": [
          "Intertubercular groove",
          "Trochlea",
          "Greater tubercle",
          "Humerus"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Humerus, not the Intertubercular groove.",
          "Incorrect—the structure described is the Humerus, not the Trochlea.",
          "Incorrect—the structure described is the Humerus, not the Greater tubercle.",
          "Correct—this is the Humerus."
        ],
        "imageUrl": "/images/anatomy/bones/humerus.png"
      },
      {
        "id": "af-upper-limb-humerus-head-of-humerus",
        "term": "Head (of humerus)",
        "prompt": "The rounded proximal end of the humerus that articulates with the scapula's glenoid cavity.",
        "concept": "Humerus",
        "options": [
          "Medial epicondyle",
          "Head (of humerus)",
          "Intertubercular groove",
          "Capitulum"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Head (of humerus), not the Medial epicondyle.",
          "Correct—this is the Head (of humerus).",
          "Incorrect—the structure described is the Head (of humerus), not the Intertubercular groove.",
          "Incorrect—the structure described is the Head (of humerus), not the Capitulum."
        ],
        "imageUrl": "/images/anatomy/bones/humerus-head-of-humerus.png"
      },
      {
        "id": "af-upper-limb-humerus-greater-tubercle",
        "term": "Greater tubercle",
        "prompt": "A bony prominence on the lateral proximal humerus that anchors several rotator cuff muscles.",
        "concept": "Humerus",
        "options": [
          "Greater tubercle",
          "Lateral epicondyle",
          "Humerus",
          "Capitulum"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Greater tubercle.",
          "Incorrect—the structure described is the Greater tubercle, not the Lateral epicondyle.",
          "Incorrect—the structure described is the Greater tubercle, not the Humerus.",
          "Incorrect—the structure described is the Greater tubercle, not the Capitulum."
        ],
        "imageUrl": "/images/anatomy/bones/humerus-greater-tubercle.png"
      },
      {
        "id": "af-upper-limb-humerus-lesser-tubercle",
        "term": "Lesser tubercle",
        "prompt": "A bony prominence on the anterior proximal humerus that anchors the subscapularis muscle.",
        "concept": "Humerus",
        "options": [
          "Lesser tubercle",
          "Humerus",
          "Trochlea",
          "Surgical neck"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Lesser tubercle.",
          "Incorrect—the structure described is the Lesser tubercle, not the Humerus.",
          "Incorrect—the structure described is the Lesser tubercle, not the Trochlea.",
          "Incorrect—the structure described is the Lesser tubercle, not the Surgical neck."
        ],
        "imageUrl": "/images/anatomy/bones/humerus-lesser-tubercle.png"
      },
      {
        "id": "af-upper-limb-humerus-intertubercular-groove",
        "term": "Intertubercular groove",
        "prompt": "A groove between the greater and lesser tubercles of the humerus that houses the biceps brachii tendon.",
        "concept": "Humerus",
        "options": [
          "Lesser tubercle",
          "Intertubercular groove",
          "Humerus",
          "Anatomical neck"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Intertubercular groove, not the Lesser tubercle.",
          "Correct—this is the Intertubercular groove.",
          "Incorrect—the structure described is the Intertubercular groove, not the Humerus.",
          "Incorrect—the structure described is the Intertubercular groove, not the Anatomical neck."
        ],
        "imageUrl": "/images/anatomy/bones/humerus-intertubercular-groove.png"
      },
      {
        "id": "af-upper-limb-humerus-surgical-neck",
        "term": "Surgical neck",
        "prompt": "The narrowed region of the humerus just below the tubercles, a common site of fracture.",
        "concept": "Humerus",
        "options": [
          "Surgical neck",
          "Capitulum",
          "Greater tubercle",
          "Anatomical neck"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Surgical neck.",
          "Incorrect—the structure described is the Surgical neck, not the Capitulum.",
          "Incorrect—the structure described is the Surgical neck, not the Greater tubercle.",
          "Incorrect—the structure described is the Surgical neck, not the Anatomical neck."
        ],
        "imageUrl": "/images/anatomy/bones/humerus-surgical-neck.png"
      },
      {
        "id": "af-upper-limb-humerus-anatomical-neck",
        "term": "Anatomical neck",
        "prompt": "The slight constriction of the humerus just below the head, marking the former growth plate.",
        "concept": "Humerus",
        "options": [
          "Anatomical neck",
          "Trochlea",
          "Greater tubercle",
          "Humerus"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Anatomical neck.",
          "Incorrect—the structure described is the Anatomical neck, not the Trochlea.",
          "Incorrect—the structure described is the Anatomical neck, not the Greater tubercle.",
          "Incorrect—the structure described is the Anatomical neck, not the Humerus."
        ],
        "imageUrl": "/images/anatomy/bones/humerus-anatomical-neck.png"
      },
      {
        "id": "af-upper-limb-humerus-capitulum",
        "term": "Capitulum",
        "prompt": "The rounded lateral portion of the distal humerus that articulates with the radius.",
        "concept": "Humerus",
        "options": [
          "Capitulum",
          "Lateral epicondyle",
          "Greater tubercle",
          "Medial epicondyle"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Capitulum.",
          "Incorrect—the structure described is the Capitulum, not the Lateral epicondyle.",
          "Incorrect—the structure described is the Capitulum, not the Greater tubercle.",
          "Incorrect—the structure described is the Capitulum, not the Medial epicondyle."
        ],
        "imageUrl": "/images/anatomy/bones/humerus-capitulum.png"
      },
      {
        "id": "af-upper-limb-humerus-trochlea",
        "term": "Trochlea",
        "prompt": "The pulley-shaped medial portion of the distal humerus that articulates with the ulna.",
        "concept": "Humerus",
        "options": [
          "Surgical neck",
          "Trochlea",
          "Head (of humerus)",
          "Greater tubercle"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Trochlea, not the Surgical neck.",
          "Correct—this is the Trochlea.",
          "Incorrect—the structure described is the Trochlea, not the Head (of humerus).",
          "Incorrect—the structure described is the Trochlea, not the Greater tubercle."
        ],
        "imageUrl": "/images/anatomy/bones/humerus-trochlea.png"
      },
      {
        "id": "af-upper-limb-humerus-medial-epicondyle",
        "term": "Medial epicondyle",
        "prompt": "A bony projection on the medial side of the distal humerus that anchors the forearm flexor muscles.",
        "concept": "Humerus",
        "options": [
          "Head (of humerus)",
          "Medial epicondyle",
          "Trochlea",
          "Lateral epicondyle"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Medial epicondyle, not the Head (of humerus).",
          "Correct—this is the Medial epicondyle.",
          "Incorrect—the structure described is the Medial epicondyle, not the Trochlea.",
          "Incorrect—the structure described is the Medial epicondyle, not the Lateral epicondyle."
        ],
        "imageUrl": "/images/anatomy/bones/humerus-medial-epicondyle.png"
      },
      {
        "id": "af-upper-limb-humerus-lateral-epicondyle",
        "term": "Lateral epicondyle",
        "prompt": "A bony projection on the lateral side of the distal humerus that anchors the forearm extensor muscles.",
        "concept": "Humerus",
        "options": [
          "Anatomical neck",
          "Lesser tubercle",
          "Lateral epicondyle",
          "Trochlea"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Lateral epicondyle, not the Anatomical neck.",
          "Incorrect—the structure described is the Lateral epicondyle, not the Lesser tubercle.",
          "Correct—this is the Lateral epicondyle.",
          "Incorrect—the structure described is the Lateral epicondyle, not the Trochlea."
        ],
        "imageUrl": "/images/anatomy/bones/humerus-lateral-epicondyle.png"
      },
      {
        "id": "af-upper-limb-forearm-radius",
        "term": "Radius",
        "prompt": "The lateral forearm bone that rotates around the ulna during pronation and supination.",
        "concept": "Forearm",
        "options": [
          "Olecranon",
          "Ulna",
          "Coronoid process",
          "Radius"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Radius, not the Olecranon.",
          "Incorrect—the structure described is the Radius, not the Ulna.",
          "Incorrect—the structure described is the Radius, not the Coronoid process.",
          "Correct—this is the Radius."
        ],
        "imageUrl": "/images/anatomy/bones/radius.png"
      },
      {
        "id": "af-upper-limb-forearm-ulna",
        "term": "Ulna",
        "prompt": "The medial forearm bone that forms the main hinge joint with the humerus at the elbow.",
        "concept": "Forearm",
        "options": [
          "Radius",
          "Coronoid process",
          "Olecranon",
          "Ulna"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Ulna, not the Radius.",
          "Incorrect—the structure described is the Ulna, not the Coronoid process.",
          "Incorrect—the structure described is the Ulna, not the Olecranon.",
          "Correct—this is the Ulna."
        ],
        "imageUrl": "/images/anatomy/bones/ulna.png"
      },
      {
        "id": "af-upper-limb-forearm-radial-head",
        "term": "Radial head",
        "prompt": "The disc-shaped proximal end of the radius that articulates with the capitulum of the humerus.",
        "concept": "Forearm",
        "options": [
          "Styloid processes",
          "Coronoid process",
          "Radial head",
          "Ulna"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Radial head, not the Styloid processes.",
          "Incorrect—the structure described is the Radial head, not the Coronoid process.",
          "Correct—this is the Radial head.",
          "Incorrect—the structure described is the Radial head, not the Ulna."
        ],
        "imageUrl": "/images/anatomy/bones/radius-radial-head.png"
      },
      {
        "id": "af-upper-limb-forearm-radial-tuberosity",
        "term": "Radial tuberosity",
        "prompt": "A bony projection on the proximal radius where the biceps brachii tendon attaches.",
        "concept": "Forearm",
        "options": [
          "Coronoid process",
          "Radial tuberosity",
          "Styloid processes",
          "Olecranon"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Radial tuberosity, not the Coronoid process.",
          "Correct—this is the Radial tuberosity.",
          "Incorrect—the structure described is the Radial tuberosity, not the Styloid processes.",
          "Incorrect—the structure described is the Radial tuberosity, not the Olecranon."
        ],
        "imageUrl": "/images/anatomy/bones/radius-radial-tuberosity.png"
      },
      {
        "id": "af-upper-limb-forearm-coronoid-process",
        "term": "Coronoid process",
        "prompt": "A projection on the proximal ulna that helps form the elbow joint and prevents overextension.",
        "concept": "Forearm",
        "options": [
          "Radius",
          "Coronoid process",
          "Ulna",
          "Olecranon"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Coronoid process, not the Radius.",
          "Correct—this is the Coronoid process.",
          "Incorrect—the structure described is the Coronoid process, not the Ulna.",
          "Incorrect—the structure described is the Coronoid process, not the Olecranon."
        ],
        "imageUrl": "/images/anatomy/bones/ulna-coronoid-process.png"
      }
    ]
  },
  {
    "id": "lower-limb",
    "title": "Lower Limb",
    "description": "Bones and major landmarks of the pelvic girdle, femur, leg, and foot.",
    "groups": [
      {
        "id": "pelvic-bones",
        "title": "Pelvic Bones"
      },
      {
        "id": "femur",
        "title": "Femur"
      },
      {
        "id": "leg",
        "title": "Leg"
      },
      {
        "id": "foot",
        "title": "Foot"
      }
    ],
    "cards": [
      {
        "id": "af-lower-limb-pelvic-bones-hip-bone",
        "imageUrl": "/images/anatomy/bones/pelvic.png",
        "term": "Hip bone",
        "prompt": "The large, irregular bone formed by fusion of the ilium, ischium, and pubis, forming the lateral pelvis.",
        "concept": "Pelvic Bones",
        "options": [
          "Ilium",
          "Obturator foramen",
          "Pubis",
          "Hip bone"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Hip bone, not the Ilium.",
          "Incorrect—the structure described is the Hip bone, not the Obturator foramen.",
          "Incorrect—the structure described is the Hip bone, not the Pubis.",
          "Correct—this is the Hip bone."
        ]
      },
      {
        "id": "af-lower-limb-pelvic-bones-ilium",
        "imageUrl": "/images/anatomy/bones/pelvic-ilium.png",
        "term": "Ilium",
        "prompt": "The largest and most superior of the three bones that fuse to form the hip bone.",
        "concept": "Pelvic Bones",
        "options": [
          "Acetabulum",
          "Ischium",
          "Pubis",
          "Ilium"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Ilium, not the Acetabulum.",
          "Incorrect—the structure described is the Ilium, not the Ischium.",
          "Incorrect—the structure described is the Ilium, not the Pubis.",
          "Correct—this is the Ilium."
        ]
      },
      {
        "id": "af-lower-limb-pelvic-bones-ischium",
        "imageUrl": "/images/anatomy/bones/pelvic-ischium.png",
        "term": "Ischium",
        "prompt": "The posteroinferior bone of the hip bone; its tuberosity bears weight when sitting.",
        "concept": "Pelvic Bones",
        "options": [
          "Obturator foramen",
          "Ischium",
          "Ilium",
          "Acetabulum"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Ischium, not the Obturator foramen.",
          "Correct—this is the Ischium.",
          "Incorrect—the structure described is the Ischium, not the Ilium.",
          "Incorrect—the structure described is the Ischium, not the Acetabulum."
        ]
      },
      {
        "id": "af-lower-limb-pelvic-bones-pubis",
        "term": "Pubis",
        "prompt": "The anteromedial bone of the hip bone that meets its counterpart at the pubic symphysis.",
        "concept": "Pelvic Bones",
        "options": [
          "Obturator foramen",
          "Hip bone",
          "Pubis",
          "Ilium"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Pubis, not the Obturator foramen.",
          "Incorrect—the structure described is the Pubis, not the Hip bone.",
          "Correct—this is the Pubis.",
          "Incorrect—the structure described is the Pubis, not the Ilium."
        ],
        "imageUrl": "/images/anatomy/bones/pelvic-pubis.png"
      },
      {
        "id": "af-lower-limb-pelvic-bones-acetabulum",
        "imageUrl": "/images/anatomy/bones/pelvic-acetabulum.png",
        "term": "Acetabulum",
        "prompt": "The cup-shaped socket on the hip bone that articulates with the head of the femur.",
        "concept": "Pelvic Bones",
        "options": [
          "Obturator foramen",
          "Acetabulum",
          "Ischium",
          "Ilium"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Acetabulum, not the Obturator foramen.",
          "Correct—this is the Acetabulum.",
          "Incorrect—the structure described is the Acetabulum, not the Ischium.",
          "Incorrect—the structure described is the Acetabulum, not the Ilium."
        ]
      },
      {
        "id": "af-lower-limb-pelvic-bones-obturator-foramen",
        "imageUrl": "/images/anatomy/bones/pelvic-obturator-foramen.png",
        "term": "Obturator foramen",
        "prompt": "The large opening in the hip bone, bounded by the ischium and pubis, mostly covered by the obturator membrane.",
        "concept": "Pelvic Bones",
        "options": [
          "Pubis",
          "Hip bone",
          "Obturator foramen",
          "Acetabulum"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Obturator foramen, not the Pubis.",
          "Incorrect—the structure described is the Obturator foramen, not the Hip bone.",
          "Correct—this is the Obturator foramen.",
          "Incorrect—the structure described is the Obturator foramen, not the Acetabulum."
        ]
      },
      {
        "id": "af-lower-limb-femur-femur",
        "imageUrl": "/images/anatomy/bones/femur.png",
        "term": "Femur",
        "prompt": "The single long bone of the thigh, the longest and strongest bone in the body.",
        "concept": "Femur",
        "options": [
          "Greater trochanter",
          "Medial condyle",
          "Linea aspera",
          "Femur"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Femur, not the Greater trochanter.",
          "Incorrect—the structure described is the Femur, not the Medial condyle.",
          "Incorrect—the structure described is the Femur, not the Linea aspera.",
          "Correct—this is the Femur."
        ]
      },
      {
        "id": "af-lower-limb-femur-head-of-femur",
        "imageUrl": "/images/anatomy/bones/femur-head.png",
        "term": "Head (of femur)",
        "prompt": "The rounded proximal end of the femur that articulates with the acetabulum.",
        "concept": "Femur",
        "options": [
          "Neck (of femur)",
          "Head (of femur)",
          "Medial condyle",
          "Lesser trochanter"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Head (of femur), not the Neck (of femur).",
          "Correct—this is the Head (of femur).",
          "Incorrect—the structure described is the Head (of femur), not the Medial condyle.",
          "Incorrect—the structure described is the Head (of femur), not the Lesser trochanter."
        ]
      },
      {
        "id": "af-lower-limb-femur-neck-of-femur",
        "imageUrl": "/images/anatomy/bones/femur-neck.png",
        "term": "Neck (of femur)",
        "prompt": "The region connecting the femoral head to the shaft, a common site of hip fracture.",
        "concept": "Femur",
        "options": [
          "Femur",
          "Medial condyle",
          "Neck (of femur)",
          "Greater trochanter"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Neck (of femur), not the Femur.",
          "Incorrect—the structure described is the Neck (of femur), not the Medial condyle.",
          "Correct—this is the Neck (of femur).",
          "Incorrect—the structure described is the Neck (of femur), not the Greater trochanter."
        ]
      },
      {
        "id": "af-lower-limb-femur-greater-trochanter",
        "imageUrl": "/images/anatomy/bones/femur-the-greater-trochanter-bursa.png",
        "term": "Greater trochanter",
        "prompt": "A large bony prominence on the lateral proximal femur that anchors several hip muscles.",
        "concept": "Femur",
        "options": [
          "Neck (of femur)",
          "Lesser trochanter",
          "Greater trochanter",
          "Femur"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Greater trochanter, not the Neck (of femur).",
          "Incorrect—the structure described is the Greater trochanter, not the Lesser trochanter.",
          "Correct—this is the Greater trochanter.",
          "Incorrect—the structure described is the Greater trochanter, not the Femur."
        ]
      },
      {
        "id": "af-lower-limb-femur-lesser-trochanter",
        "imageUrl": "/images/anatomy/bones/femur-the-lesser-trochanter-bursa.png",
        "term": "Lesser trochanter",
        "prompt": "A smaller bony prominence on the posteromedial proximal femur where the iliopsoas attaches.",
        "concept": "Femur",
        "options": [
          "Neck (of femur)",
          "Lesser trochanter",
          "Head (of femur)",
          "Linea aspera"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Lesser trochanter, not the Neck (of femur).",
          "Correct—this is the Lesser trochanter.",
          "Incorrect—the structure described is the Lesser trochanter, not the Head (of femur).",
          "Incorrect—the structure described is the Lesser trochanter, not the Linea aspera."
        ]
      },
      {
        "id": "af-lower-limb-femur-linea-aspera",
        "imageUrl": "/images/anatomy/bones/femur-linea-aspera.png",
        "term": "Linea aspera",
        "prompt": "A rough ridge running along the posterior shaft of the femur that anchors thigh muscles.",
        "concept": "Femur",
        "options": [
          "Greater trochanter",
          "Neck (of femur)",
          "Linea aspera",
          "Medial condyle"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Linea aspera, not the Greater trochanter.",
          "Incorrect—the structure described is the Linea aspera, not the Neck (of femur).",
          "Correct—this is the Linea aspera.",
          "Incorrect—the structure described is the Linea aspera, not the Medial condyle."
        ]
      },
      {
        "id": "af-lower-limb-femur-medial-condyle",
        "imageUrl": "/images/anatomy/bones/femur-the-medial-condyle.png",
        "term": "Medial condyle",
        "prompt": "The rounded medial projection at the distal femur that articulates with the tibia.",
        "concept": "Femur",
        "options": [
          "Lesser trochanter",
          "Medial condyle",
          "Femur",
          "Greater trochanter"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Medial condyle, not the Lesser trochanter.",
          "Correct—this is the Medial condyle.",
          "Incorrect—the structure described is the Medial condyle, not the Femur.",
          "Incorrect—the structure described is the Medial condyle, not the Greater trochanter."
        ]
      },
      {
        "id": "af-lower-limb-femur-lateral-condyle",
        "imageUrl": "/images/anatomy/bones/femur-lateral-condyle.png",
        "term": "Lateral condyle",
        "prompt": "The rounded lateral projection at the distal femur that articulates with the tibia.",
        "concept": "Femur",
        "options": [
          "Linea aspera",
          "Greater trochanter",
          "Neck (of femur)",
          "Lateral condyle"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Lateral condyle, not the Linea aspera.",
          "Incorrect—the structure described is the Lateral condyle, not the Greater trochanter.",
          "Incorrect—the structure described is the Lateral condyle, not the Neck (of femur).",
          "Correct—this is the Lateral condyle."
        ]
      },
      {
        "id": "af-lower-limb-leg-tibia",
        "imageUrl": "/images/anatomy/bones/tibia.png",
        "term": "Tibia",
        "prompt": "The larger, medial bone of the leg that bears most of the body's weight.",
        "concept": "Leg",
        "options": [
          "Fibular head",
          "Fibula",
          "Tibia",
          "Tibial tuberosity"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Tibia, not the Fibular head.",
          "Incorrect—the structure described is the Tibia, not the Fibula.",
          "Correct—this is the Tibia.",
          "Incorrect—the structure described is the Tibia, not the Tibial tuberosity."
        ]
      },
      {
        "id": "af-lower-limb-leg-tibial-tuberosity",
        "imageUrl": "/images/anatomy/bones/tibia-tibial-tuberosity.png",
        "term": "Tibial tuberosity",
        "prompt": "A bony prominence on the proximal anterior tibia where the patellar ligament attaches.",
        "concept": "Leg",
        "options": [
          "Fibular head",
          "Tibial tuberosity",
          "Fibula",
          "Medial malleolus"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Tibial tuberosity, not the Fibular head.",
          "Correct—this is the Tibial tuberosity.",
          "Incorrect—the structure described is the Tibial tuberosity, not the Fibula.",
          "Incorrect—the structure described is the Tibial tuberosity, not the Medial malleolus."
        ]
      },
      {
        "id": "af-lower-limb-leg-medial-malleolus",
        "imageUrl": "/images/anatomy/bones/tibia-medial-malleolus.png",
        "term": "Medial malleolus",
        "prompt": "The bony prominence on the distal medial tibia that forms the inner ankle bump.",
        "concept": "Leg",
        "options": [
          "Tibia",
          "Tibial tuberosity",
          "Medial malleolus",
          "Fibula"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Medial malleolus, not the Tibia.",
          "Incorrect—the structure described is the Medial malleolus, not the Tibial tuberosity.",
          "Correct—this is the Medial malleolus.",
          "Incorrect—the structure described is the Medial malleolus, not the Fibula."
        ]
      },
      {
        "id": "af-lower-limb-leg-fibula",
        "imageUrl": "/images/anatomy/bones/fibula.png",
        "term": "Fibula",
        "prompt": "The slender, lateral bone of the leg that provides muscle attachment but bears little weight.",
        "concept": "Leg",
        "options": [
          "Fibula",
          "Tibial tuberosity",
          "Lateral malleolus",
          "Medial malleolus"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Fibula.",
          "Incorrect—the structure described is the Fibula, not the Tibial tuberosity.",
          "Incorrect—the structure described is the Fibula, not the Lateral malleolus.",
          "Incorrect—the structure described is the Fibula, not the Medial malleolus."
        ]
      },
      {
        "id": "af-lower-limb-leg-fibular-head",
        "imageUrl": "/images/anatomy/bones/fibula-fibular-head.png",
        "term": "Fibular head",
        "prompt": "The proximal end of the fibula that articulates with the lateral tibia below the knee.",
        "concept": "Leg",
        "options": [
          "Medial malleolus",
          "Tibia",
          "Fibula",
          "Fibular head"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Fibular head, not the Medial malleolus.",
          "Incorrect—the structure described is the Fibular head, not the Tibia.",
          "Incorrect—the structure described is the Fibular head, not the Fibula.",
          "Correct—this is the Fibular head."
        ]
      },
      {
        "id": "af-lower-limb-leg-lateral-malleolus",
        "imageUrl": "/images/anatomy/bones/fibula-lateral-malleolus.png",
        "term": "Lateral malleolus",
        "prompt": "The bony prominence at the distal end of the fibula that forms the outer ankle bump.",
        "concept": "Leg",
        "options": [
          "Lateral malleolus",
          "Tibial tuberosity",
          "Medial malleolus",
          "Fibular head"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Lateral malleolus.",
          "Incorrect—the structure described is the Lateral malleolus, not the Tibial tuberosity.",
          "Incorrect—the structure described is the Lateral malleolus, not the Medial malleolus.",
          "Incorrect—the structure described is the Lateral malleolus, not the Fibular head."
        ]
      },
      {
        "id": "af-lower-limb-foot-talus",
        "imageUrl": "/images/anatomy/bones/foot-talus.png",
        "term": "Talus",
        "prompt": "The tarsal bone that articulates with the tibia and fibula to form the ankle joint.",
        "concept": "Foot",
        "options": [
          "Calcaneus",
          "Talus",
          "Phalanges (foot)",
          "Cuneiforms"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Talus, not the Calcaneus.",
          "Correct—this is the Talus.",
          "Incorrect—the structure described is the Talus, not the Phalanges (foot).",
          "Incorrect—the structure described is the Talus, not the Cuneiforms."
        ]
      },
      {
        "id": "af-lower-limb-foot-calcaneus",
        "imageUrl": "/images/anatomy/bones/foot-calcaneus.png",
        "term": "Calcaneus",
        "prompt": "The largest tarsal bone, forming the heel and providing attachment for the Achilles tendon.",
        "concept": "Foot",
        "options": [
          "Talus",
          "Navicular",
          "Cuboid",
          "Calcaneus"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Calcaneus, not the Talus.",
          "Incorrect—the structure described is the Calcaneus, not the Navicular.",
          "Incorrect—the structure described is the Calcaneus, not the Cuboid.",
          "Correct—this is the Calcaneus."
        ]
      },
      {
        "id": "af-lower-limb-foot-navicular",
        "imageUrl": "/images/anatomy/bones/foot-navicular.png",
        "term": "Navicular",
        "prompt": "A boat-shaped tarsal bone on the medial midfoot, between the talus and cuneiforms.",
        "concept": "Foot",
        "options": [
          "Cuboid",
          "Phalanges (foot)",
          "Navicular",
          "Metatarsals"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Navicular, not the Cuboid.",
          "Incorrect—the structure described is the Navicular, not the Phalanges (foot).",
          "Correct—this is the Navicular.",
          "Incorrect—the structure described is the Navicular, not the Metatarsals."
        ]
      },
      {
        "id": "af-lower-limb-foot-cuboid",
        "imageUrl": "/images/anatomy/bones/foot-cuboid.png",
        "term": "Cuboid",
        "prompt": "A tarsal bone on the lateral midfoot, between the calcaneus and the lateral metatarsals.",
        "concept": "Foot",
        "options": [
          "Navicular",
          "Calcaneus",
          "Talus",
          "Cuboid"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Cuboid, not the Navicular.",
          "Incorrect—the structure described is the Cuboid, not the Calcaneus.",
          "Incorrect—the structure described is the Cuboid, not the Talus.",
          "Correct—this is the Cuboid."
        ]
      },
      {
        "id": "af-lower-limb-foot-cuneiforms",
        "imageUrl": "/images/anatomy/bones/foot-cuneiforms.png",
        "term": "Cuneiforms",
        "prompt": "Three wedge-shaped tarsal bones on the medial midfoot that articulate with the first three metatarsals.",
        "concept": "Foot",
        "options": [
          "Talus",
          "Phalanges (foot)",
          "Cuboid",
          "Cuneiforms"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Cuneiforms, not the Talus.",
          "Incorrect—the structure described is the Cuneiforms, not the Phalanges (foot).",
          "Incorrect—the structure described is the Cuneiforms, not the Cuboid.",
          "Correct—this is the Cuneiforms."
        ]
      },
      {
        "id": "af-lower-limb-foot-metatarsals",
        "imageUrl": "/images/anatomy/bones/foot-metatarsals.png",
        "term": "Metatarsals",
        "prompt": "The five long bones of the midfoot, connecting the tarsals to the phalanges of the toes.",
        "concept": "Foot",
        "options": [
          "Talus",
          "Calcaneus",
          "Cuneiforms",
          "Metatarsals"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Metatarsals, not the Talus.",
          "Incorrect—the structure described is the Metatarsals, not the Calcaneus.",
          "Incorrect—the structure described is the Metatarsals, not the Cuneiforms.",
          "Correct—this is the Metatarsals."
        ]
      },
      {
        "id": "af-lower-limb-foot-phalanges-foot",
        "imageUrl": "/images/anatomy/bones/foot-phalanges.png",
        "term": "Phalanges (foot)",
        "prompt": "The bones of the toes, with two in the big toe and three in each other toe.",
        "concept": "Foot",
        "options": [
          "Phalanges (foot)",
          "Cuneiforms",
          "Calcaneus",
          "Talus"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Phalanges (foot).",
          "Incorrect—the structure described is the Phalanges (foot), not the Cuneiforms.",
          "Incorrect—the structure described is the Phalanges (foot), not the Calcaneus.",
          "Incorrect—the structure described is the Phalanges (foot), not the Talus."
        ]
      }
    ]
  },
  {
    "id": "spine-back",
    "title": "Spine & Back",
    "description": "The vertebral column, vertebral anatomy, intervertebral structures, and sacral landmarks.",
    "groups": [
      {
        "id": "vertebral-column",
        "title": "Vertebral Column"
      },
      {
        "id": "vertebra-anatomy",
        "title": "Vertebra Anatomy"
      },
      {
        "id": "intervertebral-structures",
        "title": "Intervertebral Structures"
      },
      {
        "id": "sacral-features",
        "title": "Sacral Features"
      }
    ],
    "cards": [
      {
        "id": "af-spine-back-vertebral-column-cervical-vertebra",
        "imageUrl": "/images/anatomy/bones/spine-cervical-vertabre.png",
        "term": "Cervical vertebra",
        "prompt": "One of seven neck vertebrae (C1–C7), the smallest and most mobile of the vertebral column.",
        "concept": "Vertebral Column",
        "options": [
          "Coccyx",
          "Atlas (C1)",
          "Cervical vertebra",
          "Sacrum"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Cervical vertebra, not the Coccyx.",
          "Incorrect—the structure described is the Cervical vertebra, not the Atlas (C1).",
          "Correct—this is the Cervical vertebra.",
          "Incorrect—the structure described is the Cervical vertebra, not the Sacrum."
        ]
      },
      {
        "id": "af-spine-back-vertebral-column-thoracic-vertebra",
        "imageUrl": "/images/anatomy/bones/spine-thoracic-vertabre.png",
        "term": "Thoracic vertebra",
        "prompt": "One of twelve mid-back vertebrae (T1–T12) that articulate with the ribs.",
        "concept": "Vertebral Column",
        "options": [
          "Atlas (C1)",
          "Lumbar vertebra",
          "Thoracic vertebra",
          "Coccyx"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Thoracic vertebra, not the Atlas (C1).",
          "Incorrect—the structure described is the Thoracic vertebra, not the Lumbar vertebra.",
          "Correct—this is the Thoracic vertebra.",
          "Incorrect—the structure described is the Thoracic vertebra, not the Coccyx."
        ]
      },
      {
        "id": "af-spine-back-vertebral-column-lumbar-vertebra",
        "imageUrl": "/images/anatomy/bones/spine-lumbar-vertabre.png",
        "term": "Lumbar vertebra",
        "prompt": "One of five lower-back vertebrae (L1–L5), the largest, supporting most of the body's weight.",
        "concept": "Vertebral Column",
        "options": [
          "Lumbar vertebra",
          "Cervical vertebra",
          "Sacrum",
          "Thoracic vertebra"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Lumbar vertebra.",
          "Incorrect—the structure described is the Lumbar vertebra, not the Cervical vertebra.",
          "Incorrect—the structure described is the Lumbar vertebra, not the Sacrum.",
          "Incorrect—the structure described is the Lumbar vertebra, not the Thoracic vertebra."
        ]
      },
      {
        "id": "af-spine-back-vertebral-column-sacrum",
        "imageUrl": "/images/anatomy/bones/spine-sacrum.png",
        "term": "Sacrum",
        "prompt": "A triangular bone formed by five fused sacral vertebrae, connecting the spine to the pelvis.",
        "concept": "Vertebral Column",
        "options": [
          "Thoracic vertebra",
          "Sacrum",
          "Cervical vertebra",
          "Axis (C2)"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Sacrum, not the Thoracic vertebra.",
          "Correct—this is the Sacrum.",
          "Incorrect—the structure described is the Sacrum, not the Cervical vertebra.",
          "Incorrect—the structure described is the Sacrum, not the Axis (C2)."
        ]
      },
      {
        "id": "af-spine-back-vertebral-column-coccyx",
        "imageUrl": "/images/anatomy/bones/spine-coccyx.png",
        "term": "Coccyx",
        "prompt": "The small bone at the base of the spine formed by three to five fused vertebral segments, commonly called the tailbone.",
        "concept": "Vertebral Column",
        "options": [
          "Coccyx",
          "Atlas (C1)",
          "Thoracic vertebra",
          "Sacrum"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Coccyx.",
          "Incorrect—the structure described is the Coccyx, not the Atlas (C1).",
          "Incorrect—the structure described is the Coccyx, not the Thoracic vertebra.",
          "Incorrect—the structure described is the Coccyx, not the Sacrum."
        ]
      },
      {
        "id": "af-spine-back-vertebral-column-atlas-c1",
        "imageUrl": "/images/anatomy/bones/spine-atlas-c1.png",
        "term": "Atlas (C1)",
        "prompt": "The first cervical vertebra, which supports the skull and lacks a vertebral body.",
        "concept": "Vertebral Column",
        "options": [
          "Sacrum",
          "Thoracic vertebra",
          "Atlas (C1)",
          "Coccyx"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Atlas (C1), not the Sacrum.",
          "Incorrect—the structure described is the Atlas (C1), not the Thoracic vertebra.",
          "Correct—this is the Atlas (C1).",
          "Incorrect—the structure described is the Atlas (C1), not the Coccyx."
        ]
      },
      {
        "id": "af-spine-back-vertebral-column-axis-c2",
        "imageUrl": "/images/anatomy/bones/spine-axis-c2.png",
        "term": "Axis (C2)",
        "prompt": "The second cervical vertebra, whose odontoid process (dens) allows the atlas and skull to rotate.",
        "concept": "Vertebral Column",
        "options": [
          "Axis (C2)",
          "Atlas (C1)",
          "Cervical vertebra",
          "Sacrum"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Axis (C2).",
          "Incorrect—the structure described is the Axis (C2), not the Atlas (C1).",
          "Incorrect—the structure described is the Axis (C2), not the Cervical vertebra.",
          "Incorrect—the structure described is the Axis (C2), not the Sacrum."
        ]
      },
      {
        "id": "af-spine-back-vertebra-anatomy-vertebral-body",
        "imageUrl": "/images/anatomy/bones/lumbar-vertabral-disk-body.png",
        "term": "Vertebral body",
        "prompt": "The thick, weight-bearing anterior portion of a vertebra.",
        "concept": "Vertebra Anatomy",
        "options": [
          "Transverse process",
          "Spinous process",
          "Vertebral foramen",
          "Vertebral body"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Vertebral body, not the Transverse process.",
          "Incorrect—the structure described is the Vertebral body, not the Spinous process.",
          "Incorrect—the structure described is the Vertebral body, not the Vertebral foramen.",
          "Correct—this is the Vertebral body."
        ]
      },
      {
        "id": "af-spine-back-vertebra-anatomy-vertebral-foramen",
        "imageUrl": "/images/anatomy/bones/lumbar-vertebral-disk-foramen.png",
        "term": "Vertebral foramen",
        "prompt": "The opening in a vertebra through which the spinal cord passes.",
        "concept": "Vertebra Anatomy",
        "options": [
          "Inferior articular process",
          "Superior articular process",
          "Vertebral body",
          "Vertebral foramen"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Vertebral foramen, not the Inferior articular process.",
          "Incorrect—the structure described is the Vertebral foramen, not the Superior articular process.",
          "Incorrect—the structure described is the Vertebral foramen, not the Vertebral body.",
          "Correct—this is the Vertebral foramen."
        ]
      },
      {
        "id": "af-spine-back-vertebra-anatomy-spinous-process",
        "imageUrl": "/images/anatomy/bones/lumbar-vertebral-disk-spinous-process.png",
        "term": "Spinous process",
        "prompt": "The posterior bony projection of a vertebra, palpable along the midline of the back.",
        "concept": "Vertebra Anatomy",
        "options": [
          "Transverse process",
          "Vertebral body",
          "Spinous process",
          "Inferior articular process"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Spinous process, not the Transverse process.",
          "Incorrect—the structure described is the Spinous process, not the Vertebral body.",
          "Correct—this is the Spinous process.",
          "Incorrect—the structure described is the Spinous process, not the Inferior articular process."
        ]
      },
      {
        "id": "af-spine-back-vertebra-anatomy-transverse-process",
        "imageUrl": "/images/anatomy/bones/lumbar-vertebral-disk-transverse-process.png",
        "term": "Transverse process",
        "prompt": "A bony projection extending laterally from a vertebra, serving as a muscle and ligament attachment site.",
        "concept": "Vertebra Anatomy",
        "options": [
          "Spinous process",
          "Vertebral foramen",
          "Vertebral body",
          "Transverse process"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Transverse process, not the Spinous process.",
          "Incorrect—the structure described is the Transverse process, not the Vertebral foramen.",
          "Incorrect—the structure described is the Transverse process, not the Vertebral body.",
          "Correct—this is the Transverse process."
        ]
      },
      {
        "id": "af-spine-back-intervertebral-structures-intervertebral-disc",
        "imageUrl": "/images/anatomy/bones/vertabrae-intervertebral-disc.png",
        "term": "Intervertebral disc",
        "prompt": "A fibrocartilaginous cushion between adjacent vertebral bodies that absorbs shock and allows slight movement.",
        "concept": "Intervertebral Structures",
        "options": [
          "Intervertebral foramen",
          "Annulus fibrosus",
          "Nucleus pulposus",
          "Intervertebral disc"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Intervertebral disc, not the Intervertebral foramen.",
          "Incorrect—the structure described is the Intervertebral disc, not the Annulus fibrosus.",
          "Incorrect—the structure described is the Intervertebral disc, not the Nucleus pulposus.",
          "Correct—this is the Intervertebral disc."
        ]
      },
      {
        "id": "af-spine-back-intervertebral-structures-annulus-fibrosus",
        "imageUrl": "/images/anatomy/bones/lumbar-vertabral-disk-annulus-fibrosus.png",
        "term": "Annulus fibrosus",
        "prompt": "The tough outer ring of an intervertebral disc, made of layered fibrocartilage.",
        "concept": "Intervertebral Structures",
        "options": [
          "Annulus fibrosus",
          "Nucleus pulposus",
          "Intervertebral disc",
          "Intervertebral foramen"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Annulus fibrosus.",
          "Incorrect—the structure described is the Annulus fibrosus, not the Nucleus pulposus.",
          "Incorrect—the structure described is the Annulus fibrosus, not the Intervertebral disc.",
          "Incorrect—the structure described is the Annulus fibrosus, not the Intervertebral foramen."
        ]
      },
      {
        "id": "af-spine-back-intervertebral-structures-nucleus-pulposus",
        "imageUrl": "/images/anatomy/bones/lumbar-vertabral-disk-nucleus-pulposus.png",
        "term": "Nucleus pulposus",
        "prompt": "The gel-like center of an intervertebral disc that helps distribute compressive forces.",
        "concept": "Intervertebral Structures",
        "options": [
          "Nucleus pulposus",
          "Intervertebral disc",
          "Annulus fibrosus",
          "Intervertebral foramen"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Nucleus pulposus.",
          "Incorrect—the structure described is the Nucleus pulposus, not the Intervertebral disc.",
          "Incorrect—the structure described is the Nucleus pulposus, not the Annulus fibrosus.",
          "Incorrect—the structure described is the Nucleus pulposus, not the Intervertebral foramen."
        ]
      },
      {
        "id": "af-spine-back-intervertebral-structures-intervertebral-foramen",
        "imageUrl": "/images/anatomy/bones/vertabrae-intervertebral-foramen.png",
        "term": "Intervertebral foramen",
        "prompt": "The opening between adjacent vertebrae through which a spinal nerve exits the vertebral column.",
        "concept": "Intervertebral Structures",
        "options": [
          "Intervertebral foramen",
          "Intervertebral disc",
          "Nucleus pulposus",
          "Annulus fibrosus"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Intervertebral foramen.",
          "Incorrect—the structure described is the Intervertebral foramen, not the Intervertebral disc.",
          "Incorrect—the structure described is the Intervertebral foramen, not the Nucleus pulposus.",
          "Incorrect—the structure described is the Intervertebral foramen, not the Annulus fibrosus."
        ]
      },
      {
        "id": "af-spine-back-sacral-features-sacral-hiatus",
        "imageUrl": "/images/anatomy/bones/sacral-hiatus.png",
        "term": "Sacral hiatus",
        "prompt": "A gap at the lower end of the sacral canal, formed where the laminae of S5 fail to fuse, used as a landmark for caudal epidural injections.",
        "concept": "Sacral Features",
        "options": [
          "Vertebral body",
          "Inferior articular process",
          "Sacrum",
          "Sacral hiatus"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Sacral hiatus, not the Vertebral body.",
          "Incorrect—the structure described is the Sacral hiatus, not the Inferior articular process.",
          "Incorrect—the structure described is the Sacral hiatus, not the Sacrum.",
          "Correct—this is the Sacral hiatus."
        ]
      }
    ]
  },
  {
    "id": "thorax",
    "title": "Thorax",
    "description": "The thoracic skeleton, the heart, the lungs, and the airways and pleura.",
    "groups": [
      {
        "id": "thoracic-skeleton",
        "title": "Thoracic Skeleton"
      }
    ],
    "cards": [
      {
        "id": "af-thorax-thoracic-skeleton-sternum",
        "imageUrl": "/images/anatomy/bones/sternum.png",
        "term": "Sternum",
        "prompt": "The flat bone in the midline of the anterior chest, composed of the manubrium, body, and xiphoid process.",
        "concept": "Thoracic Skeleton",
        "options": [
          "Sternum",
          "Manubrium",
          "Xiphoid process",
          "Floating rib"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Sternum.",
          "Incorrect—the structure described is the Sternum, not the Manubrium.",
          "Incorrect—the structure described is the Sternum, not the Xiphoid process.",
          "Incorrect—the structure described is the Sternum, not the Floating rib."
        ]
      },
      {
        "id": "af-thorax-thoracic-skeleton-manubrium",
        "imageUrl": "/images/anatomy/bones/sternum-manubrium.png",
        "term": "Manubrium",
        "prompt": "The superior segment of the sternum that articulates with the clavicles and first ribs.",
        "concept": "Thoracic Skeleton",
        "options": [
          "Sternum",
          "Body of sternum",
          "Costal cartilage",
          "Manubrium"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Manubrium, not the Sternum.",
          "Incorrect—the structure described is the Manubrium, not the Body of sternum.",
          "Incorrect—the structure described is the Manubrium, not the Costal cartilage.",
          "Correct—this is the Manubrium."
        ]
      },
      {
        "id": "af-thorax-thoracic-skeleton-sternal-angle",
        "imageUrl": "/images/anatomy/bones/sternum-sternal-angle.png",
        "term": "Sternal angle",
        "prompt": "The palpable ridge where the manubrium meets the body of the sternum, marking the level of the second rib.",
        "concept": "Thoracic Skeleton",
        "options": [
          "Sternal angle",
          "Floating rib",
          "Body of sternum",
          "Xiphoid process"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Sternal angle.",
          "Incorrect—the structure described is the Sternal angle, not the Floating rib.",
          "Incorrect—the structure described is the Sternal angle, not the Body of sternum.",
          "Incorrect—the structure described is the Sternal angle, not the Xiphoid process."
        ]
      },
      {
        "id": "af-thorax-thoracic-skeleton-body-of-sternum",
        "imageUrl": "/images/anatomy/bones/sternum-body.png",
        "term": "Body of sternum",
        "prompt": "The long middle segment of the sternum that articulates with ribs two through seven via costal cartilage.",
        "concept": "Thoracic Skeleton",
        "options": [
          "Sternal angle",
          "Body of sternum",
          "Xiphoid process",
          "Manubrium"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Body of sternum, not the Sternal angle.",
          "Correct—this is the Body of sternum.",
          "Incorrect—the structure described is the Body of sternum, not the Xiphoid process.",
          "Incorrect—the structure described is the Body of sternum, not the Manubrium."
        ]
      },
      {
        "id": "af-thorax-thoracic-skeleton-xiphoid-process",
        "imageUrl": "/images/anatomy/bones/sternum-xiphoid-process.png",
        "term": "Xiphoid process",
        "prompt": "The small, variably shaped inferior tip of the sternum, cartilaginous in youth and often ossified in adults.",
        "concept": "Thoracic Skeleton",
        "options": [
          "Sternum",
          "Manubrium",
          "Costal cartilage",
          "Xiphoid process"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Xiphoid process, not the Sternum.",
          "Incorrect—the structure described is the Xiphoid process, not the Manubrium.",
          "Incorrect—the structure described is the Xiphoid process, not the Costal cartilage.",
          "Correct—this is the Xiphoid process."
        ]
      },
      {
        "id": "af-thorax-thoracic-skeleton-floating-rib",
        "imageUrl": "/images/anatomy/bones/ribcage-floating-ribs.png",
        "term": "Floating rib",
        "prompt": "One of ribs eleven and twelve, which do not attach to the sternum or to the costal cartilage of another rib.",
        "concept": "Thoracic Skeleton",
        "options": [
          "Floating rib",
          "Body of sternum",
          "Sternal angle",
          "Costal cartilage"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Floating rib.",
          "Incorrect—the structure described is the Floating rib, not the Body of sternum.",
          "Incorrect—the structure described is the Floating rib, not the Sternal angle.",
          "Incorrect—the structure described is the Floating rib, not the Costal cartilage."
        ]
      },
      {
        "id": "af-thorax-thoracic-skeleton-costal-cartilage",
        "imageUrl": "/images/anatomy/bones/ribs-costal-cartilage.png",
        "term": "Costal cartilage",
        "prompt": "The hyaline cartilage that connects the bony ribs to the sternum, allowing the rib cage to flex.",
        "concept": "Thoracic Skeleton",
        "options": [
          "Body of sternum",
          "Sternal angle",
          "Costal cartilage",
          "Xiphoid process"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Costal cartilage, not the Body of sternum.",
          "Incorrect—the structure described is the Costal cartilage, not the Sternal angle.",
          "Correct—this is the Costal cartilage.",
          "Incorrect—the structure described is the Costal cartilage, not the Xiphoid process."
        ]
      }
    ]
  },
  {
    "id": "abdomen-pelvis",
    "title": "Abdomen, Pelvic Girdle & Floor",
    "description": "Abdominal organs, the kidneys, and the bones of the pelvis.",
    "groups": [
      {
        "id": "pelvis",
        "title": "Pelvis"
      }
    ],
    "cards": [
      {
        "id": "af-abdomen-pelvis-pelvis-ilium",
        "imageUrl": "/images/anatomy/bones/pelvic-ilium.png",
        "term": "Ilium",
        "prompt": "The largest and most superior of the three bones that fuse to form the hip bone.",
        "concept": "Pelvis",
        "options": [
          "Acetabulum",
          "Pubis",
          "Ilium",
          "Ischium"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Ilium, not the Acetabulum.",
          "Incorrect—the structure described is the Ilium, not the Pubis.",
          "Correct—this is the Ilium.",
          "Incorrect—the structure described is the Ilium, not the Ischium."
        ]
      },
      {
        "id": "af-abdomen-pelvis-pelvis-ischium",
        "imageUrl": "/images/anatomy/bones/pelvic-ischium.png",
        "term": "Ischium",
        "prompt": "The posteroinferior bone of the hip bone; its tuberosity bears weight when sitting.",
        "concept": "Pelvis",
        "options": [
          "Pubic symphysis",
          "Pubis",
          "Obturator foramen",
          "Ischium"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Ischium, not the Pubic symphysis.",
          "Incorrect—the structure described is the Ischium, not the Pubis.",
          "Incorrect—the structure described is the Ischium, not the Obturator foramen.",
          "Correct—this is the Ischium."
        ]
      },
      {
        "id": "af-abdomen-pelvis-pelvis-pubis",
        "term": "Pubis",
        "prompt": "The anteromedial bone of the hip bone that meets its counterpart at the pubic symphysis.",
        "concept": "Pelvis",
        "options": [
          "Ischial tuberosity",
          "Pubis",
          "Sacroiliac joint",
          "Ischium"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Pubis, not the Ischial tuberosity.",
          "Correct—this is the Pubis.",
          "Incorrect—the structure described is the Pubis, not the Sacroiliac joint.",
          "Incorrect—the structure described is the Pubis, not the Ischium."
        ],
        "imageUrl": "/images/anatomy/bones/pelvic-pubis.png"
      },
      {
        "id": "af-abdomen-pelvis-pelvis-acetabulum",
        "imageUrl": "/images/anatomy/bones/pelvic-acetabulum.png",
        "term": "Acetabulum",
        "prompt": "The cup-shaped socket on the hip bone that articulates with the head of the femur.",
        "concept": "Pelvis",
        "options": [
          "Obturator foramen",
          "Ischium",
          "Acetabulum",
          "Ilium"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Acetabulum, not the Obturator foramen.",
          "Incorrect—the structure described is the Acetabulum, not the Ischium.",
          "Correct—this is the Acetabulum.",
          "Incorrect—the structure described is the Acetabulum, not the Ilium."
        ]
      },
      {
        "id": "af-abdomen-pelvis-pelvis-obturator-foramen",
        "imageUrl": "/images/anatomy/bones/pelvic-obturator-foramen.png",
        "term": "Obturator foramen",
        "prompt": "The large opening in the hip bone, bounded by the ischium and pubis, mostly covered by the obturator membrane.",
        "concept": "Pelvis",
        "options": [
          "Obturator foramen",
          "Sacroiliac joint",
          "Ischium",
          "Ilium"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Obturator foramen.",
          "Incorrect—the structure described is the Obturator foramen, not the Sacroiliac joint.",
          "Incorrect—the structure described is the Obturator foramen, not the Ischium.",
          "Incorrect—the structure described is the Obturator foramen, not the Ilium."
        ]
      }
    ]
  },
  {
    "id": "head-neck",
    "title": "Head & Neck",
    "description": "The bones of the skull and the major foramina and canals that transmit nerves and vessels through it. This section is still being expanded.",
    "groups": [
      {
        "id": "skull-bones",
        "title": "Skull Bones"
      },
      {
        "id": "landmarks",
        "title": "Important Landmarks"
      }
    ],
    "cards": [
      {
        "id": "af-head-neck-skull-bones-frontal-bone",
        "term": "Frontal bone",
        "prompt": "The bone that forms the forehead and the upper part of the eye sockets.",
        "concept": "Skull Bones",
        "options": [
          "Frontal bone",
          "Nasal bone",
          "Mandible",
          "Parietal bone"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Frontal bone.",
          "Incorrect—the structure described is the Frontal bone, not the Nasal bone.",
          "Incorrect—the structure described is the Frontal bone, not the Mandible.",
          "Incorrect—the structure described is the Frontal bone, not the Parietal bone."
        ],
        "imageUrl": "/images/anatomy/bones/frontal-bone.png"
      },
      {
        "id": "af-head-neck-skull-bones-parietal-bone",
        "term": "Parietal bone",
        "prompt": "One of two bones that form the upper sides and roof of the skull.",
        "concept": "Skull Bones",
        "options": [
          "Sphenoid",
          "Zygomatic bone",
          "Parietal bone",
          "Occipital bone"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Parietal bone, not the Sphenoid.",
          "Incorrect—the structure described is the Parietal bone, not the Zygomatic bone.",
          "Correct—this is the Parietal bone.",
          "Incorrect—the structure described is the Parietal bone, not the Occipital bone."
        ],
        "imageUrl": "/images/anatomy/bones/parietal-bone.png"
      },
      {
        "id": "af-head-neck-skull-bones-temporal-bone",
        "term": "Temporal bone",
        "prompt": "One of two bones that form the lower sides of the skull and house the structures of hearing and balance.",
        "concept": "Skull Bones",
        "options": [
          "Ethmoid",
          "Maxilla",
          "Occipital bone",
          "Temporal bone"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Temporal bone, not the Ethmoid.",
          "Incorrect—the structure described is the Temporal bone, not the Maxilla.",
          "Incorrect—the structure described is the Temporal bone, not the Occipital bone.",
          "Correct—this is the Temporal bone."
        ],
        "imageUrl": "/images/anatomy/bones/temporal-bone.png"
      },
      {
        "id": "af-head-neck-skull-bones-occipital-bone",
        "term": "Occipital bone",
        "prompt": "The bone that forms the back and base of the skull, containing the foramen magnum.",
        "concept": "Skull Bones",
        "options": [
          "Occipital bone",
          "Zygomatic bone",
          "Mandible",
          "Parietal bone"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Occipital bone.",
          "Incorrect—the structure described is the Occipital bone, not the Zygomatic bone.",
          "Incorrect—the structure described is the Occipital bone, not the Mandible.",
          "Incorrect—the structure described is the Occipital bone, not the Parietal bone."
        ],
        "imageUrl": "/images/anatomy/bones/occipital-bone.png"
      },
      {
        "id": "af-head-neck-skull-bones-sphenoid",
        "term": "Sphenoid",
        "prompt": "A butterfly-shaped bone at the base of the skull that articulates with nearly every other cranial bone.",
        "concept": "Skull Bones",
        "options": [
          "Ethmoid",
          "Sphenoid",
          "Mandible",
          "Parietal bone"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Sphenoid, not the Ethmoid.",
          "Correct—this is the Sphenoid.",
          "Incorrect—the structure described is the Sphenoid, not the Mandible.",
          "Incorrect—the structure described is the Sphenoid, not the Parietal bone."
        ],
        "imageUrl": "/images/anatomy/bones/sphenoid.png"
      },
      {
        "id": "af-head-neck-skull-bones-maxilla",
        "term": "Maxilla",
        "prompt": "One of two bones that form the upper jaw, the floor of the orbits, and part of the nasal cavity.",
        "concept": "Skull Bones",
        "options": [
          "Mandible",
          "Occipital bone",
          "Sphenoid",
          "Maxilla"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Maxilla, not the Mandible.",
          "Incorrect—the structure described is the Maxilla, not the Occipital bone.",
          "Incorrect—the structure described is the Maxilla, not the Sphenoid.",
          "Correct—this is the Maxilla."
        ],
        "imageUrl": "/images/anatomy/bones/maxilla.png"
      },
      {
        "id": "af-head-neck-skull-bones-mandible",
        "term": "Mandible",
        "prompt": "The lower jawbone, the only movable bone of the skull.",
        "concept": "Skull Bones",
        "options": [
          "Temporal bone",
          "Occipital bone",
          "Zygomatic bone",
          "Mandible"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Mandible, not the Temporal bone.",
          "Incorrect—the structure described is the Mandible, not the Occipital bone.",
          "Incorrect—the structure described is the Mandible, not the Zygomatic bone.",
          "Correct—this is the Mandible."
        ],
        "imageUrl": "/images/anatomy/bones/mandible.png"
      },
      {
        "id": "af-head-neck-skull-bones-zygomatic-bone",
        "term": "Zygomatic bone",
        "prompt": "The cheekbone, which also forms part of the lateral orbital wall.",
        "concept": "Skull Bones",
        "options": [
          "Maxilla",
          "Nasal bone",
          "Occipital bone",
          "Zygomatic bone"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Zygomatic bone, not the Maxilla.",
          "Incorrect—the structure described is the Zygomatic bone, not the Nasal bone.",
          "Incorrect—the structure described is the Zygomatic bone, not the Occipital bone.",
          "Correct—this is the Zygomatic bone."
        ],
        "imageUrl": "/images/anatomy/bones/zygomatic-bone.png"
      },
      {
        "id": "af-head-neck-skull-bones-nasal-bone",
        "term": "Nasal bone",
        "prompt": "One of two small bones that form the bridge of the nose.",
        "concept": "Skull Bones",
        "options": [
          "Occipital bone",
          "Nasal bone",
          "Temporal bone",
          "Sphenoid"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Nasal bone, not the Occipital bone.",
          "Correct—this is the Nasal bone.",
          "Incorrect—the structure described is the Nasal bone, not the Temporal bone.",
          "Incorrect—the structure described is the Nasal bone, not the Sphenoid."
        ],
        "imageUrl": "/images/anatomy/bones/nasal-bone.png"
      },
      {
        "id": "af-head-neck-landmarks-foramen-magnum",
        "term": "Foramen magnum",
        "prompt": "The large opening in the occipital bone through which the spinal cord passes to connect with the brainstem.",
        "concept": "Important Landmarks",
        "options": [
          "Foramen magnum",
          "Foramen ovale",
          "Jugular foramen",
          "Optic canal"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Foramen magnum.",
          "Incorrect—the structure described is the Foramen magnum, not the Foramen ovale.",
          "Incorrect—the structure described is the Foramen magnum, not the Jugular foramen.",
          "Incorrect—the structure described is the Foramen magnum, not the Optic canal."
        ],
        "imageUrl": "/images/anatomy/bones/foramen-magnum.png"
      }
    ]
  }
];

export function findAnatomyFlashcardSection(sectionId: string): AnatomyFlashcardSection | undefined {
  return anatomyFlashcardSections.find(s => s.id === sectionId);
}
