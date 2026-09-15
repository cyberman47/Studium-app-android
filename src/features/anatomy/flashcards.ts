// Anatomy flashcard sections — a verbatim copy of the web app's
// lib/anatomyFlashcards.ts (studium-website), one card per term from the
// "Anatomy Studium Checklist". Kept byte-for-byte identical in content so
// the phone and the website test the exact same cards with the exact same
// four-option answer sets (the option order per card was seeded there and
// must stay stable across both apps).
//
// `imageUrl` is the same site-relative path the web uses ("/images/
// anatomy/..."); the phone resolves it against the deployed website at
// render time (see anatomyImageUri) rather than bundling the ~65 MB of
// PNGs into the APK. A card with no imageUrl shows its text definition as
// the prompt instead, same fallback as the web.
//
// When the web file changes, re-copy everything from `export type
// AnatomyFlashcard` down — nothing below this header is hand-edited.

import { WEBSITE_URL } from '@/lib/config';

export function anatomyImageUri(imageUrl: string): string {
  return `${WEBSITE_URL}${imageUrl}`;
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
        "id": "af-terminology-directional-terms-superficial",
        "term": "Superficial",
        "prompt": "Positioned closer to the body's surface.",
        "concept": "Directional Terms",
        "options": [
          "Superficial",
          "Deep",
          "Ipsilateral",
          "Proximal"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Superficial.",
          "Incorrect—the structure described is the Superficial, not the Deep.",
          "Incorrect—the structure described is the Superficial, not the Ipsilateral.",
          "Incorrect—the structure described is the Superficial, not the Proximal."
        ]
      },
      {
        "id": "af-terminology-directional-terms-deep",
        "term": "Deep",
        "prompt": "Positioned farther from the body's surface, toward the interior.",
        "concept": "Directional Terms",
        "options": [
          "Superficial",
          "Contralateral",
          "Deep",
          "Distal"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Deep, not the Superficial.",
          "Incorrect—the structure described is the Deep, not the Contralateral.",
          "Correct—this is the Deep.",
          "Incorrect—the structure described is the Deep, not the Distal."
        ]
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
        ]
      },
      {
        "id": "af-terminology-planes-midsagittal",
        "term": "Midsagittal",
        "prompt": "The sagittal plane passing through the body's midline, dividing it into equal right and left halves.",
        "concept": "Planes",
        "options": [
          "Midsagittal",
          "Transverse",
          "Coronal",
          "Sagittal"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Midsagittal.",
          "Incorrect—the structure described is the Midsagittal, not the Transverse.",
          "Incorrect—the structure described is the Midsagittal, not the Coronal.",
          "Incorrect—the structure described is the Midsagittal, not the Sagittal."
        ]
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
        ]
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
        ]
      },
      {
        "id": "af-terminology-planes-oblique",
        "term": "Oblique",
        "prompt": "A plane that cuts through the body at an angle other than sagittal, coronal, or transverse.",
        "concept": "Planes",
        "options": [
          "Midsagittal",
          "Sagittal",
          "Oblique",
          "Transverse"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Oblique, not the Midsagittal.",
          "Incorrect—the structure described is the Oblique, not the Sagittal.",
          "Correct—this is the Oblique.",
          "Incorrect—the structure described is the Oblique, not the Transverse."
        ]
      },
      {
        "id": "af-terminology-movements-flexion",
        "term": "Flexion",
        "prompt": "Decreasing the angle between two body parts at a joint, typically bending a limb.",
        "concept": "Movements",
        "options": [
          "Flexion",
          "Supination",
          "Extension",
          "Adduction"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Flexion.",
          "Incorrect—the structure described is the Flexion, not the Supination.",
          "Incorrect—the structure described is the Flexion, not the Extension.",
          "Incorrect—the structure described is the Flexion, not the Adduction."
        ]
      },
      {
        "id": "af-terminology-movements-extension",
        "term": "Extension",
        "prompt": "Increasing the angle between two body parts at a joint, typically straightening a limb.",
        "concept": "Movements",
        "options": [
          "External rotation",
          "Flexion",
          "Abduction",
          "Extension"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Extension, not the External rotation.",
          "Incorrect—the structure described is the Extension, not the Flexion.",
          "Incorrect—the structure described is the Extension, not the Abduction.",
          "Correct—this is the Extension."
        ]
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
        ]
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
        ]
      },
      {
        "id": "af-terminology-movements-internal-rotation",
        "term": "Internal rotation",
        "prompt": "Rotating a limb around its long axis toward the body's midline.",
        "concept": "Movements",
        "options": [
          "Inversion",
          "Eversion",
          "Internal rotation",
          "Adduction"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Internal rotation, not the Inversion.",
          "Incorrect—the structure described is the Internal rotation, not the Eversion.",
          "Correct—this is the Internal rotation.",
          "Incorrect—the structure described is the Internal rotation, not the Adduction."
        ]
      },
      {
        "id": "af-terminology-movements-external-rotation",
        "term": "External rotation",
        "prompt": "Rotating a limb around its long axis away from the body's midline.",
        "concept": "Movements",
        "options": [
          "External rotation",
          "Inversion",
          "Flexion",
          "Supination"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the External rotation.",
          "Incorrect—the structure described is the External rotation, not the Inversion.",
          "Incorrect—the structure described is the External rotation, not the Flexion.",
          "Incorrect—the structure described is the External rotation, not the Supination."
        ]
      },
      {
        "id": "af-terminology-movements-pronation",
        "term": "Pronation",
        "prompt": "Rotating the forearm so the palm faces posteriorly or downward.",
        "concept": "Movements",
        "options": [
          "Pronation",
          "Opposition",
          "Inversion",
          "External rotation"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Pronation.",
          "Incorrect—the structure described is the Pronation, not the Opposition.",
          "Incorrect—the structure described is the Pronation, not the Inversion.",
          "Incorrect—the structure described is the Pronation, not the External rotation."
        ]
      },
      {
        "id": "af-terminology-movements-supination",
        "term": "Supination",
        "prompt": "Rotating the forearm so the palm faces anteriorly or upward.",
        "concept": "Movements",
        "options": [
          "Dorsiflexion",
          "Plantarflexion",
          "Extension",
          "Supination"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Supination, not the Dorsiflexion.",
          "Incorrect—the structure described is the Supination, not the Plantarflexion.",
          "Incorrect—the structure described is the Supination, not the Extension.",
          "Correct—this is the Supination."
        ]
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
        ]
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
        ]
      },
      {
        "id": "af-terminology-movements-inversion",
        "term": "Inversion",
        "prompt": "Tilting the sole of the foot inward, toward the midline.",
        "concept": "Movements",
        "options": [
          "Supination",
          "Inversion",
          "Plantarflexion",
          "Flexion"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Inversion, not the Supination.",
          "Correct—this is the Inversion.",
          "Incorrect—the structure described is the Inversion, not the Plantarflexion.",
          "Incorrect—the structure described is the Inversion, not the Flexion."
        ]
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
        ]
      },
      {
        "id": "af-terminology-movements-opposition",
        "term": "Opposition",
        "prompt": "Bringing the thumb into contact with the fingertips, a movement unique to the thumb's saddle joint.",
        "concept": "Movements",
        "options": [
          "Supination",
          "Internal rotation",
          "Opposition",
          "Dorsiflexion"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Opposition, not the Supination.",
          "Incorrect—the structure described is the Opposition, not the Internal rotation.",
          "Correct—this is the Opposition.",
          "Incorrect—the structure described is the Opposition, not the Dorsiflexion."
        ]
      },
      {
        "id": "af-terminology-basic-anatomy-bone",
        "term": "Bone",
        "prompt": "A rigid connective tissue that forms the skeleton and provides structural support and attachment points for muscles.",
        "concept": "Basic Anatomy",
        "options": [
          "Bone",
          "Fascia",
          "Ligament",
          "Joint"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Bone.",
          "Incorrect—the structure described is the Bone, not the Fascia.",
          "Incorrect—the structure described is the Bone, not the Ligament.",
          "Incorrect—the structure described is the Bone, not the Joint."
        ]
      },
      {
        "id": "af-terminology-basic-anatomy-joint",
        "term": "Joint",
        "prompt": "The junction between two or more bones where movement or support occurs.",
        "concept": "Basic Anatomy",
        "options": [
          "Bone",
          "Ligament",
          "Tendon",
          "Joint"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Joint, not the Bone.",
          "Incorrect—the structure described is the Joint, not the Ligament.",
          "Incorrect—the structure described is the Joint, not the Tendon.",
          "Correct—this is the Joint."
        ]
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
        ]
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
        ]
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
        ]
      },
      {
        "id": "af-terminology-basic-anatomy-fascia",
        "term": "Fascia",
        "prompt": "A sheet of fibrous connective tissue that surrounds and separates muscles and organs.",
        "concept": "Basic Anatomy",
        "options": [
          "Ligament",
          "Bone",
          "Tendon",
          "Fascia"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Fascia, not the Ligament.",
          "Incorrect—the structure described is the Fascia, not the Bone.",
          "Incorrect—the structure described is the Fascia, not the Tendon.",
          "Correct—this is the Fascia."
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      },
      {
        "id": "af-upper-limb-forearm-olecranon",
        "term": "Olecranon",
        "prompt": "The proximal projection of the ulna that forms the point of the elbow.",
        "concept": "Forearm",
        "options": [
          "Olecranon",
          "Styloid processes",
          "Ulna",
          "Coronoid process"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Olecranon.",
          "Incorrect—the structure described is the Olecranon, not the Styloid processes.",
          "Incorrect—the structure described is the Olecranon, not the Ulna.",
          "Incorrect—the structure described is the Olecranon, not the Coronoid process."
        ]
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
        ]
      },
      {
        "id": "af-upper-limb-forearm-styloid-processes",
        "term": "Styloid processes",
        "prompt": "Pointed projections at the distal ends of the radius and ulna near the wrist.",
        "concept": "Forearm",
        "options": [
          "Radial tuberosity",
          "Radial head",
          "Styloid processes",
          "Coronoid process"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Styloid processes, not the Radial tuberosity.",
          "Incorrect—the structure described is the Styloid processes, not the Radial head.",
          "Correct—this is the Styloid processes.",
          "Incorrect—the structure described is the Styloid processes, not the Coronoid process."
        ]
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
        ]
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
        "id": "af-spine-back-vertebra-anatomy-superior-articular-process",
        "term": "Superior articular process",
        "prompt": "A projection on a vertebra that forms a joint with the vertebra above it.",
        "concept": "Vertebra Anatomy",
        "options": [
          "Vertebral foramen",
          "Transverse process",
          "Superior articular process",
          "Inferior articular process"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Superior articular process, not the Vertebral foramen.",
          "Incorrect—the structure described is the Superior articular process, not the Transverse process.",
          "Correct—this is the Superior articular process.",
          "Incorrect—the structure described is the Superior articular process, not the Inferior articular process."
        ]
      },
      {
        "id": "af-spine-back-vertebra-anatomy-inferior-articular-process",
        "term": "Inferior articular process",
        "prompt": "A projection on a vertebra that forms a joint with the vertebra below it.",
        "concept": "Vertebra Anatomy",
        "options": [
          "Superior articular process",
          "Transverse process",
          "Vertebral foramen",
          "Inferior articular process"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Inferior articular process, not the Superior articular process.",
          "Incorrect—the structure described is the Inferior articular process, not the Transverse process.",
          "Incorrect—the structure described is the Inferior articular process, not the Vertebral foramen.",
          "Correct—this is the Inferior articular process."
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
      },
      {
        "id": "heart",
        "title": "Heart"
      },
      {
        "id": "lungs",
        "title": "Lungs"
      },
      {
        "id": "airways-pleura",
        "title": "Airways & Pleura"
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
      },
      {
        "id": "af-thorax-heart-heart",
        "term": "Heart",
        "prompt": "The muscular organ that pumps blood through the circulatory system, located in the mediastinum between the lungs.",
        "concept": "Heart",
        "options": [
          "Superior vena cava",
          "Left atrium",
          "Aorta",
          "Heart"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Heart, not the Superior vena cava.",
          "Incorrect—the structure described is the Heart, not the Left atrium.",
          "Incorrect—the structure described is the Heart, not the Aorta.",
          "Correct—this is the Heart."
        ]
      },
      {
        "id": "af-thorax-heart-right-atrium",
        "term": "Right atrium",
        "prompt": "The chamber that receives deoxygenated blood from the body via the venae cavae.",
        "concept": "Heart",
        "options": [
          "Left atrium",
          "Right atrium",
          "Pulmonary trunk",
          "Aorta"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Right atrium, not the Left atrium.",
          "Correct—this is the Right atrium.",
          "Incorrect—the structure described is the Right atrium, not the Pulmonary trunk.",
          "Incorrect—the structure described is the Right atrium, not the Aorta."
        ]
      },
      {
        "id": "af-thorax-heart-right-ventricle",
        "term": "Right ventricle",
        "prompt": "The chamber that pumps deoxygenated blood into the pulmonary trunk toward the lungs.",
        "concept": "Heart",
        "options": [
          "Pulmonary trunk",
          "Right ventricle",
          "Heart",
          "Pulmonary veins"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Right ventricle, not the Pulmonary trunk.",
          "Correct—this is the Right ventricle.",
          "Incorrect—the structure described is the Right ventricle, not the Heart.",
          "Incorrect—the structure described is the Right ventricle, not the Pulmonary veins."
        ]
      },
      {
        "id": "af-thorax-heart-left-atrium",
        "term": "Left atrium",
        "prompt": "The chamber that receives oxygenated blood from the lungs via the pulmonary veins.",
        "concept": "Heart",
        "options": [
          "Pulmonary trunk",
          "Superior vena cava",
          "Left atrium",
          "Mitral valve"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Left atrium, not the Pulmonary trunk.",
          "Incorrect—the structure described is the Left atrium, not the Superior vena cava.",
          "Correct—this is the Left atrium.",
          "Incorrect—the structure described is the Left atrium, not the Mitral valve."
        ]
      },
      {
        "id": "af-thorax-heart-left-ventricle",
        "term": "Left ventricle",
        "prompt": "The thick-walled chamber that pumps oxygenated blood into the aorta to the rest of the body.",
        "concept": "Heart",
        "options": [
          "Left atrium",
          "Heart",
          "Left ventricle",
          "Pulmonary veins"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Left ventricle, not the Left atrium.",
          "Incorrect—the structure described is the Left ventricle, not the Heart.",
          "Correct—this is the Left ventricle.",
          "Incorrect—the structure described is the Left ventricle, not the Pulmonary veins."
        ]
      },
      {
        "id": "af-thorax-heart-aorta",
        "term": "Aorta",
        "prompt": "The largest artery in the body, carrying oxygenated blood from the left ventricle to the systemic circulation.",
        "concept": "Heart",
        "options": [
          "Right ventricle",
          "Right atrium",
          "Pulmonary trunk",
          "Aorta"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Aorta, not the Right ventricle.",
          "Incorrect—the structure described is the Aorta, not the Right atrium.",
          "Incorrect—the structure described is the Aorta, not the Pulmonary trunk.",
          "Correct—this is the Aorta."
        ]
      },
      {
        "id": "af-thorax-heart-pulmonary-trunk",
        "term": "Pulmonary trunk",
        "prompt": "The large artery that carries deoxygenated blood from the right ventricle toward the lungs.",
        "concept": "Heart",
        "options": [
          "Pulmonary trunk",
          "Right atrium",
          "Mitral valve",
          "Left ventricle"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Pulmonary trunk.",
          "Incorrect—the structure described is the Pulmonary trunk, not the Right atrium.",
          "Incorrect—the structure described is the Pulmonary trunk, not the Mitral valve.",
          "Incorrect—the structure described is the Pulmonary trunk, not the Left ventricle."
        ]
      },
      {
        "id": "af-thorax-heart-superior-vena-cava",
        "term": "Superior vena cava",
        "prompt": "The large vein that returns deoxygenated blood from the head, neck, and upper limbs to the right atrium.",
        "concept": "Heart",
        "options": [
          "Tricuspid valve",
          "Pulmonary trunk",
          "Right atrium",
          "Superior vena cava"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Superior vena cava, not the Tricuspid valve.",
          "Incorrect—the structure described is the Superior vena cava, not the Pulmonary trunk.",
          "Incorrect—the structure described is the Superior vena cava, not the Right atrium.",
          "Correct—this is the Superior vena cava."
        ]
      },
      {
        "id": "af-thorax-heart-pulmonary-veins",
        "term": "Pulmonary veins",
        "prompt": "The vessels that carry oxygenated blood from the lungs to the left atrium.",
        "concept": "Heart",
        "options": [
          "Pulmonary veins",
          "Heart",
          "Left atrium",
          "Right atrium"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Pulmonary veins.",
          "Incorrect—the structure described is the Pulmonary veins, not the Heart.",
          "Incorrect—the structure described is the Pulmonary veins, not the Left atrium.",
          "Incorrect—the structure described is the Pulmonary veins, not the Right atrium."
        ]
      },
      {
        "id": "af-thorax-heart-tricuspid-valve",
        "term": "Tricuspid valve",
        "prompt": "The three-cusped valve between the right atrium and right ventricle.",
        "concept": "Heart",
        "options": [
          "Tricuspid valve",
          "Heart",
          "Mitral valve",
          "Left atrium"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Tricuspid valve.",
          "Incorrect—the structure described is the Tricuspid valve, not the Heart.",
          "Incorrect—the structure described is the Tricuspid valve, not the Mitral valve.",
          "Incorrect—the structure described is the Tricuspid valve, not the Left atrium."
        ]
      },
      {
        "id": "af-thorax-heart-mitral-valve",
        "term": "Mitral valve",
        "prompt": "The two-cusped valve between the left atrium and left ventricle.",
        "concept": "Heart",
        "options": [
          "Left ventricle",
          "Right ventricle",
          "Superior vena cava",
          "Mitral valve"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Mitral valve, not the Left ventricle.",
          "Incorrect—the structure described is the Mitral valve, not the Right ventricle.",
          "Incorrect—the structure described is the Mitral valve, not the Superior vena cava.",
          "Correct—this is the Mitral valve."
        ]
      },
      {
        "id": "af-thorax-lungs-right-lung",
        "term": "Right lung",
        "prompt": "The lung on the right side of the thorax, divided into three lobes and slightly larger than the left.",
        "concept": "Lungs",
        "options": [
          "Middle lobe",
          "Left lung",
          "Superior lobe",
          "Right lung"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Right lung, not the Middle lobe.",
          "Incorrect—the structure described is the Right lung, not the Left lung.",
          "Incorrect—the structure described is the Right lung, not the Superior lobe.",
          "Correct—this is the Right lung."
        ]
      },
      {
        "id": "af-thorax-lungs-left-lung",
        "term": "Left lung",
        "prompt": "The lung on the left side of the thorax, divided into two lobes to accommodate the heart.",
        "concept": "Lungs",
        "options": [
          "Right lung",
          "Inferior lobe",
          "Left lung",
          "Middle lobe"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Left lung, not the Right lung.",
          "Incorrect—the structure described is the Left lung, not the Inferior lobe.",
          "Correct—this is the Left lung.",
          "Incorrect—the structure described is the Left lung, not the Middle lobe."
        ]
      },
      {
        "id": "af-thorax-lungs-superior-lobe",
        "term": "Superior lobe",
        "prompt": "The uppermost lobe of a lung.",
        "concept": "Lungs",
        "options": [
          "Hilum",
          "Inferior lobe",
          "Superior lobe",
          "Right lung"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Superior lobe, not the Hilum.",
          "Incorrect—the structure described is the Superior lobe, not the Inferior lobe.",
          "Correct—this is the Superior lobe.",
          "Incorrect—the structure described is the Superior lobe, not the Right lung."
        ]
      },
      {
        "id": "af-thorax-lungs-middle-lobe",
        "term": "Middle lobe",
        "prompt": "The lobe found only in the right lung, between the superior and inferior lobes.",
        "concept": "Lungs",
        "options": [
          "Right lung",
          "Hilum",
          "Middle lobe",
          "Inferior lobe"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Middle lobe, not the Right lung.",
          "Incorrect—the structure described is the Middle lobe, not the Hilum.",
          "Correct—this is the Middle lobe.",
          "Incorrect—the structure described is the Middle lobe, not the Inferior lobe."
        ]
      },
      {
        "id": "af-thorax-lungs-inferior-lobe",
        "term": "Inferior lobe",
        "prompt": "The lowermost lobe of a lung.",
        "concept": "Lungs",
        "options": [
          "Inferior lobe",
          "Superior lobe",
          "Hilum",
          "Left lung"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Inferior lobe.",
          "Incorrect—the structure described is the Inferior lobe, not the Superior lobe.",
          "Incorrect—the structure described is the Inferior lobe, not the Hilum.",
          "Incorrect—the structure described is the Inferior lobe, not the Left lung."
        ]
      },
      {
        "id": "af-thorax-lungs-lingula",
        "term": "Lingula",
        "prompt": "A tongue-shaped projection of the left lung's superior lobe, functionally similar to the right lung's middle lobe.",
        "concept": "Lungs",
        "options": [
          "Lingula",
          "Left lung",
          "Middle lobe",
          "Inferior lobe"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Lingula.",
          "Incorrect—the structure described is the Lingula, not the Left lung.",
          "Incorrect—the structure described is the Lingula, not the Middle lobe.",
          "Incorrect—the structure described is the Lingula, not the Inferior lobe."
        ]
      },
      {
        "id": "af-thorax-lungs-hilum",
        "term": "Hilum",
        "prompt": "The region on the medial surface of each lung where the bronchi, vessels, and nerves enter and exit.",
        "concept": "Lungs",
        "options": [
          "Right lung",
          "Left lung",
          "Lingula",
          "Hilum"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Hilum, not the Right lung.",
          "Incorrect—the structure described is the Hilum, not the Left lung.",
          "Incorrect—the structure described is the Hilum, not the Lingula.",
          "Correct—this is the Hilum."
        ]
      },
      {
        "id": "af-thorax-airways-pleura-trachea",
        "term": "Trachea",
        "prompt": "The cartilage-reinforced airway that connects the larynx to the main bronchi.",
        "concept": "Airways & Pleura",
        "options": [
          "Pleura",
          "Carina",
          "Main bronchi",
          "Trachea"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Trachea, not the Pleura.",
          "Incorrect—the structure described is the Trachea, not the Carina.",
          "Incorrect—the structure described is the Trachea, not the Main bronchi.",
          "Correct—this is the Trachea."
        ]
      },
      {
        "id": "af-thorax-airways-pleura-carina",
        "term": "Carina",
        "prompt": "The ridge at the point where the trachea divides into the two main bronchi.",
        "concept": "Airways & Pleura",
        "options": [
          "Pleura",
          "Trachea",
          "Carina",
          "Main bronchi"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Carina, not the Pleura.",
          "Incorrect—the structure described is the Carina, not the Trachea.",
          "Correct—this is the Carina.",
          "Incorrect—the structure described is the Carina, not the Main bronchi."
        ]
      },
      {
        "id": "af-thorax-airways-pleura-main-bronchi",
        "term": "Main bronchi",
        "prompt": "The two large airways that branch from the trachea, one entering each lung.",
        "concept": "Airways & Pleura",
        "options": [
          "Main bronchi",
          "Pleura",
          "Trachea",
          "Carina"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Main bronchi.",
          "Incorrect—the structure described is the Main bronchi, not the Pleura.",
          "Incorrect—the structure described is the Main bronchi, not the Trachea.",
          "Incorrect—the structure described is the Main bronchi, not the Carina."
        ]
      },
      {
        "id": "af-thorax-airways-pleura-pleura",
        "term": "Pleura",
        "prompt": "The double-layered serous membrane that lines the thoracic cavity and covers each lung, reducing friction during breathing.",
        "concept": "Airways & Pleura",
        "options": [
          "Trachea",
          "Carina",
          "Pleura",
          "Main bronchi"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Pleura, not the Trachea.",
          "Incorrect—the structure described is the Pleura, not the Carina.",
          "Correct—this is the Pleura.",
          "Incorrect—the structure described is the Pleura, not the Main bronchi."
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
        "id": "abdominal-organs",
        "title": "Abdominal Organs"
      },
      {
        "id": "kidneys",
        "title": "Kidneys"
      },
      {
        "id": "pelvis",
        "title": "Pelvis"
      }
    ],
    "cards": [
      {
        "id": "af-abdomen-pelvis-abdominal-organs-liver",
        "term": "Liver",
        "prompt": "The largest internal organ, located in the right upper abdomen, responsible for metabolism, detoxification, and bile production.",
        "concept": "Abdominal Organs",
        "options": [
          "Liver",
          "Appendix",
          "Gallbladder",
          "Sigmoid colon"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Liver.",
          "Incorrect—the structure described is the Liver, not the Appendix.",
          "Incorrect—the structure described is the Liver, not the Gallbladder.",
          "Incorrect—the structure described is the Liver, not the Sigmoid colon."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-right-lobe",
        "term": "Right lobe",
        "prompt": "The larger of the liver's two main lobes, occupying most of the right upper abdomen.",
        "concept": "Abdominal Organs",
        "options": [
          "Descending colon",
          "Cecum",
          "Right lobe",
          "Appendix"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Right lobe, not the Descending colon.",
          "Incorrect—the structure described is the Right lobe, not the Cecum.",
          "Correct—this is the Right lobe.",
          "Incorrect—the structure described is the Right lobe, not the Appendix."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-left-lobe",
        "term": "Left lobe",
        "prompt": "The smaller of the liver's two main lobes, extending toward the left upper abdomen.",
        "concept": "Abdominal Organs",
        "options": [
          "Left lobe",
          "Ileum",
          "Appendix",
          "Caudate lobe"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Left lobe.",
          "Incorrect—the structure described is the Left lobe, not the Ileum.",
          "Incorrect—the structure described is the Left lobe, not the Appendix.",
          "Incorrect—the structure described is the Left lobe, not the Caudate lobe."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-caudate-lobe",
        "term": "Caudate lobe",
        "prompt": "A small lobe on the posterior surface of the liver, near the inferior vena cava.",
        "concept": "Abdominal Organs",
        "options": [
          "Liver",
          "Caudate lobe",
          "Sigmoid colon",
          "Ileum"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Caudate lobe, not the Liver.",
          "Correct—this is the Caudate lobe.",
          "Incorrect—the structure described is the Caudate lobe, not the Sigmoid colon.",
          "Incorrect—the structure described is the Caudate lobe, not the Ileum."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-quadrate-lobe",
        "term": "Quadrate lobe",
        "prompt": "A small lobe on the inferior surface of the liver, near the gallbladder.",
        "concept": "Abdominal Organs",
        "options": [
          "Left lobe",
          "Right lobe",
          "Quadrate lobe",
          "Cecum"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Quadrate lobe, not the Left lobe.",
          "Incorrect—the structure described is the Quadrate lobe, not the Right lobe.",
          "Correct—this is the Quadrate lobe.",
          "Incorrect—the structure described is the Quadrate lobe, not the Cecum."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-gallbladder",
        "term": "Gallbladder",
        "prompt": "A small sac beneath the liver that stores and concentrates bile before release into the duodenum.",
        "concept": "Abdominal Organs",
        "options": [
          "Appendix",
          "Caudate lobe",
          "Transverse colon",
          "Gallbladder"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Gallbladder, not the Appendix.",
          "Incorrect—the structure described is the Gallbladder, not the Caudate lobe.",
          "Incorrect—the structure described is the Gallbladder, not the Transverse colon.",
          "Correct—this is the Gallbladder."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-stomach",
        "term": "Stomach",
        "prompt": "The J-shaped organ between the esophagus and duodenum where food is mixed with acid and enzymes.",
        "concept": "Abdominal Organs",
        "options": [
          "Sigmoid colon",
          "Stomach",
          "Right lobe",
          "Appendix"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Stomach, not the Sigmoid colon.",
          "Correct—this is the Stomach.",
          "Incorrect—the structure described is the Stomach, not the Right lobe.",
          "Incorrect—the structure described is the Stomach, not the Appendix."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-pancreas",
        "term": "Pancreas",
        "prompt": "A gland behind the stomach that produces digestive enzymes and the hormones insulin and glucagon.",
        "concept": "Abdominal Organs",
        "options": [
          "Right lobe",
          "Pancreas",
          "Appendix",
          "Caudate lobe"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Pancreas, not the Right lobe.",
          "Correct—this is the Pancreas.",
          "Incorrect—the structure described is the Pancreas, not the Appendix.",
          "Incorrect—the structure described is the Pancreas, not the Caudate lobe."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-spleen",
        "term": "Spleen",
        "prompt": "An organ in the left upper abdomen that filters blood and supports immune function.",
        "concept": "Abdominal Organs",
        "options": [
          "Liver",
          "Transverse colon",
          "Right lobe",
          "Spleen"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Spleen, not the Liver.",
          "Incorrect—the structure described is the Spleen, not the Transverse colon.",
          "Incorrect—the structure described is the Spleen, not the Right lobe.",
          "Correct—this is the Spleen."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-duodenum",
        "term": "Duodenum",
        "prompt": "The first and shortest segment of the small intestine, receiving chyme from the stomach and secretions from the liver and pancreas.",
        "concept": "Abdominal Organs",
        "options": [
          "Duodenum",
          "Transverse colon",
          "Spleen",
          "Ascending colon"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Duodenum.",
          "Incorrect—the structure described is the Duodenum, not the Transverse colon.",
          "Incorrect—the structure described is the Duodenum, not the Spleen.",
          "Incorrect—the structure described is the Duodenum, not the Ascending colon."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-jejunum",
        "term": "Jejunum",
        "prompt": "The middle segment of the small intestine, primarily responsible for nutrient absorption.",
        "concept": "Abdominal Organs",
        "options": [
          "Sigmoid colon",
          "Gallbladder",
          "Jejunum",
          "Cecum"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Jejunum, not the Sigmoid colon.",
          "Incorrect—the structure described is the Jejunum, not the Gallbladder.",
          "Correct—this is the Jejunum.",
          "Incorrect—the structure described is the Jejunum, not the Cecum."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-ileum",
        "term": "Ileum",
        "prompt": "The final and longest segment of the small intestine, ending at the ileocecal valve.",
        "concept": "Abdominal Organs",
        "options": [
          "Cecum",
          "Sigmoid colon",
          "Jejunum",
          "Ileum"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Ileum, not the Cecum.",
          "Incorrect—the structure described is the Ileum, not the Sigmoid colon.",
          "Incorrect—the structure described is the Ileum, not the Jejunum.",
          "Correct—this is the Ileum."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-cecum",
        "term": "Cecum",
        "prompt": "The pouch at the beginning of the large intestine, where the small intestine joins the colon.",
        "concept": "Abdominal Organs",
        "options": [
          "Cecum",
          "Stomach",
          "Appendix",
          "Quadrate lobe"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Cecum.",
          "Incorrect—the structure described is the Cecum, not the Stomach.",
          "Incorrect—the structure described is the Cecum, not the Appendix.",
          "Incorrect—the structure described is the Cecum, not the Quadrate lobe."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-appendix",
        "term": "Appendix",
        "prompt": "A narrow, finger-like tube attached to the cecum, containing lymphoid tissue.",
        "concept": "Abdominal Organs",
        "options": [
          "Ileum",
          "Ascending colon",
          "Spleen",
          "Appendix"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Appendix, not the Ileum.",
          "Incorrect—the structure described is the Appendix, not the Ascending colon.",
          "Incorrect—the structure described is the Appendix, not the Spleen.",
          "Correct—this is the Appendix."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-ascending-colon",
        "term": "Ascending colon",
        "prompt": "The segment of the large intestine that runs up the right side of the abdomen from the cecum.",
        "concept": "Abdominal Organs",
        "options": [
          "Ascending colon",
          "Ileum",
          "Cecum",
          "Descending colon"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Ascending colon.",
          "Incorrect—the structure described is the Ascending colon, not the Ileum.",
          "Incorrect—the structure described is the Ascending colon, not the Cecum.",
          "Incorrect—the structure described is the Ascending colon, not the Descending colon."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-transverse-colon",
        "term": "Transverse colon",
        "prompt": "The segment of the large intestine that crosses the abdomen from right to left.",
        "concept": "Abdominal Organs",
        "options": [
          "Descending colon",
          "Transverse colon",
          "Caudate lobe",
          "Appendix"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Transverse colon, not the Descending colon.",
          "Correct—this is the Transverse colon.",
          "Incorrect—the structure described is the Transverse colon, not the Caudate lobe.",
          "Incorrect—the structure described is the Transverse colon, not the Appendix."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-descending-colon",
        "term": "Descending colon",
        "prompt": "The segment of the large intestine that runs down the left side of the abdomen.",
        "concept": "Abdominal Organs",
        "options": [
          "Sigmoid colon",
          "Spleen",
          "Descending colon",
          "Pancreas"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Descending colon, not the Sigmoid colon.",
          "Incorrect—the structure described is the Descending colon, not the Spleen.",
          "Correct—this is the Descending colon.",
          "Incorrect—the structure described is the Descending colon, not the Pancreas."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-sigmoid-colon",
        "term": "Sigmoid colon",
        "prompt": "The S-shaped segment of the large intestine that connects the descending colon to the rectum.",
        "concept": "Abdominal Organs",
        "options": [
          "Right lobe",
          "Sigmoid colon",
          "Pancreas",
          "Quadrate lobe"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Sigmoid colon, not the Right lobe.",
          "Correct—this is the Sigmoid colon.",
          "Incorrect—the structure described is the Sigmoid colon, not the Pancreas.",
          "Incorrect—the structure described is the Sigmoid colon, not the Quadrate lobe."
        ]
      },
      {
        "id": "af-abdomen-pelvis-abdominal-organs-rectum",
        "term": "Rectum",
        "prompt": "The final straight segment of the large intestine, storing feces before elimination.",
        "concept": "Abdominal Organs",
        "options": [
          "Rectum",
          "Transverse colon",
          "Pancreas",
          "Quadrate lobe"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Rectum.",
          "Incorrect—the structure described is the Rectum, not the Transverse colon.",
          "Incorrect—the structure described is the Rectum, not the Pancreas.",
          "Incorrect—the structure described is the Rectum, not the Quadrate lobe."
        ]
      },
      {
        "id": "af-abdomen-pelvis-kidneys-kidney",
        "term": "Kidney",
        "prompt": "One of a pair of bean-shaped organs that filter blood to form urine and regulate fluid and electrolyte balance.",
        "concept": "Kidneys",
        "options": [
          "Renal artery",
          "Renal vein",
          "Kidney",
          "Renal pyramid"
        ],
        "correctIndex": 2,
        "optionExplanations": [
          "Incorrect—the structure described is the Kidney, not the Renal artery.",
          "Incorrect—the structure described is the Kidney, not the Renal vein.",
          "Correct—this is the Kidney.",
          "Incorrect—the structure described is the Kidney, not the Renal pyramid."
        ]
      },
      {
        "id": "af-abdomen-pelvis-kidneys-renal-cortex",
        "term": "Renal cortex",
        "prompt": "The outer region of the kidney, containing the filtering units called nephrons.",
        "concept": "Kidneys",
        "options": [
          "Renal cortex",
          "Renal pyramid",
          "Renal vein",
          "Renal artery"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Renal cortex.",
          "Incorrect—the structure described is the Renal cortex, not the Renal pyramid.",
          "Incorrect—the structure described is the Renal cortex, not the Renal vein.",
          "Incorrect—the structure described is the Renal cortex, not the Renal artery."
        ]
      },
      {
        "id": "af-abdomen-pelvis-kidneys-renal-medulla",
        "term": "Renal medulla",
        "prompt": "The inner region of the kidney, containing renal pyramids that concentrate urine.",
        "concept": "Kidneys",
        "options": [
          "Renal medulla",
          "Ureter",
          "Kidney",
          "Renal cortex"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Renal medulla.",
          "Incorrect—the structure described is the Renal medulla, not the Ureter.",
          "Incorrect—the structure described is the Renal medulla, not the Kidney.",
          "Incorrect—the structure described is the Renal medulla, not the Renal cortex."
        ]
      },
      {
        "id": "af-abdomen-pelvis-kidneys-renal-pyramid",
        "term": "Renal pyramid",
        "prompt": "A cone-shaped structure in the renal medulla that channels urine toward the renal pelvis.",
        "concept": "Kidneys",
        "options": [
          "Renal pyramid",
          "Ureter",
          "Renal pelvis",
          "Renal artery"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Renal pyramid.",
          "Incorrect—the structure described is the Renal pyramid, not the Ureter.",
          "Incorrect—the structure described is the Renal pyramid, not the Renal pelvis.",
          "Incorrect—the structure described is the Renal pyramid, not the Renal artery."
        ]
      },
      {
        "id": "af-abdomen-pelvis-kidneys-renal-pelvis",
        "term": "Renal pelvis",
        "prompt": "The funnel-shaped structure that collects urine from the renal pyramids before it drains into the ureter.",
        "concept": "Kidneys",
        "options": [
          "Renal pyramid",
          "Ureter",
          "Adrenal gland",
          "Renal pelvis"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Renal pelvis, not the Renal pyramid.",
          "Incorrect—the structure described is the Renal pelvis, not the Ureter.",
          "Incorrect—the structure described is the Renal pelvis, not the Adrenal gland.",
          "Correct—this is the Renal pelvis."
        ]
      },
      {
        "id": "af-abdomen-pelvis-kidneys-ureter",
        "term": "Ureter",
        "prompt": "The tube that carries urine from the kidney to the bladder.",
        "concept": "Kidneys",
        "options": [
          "Renal pyramid",
          "Kidney",
          "Renal artery",
          "Ureter"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Ureter, not the Renal pyramid.",
          "Incorrect—the structure described is the Ureter, not the Kidney.",
          "Incorrect—the structure described is the Ureter, not the Renal artery.",
          "Correct—this is the Ureter."
        ]
      },
      {
        "id": "af-abdomen-pelvis-kidneys-renal-artery",
        "term": "Renal artery",
        "prompt": "The vessel that carries oxygenated blood from the aorta into the kidney.",
        "concept": "Kidneys",
        "options": [
          "Renal medulla",
          "Renal artery",
          "Adrenal gland",
          "Renal cortex"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Renal artery, not the Renal medulla.",
          "Correct—this is the Renal artery.",
          "Incorrect—the structure described is the Renal artery, not the Adrenal gland.",
          "Incorrect—the structure described is the Renal artery, not the Renal cortex."
        ]
      },
      {
        "id": "af-abdomen-pelvis-kidneys-renal-vein",
        "term": "Renal vein",
        "prompt": "The vessel that carries filtered blood from the kidney to the inferior vena cava.",
        "concept": "Kidneys",
        "options": [
          "Renal cortex",
          "Renal vein",
          "Renal medulla",
          "Ureter"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Renal vein, not the Renal cortex.",
          "Correct—this is the Renal vein.",
          "Incorrect—the structure described is the Renal vein, not the Renal medulla.",
          "Incorrect—the structure described is the Renal vein, not the Ureter."
        ]
      },
      {
        "id": "af-abdomen-pelvis-kidneys-adrenal-gland",
        "term": "Adrenal gland",
        "prompt": "An endocrine gland sitting atop each kidney that produces hormones such as cortisol and adrenaline.",
        "concept": "Kidneys",
        "options": [
          "Renal artery",
          "Adrenal gland",
          "Ureter",
          "Kidney"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Adrenal gland, not the Renal artery.",
          "Correct—this is the Adrenal gland.",
          "Incorrect—the structure described is the Adrenal gland, not the Ureter.",
          "Incorrect—the structure described is the Adrenal gland, not the Kidney."
        ]
      },
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
        ]
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
      },
      {
        "id": "af-abdomen-pelvis-pelvis-pubic-symphysis",
        "term": "Pubic symphysis",
        "prompt": "The cartilaginous joint that unites the left and right pubic bones at the midline.",
        "concept": "Pelvis",
        "options": [
          "Acetabulum",
          "Ischium",
          "Ilium",
          "Pubic symphysis"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Pubic symphysis, not the Acetabulum.",
          "Incorrect—the structure described is the Pubic symphysis, not the Ischium.",
          "Incorrect—the structure described is the Pubic symphysis, not the Ilium.",
          "Correct—this is the Pubic symphysis."
        ]
      },
      {
        "id": "af-abdomen-pelvis-pelvis-sacroiliac-joint",
        "term": "Sacroiliac joint",
        "prompt": "The joint between the sacrum and the ilium that transfers weight between the spine and lower limbs.",
        "concept": "Pelvis",
        "options": [
          "Ilium",
          "Ischial tuberosity",
          "Acetabulum",
          "Sacroiliac joint"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Sacroiliac joint, not the Ilium.",
          "Incorrect—the structure described is the Sacroiliac joint, not the Ischial tuberosity.",
          "Incorrect—the structure described is the Sacroiliac joint, not the Acetabulum.",
          "Correct—this is the Sacroiliac joint."
        ]
      },
      {
        "id": "af-abdomen-pelvis-pelvis-ischial-tuberosity",
        "term": "Ischial tuberosity",
        "prompt": "The bony prominence of the ischium that bears weight when sitting, also called the 'sit bone.'",
        "concept": "Pelvis",
        "options": [
          "Pubic symphysis",
          "Ischial tuberosity",
          "Ilium",
          "Obturator foramen"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Ischial tuberosity, not the Pubic symphysis.",
          "Correct—this is the Ischial tuberosity.",
          "Incorrect—the structure described is the Ischial tuberosity, not the Ilium.",
          "Incorrect—the structure described is the Ischial tuberosity, not the Obturator foramen."
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      },
      {
        "id": "af-head-neck-skull-bones-ethmoid",
        "term": "Ethmoid",
        "prompt": "A small bone between the nasal cavity and the orbits that contributes to the nasal septum and orbital walls.",
        "concept": "Skull Bones",
        "options": [
          "Parietal bone",
          "Ethmoid",
          "Frontal bone",
          "Occipital bone"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Ethmoid, not the Parietal bone.",
          "Correct—this is the Ethmoid.",
          "Incorrect—the structure described is the Ethmoid, not the Frontal bone.",
          "Incorrect—the structure described is the Ethmoid, not the Occipital bone."
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      },
      {
        "id": "af-head-neck-landmarks-optic-canal",
        "term": "Optic canal",
        "prompt": "The opening in the sphenoid bone through which the optic nerve and ophthalmic artery pass.",
        "concept": "Important Landmarks",
        "options": [
          "Optic canal",
          "Superior orbital fissure",
          "Foramen ovale",
          "Foramen magnum"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Optic canal.",
          "Incorrect—the structure described is the Optic canal, not the Superior orbital fissure.",
          "Incorrect—the structure described is the Optic canal, not the Foramen ovale.",
          "Incorrect—the structure described is the Optic canal, not the Foramen magnum."
        ]
      },
      {
        "id": "af-head-neck-landmarks-superior-orbital-fissure",
        "term": "Superior orbital fissure",
        "prompt": "A gap between the sphenoid bone's wings that transmits nerves and vessels to structures around the eye.",
        "concept": "Important Landmarks",
        "options": [
          "Superior orbital fissure",
          "Foramen magnum",
          "Optic canal",
          "Foramen rotundum"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Superior orbital fissure.",
          "Incorrect—the structure described is the Superior orbital fissure, not the Foramen magnum.",
          "Incorrect—the structure described is the Superior orbital fissure, not the Optic canal.",
          "Incorrect—the structure described is the Superior orbital fissure, not the Foramen rotundum."
        ]
      },
      {
        "id": "af-head-neck-landmarks-foramen-ovale",
        "term": "Foramen ovale",
        "prompt": "An opening in the sphenoid bone that transmits the mandibular branch of the trigeminal nerve.",
        "concept": "Important Landmarks",
        "options": [
          "Foramen ovale",
          "Optic canal",
          "Foramen magnum",
          "External acoustic meatus"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Foramen ovale.",
          "Incorrect—the structure described is the Foramen ovale, not the Optic canal.",
          "Incorrect—the structure described is the Foramen ovale, not the Foramen magnum.",
          "Incorrect—the structure described is the Foramen ovale, not the External acoustic meatus."
        ]
      },
      {
        "id": "af-head-neck-landmarks-foramen-rotundum",
        "term": "Foramen rotundum",
        "prompt": "An opening in the sphenoid bone that transmits the maxillary branch of the trigeminal nerve.",
        "concept": "Important Landmarks",
        "options": [
          "Foramen rotundum",
          "Optic canal",
          "Foramen ovale",
          "External acoustic meatus"
        ],
        "correctIndex": 0,
        "optionExplanations": [
          "Correct—this is the Foramen rotundum.",
          "Incorrect—the structure described is the Foramen rotundum, not the Optic canal.",
          "Incorrect—the structure described is the Foramen rotundum, not the Foramen ovale.",
          "Incorrect—the structure described is the Foramen rotundum, not the External acoustic meatus."
        ]
      },
      {
        "id": "af-head-neck-landmarks-jugular-foramen",
        "term": "Jugular foramen",
        "prompt": "An opening between the temporal and occipital bones that transmits the internal jugular vein and several cranial nerves.",
        "concept": "Important Landmarks",
        "options": [
          "Foramen rotundum",
          "Optic canal",
          "Foramen ovale",
          "Jugular foramen"
        ],
        "correctIndex": 3,
        "optionExplanations": [
          "Incorrect—the structure described is the Jugular foramen, not the Foramen rotundum.",
          "Incorrect—the structure described is the Jugular foramen, not the Optic canal.",
          "Incorrect—the structure described is the Jugular foramen, not the Foramen ovale.",
          "Correct—this is the Jugular foramen."
        ]
      },
      {
        "id": "af-head-neck-landmarks-carotid-canal",
        "term": "Carotid canal",
        "prompt": "A canal in the temporal bone through which the internal carotid artery enters the skull.",
        "concept": "Important Landmarks",
        "options": [
          "Foramen ovale",
          "Carotid canal",
          "Foramen rotundum",
          "Foramen magnum"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the Carotid canal, not the Foramen ovale.",
          "Correct—this is the Carotid canal.",
          "Incorrect—the structure described is the Carotid canal, not the Foramen rotundum.",
          "Incorrect—the structure described is the Carotid canal, not the Foramen magnum."
        ]
      },
      {
        "id": "af-head-neck-landmarks-external-acoustic-meatus",
        "term": "External acoustic meatus",
        "prompt": "The canal in the temporal bone leading from the outer ear to the eardrum.",
        "concept": "Important Landmarks",
        "options": [
          "Carotid canal",
          "External acoustic meatus",
          "Foramen magnum",
          "Foramen ovale"
        ],
        "correctIndex": 1,
        "optionExplanations": [
          "Incorrect—the structure described is the External acoustic meatus, not the Carotid canal.",
          "Correct—this is the External acoustic meatus.",
          "Incorrect—the structure described is the External acoustic meatus, not the Foramen magnum.",
          "Incorrect—the structure described is the External acoustic meatus, not the Foramen ovale."
        ]
      }
    ]
  }
];

export function findAnatomyFlashcardSection(sectionId: string): AnatomyFlashcardSection | undefined {
  return anatomyFlashcardSections.find(s => s.id === sectionId);
}
