import { PredictionResponse } from '../types/api';

export const MOCK_RESPONSES: Record<string, PredictionResponse> = {
  diceros_bicornis: {
    species: "diceros_bicornis",
    confidence: 0.9342,
    review_needed: false,
    description: "Diceros bicornis, commonly known as the Black Rhinoceros or hook-lipped rhino, is a critically endangered species native to eastern and southern Africa. Desert-adapted populations in Namibia inhabit severe arid environments, traveling great distances between water holes. Adults possess two horns made of keratin, a hooked prehensile upper lip suited for browsing acacia thorn scrub, and a solitary social structure.",
    explanation: "The YOLOv11 classifier identified high-confidence morphological traits consistent with Diceros bicornis (Black Rhinoceros), including the characteristic pointed prehensile upper lip, robust shoulder hump, and distinctive dual facial horn structure. Signal clarity in the camera trap image was high, with low background occlusion. The RAG knowledge base confirms that this individual aligns with tracked Namib desert-adapted black rhino territory near ephemeral riverbeds.",
    alternative_candidates: []
  },
  diceros_bicornis_low_conf: {
    species: "diceros_bicornis",
    confidence: 0.7321,
    review_needed: true,
    description: "Diceros bicornis (Black Rhinoceros) is a critically endangered browser species. Low light or motion blur in camera traps can cause visual overlap with large herbivores like elephants or zebras.",
    explanation: "The classification model detected key body contours of Diceros bicornis, but the prediction confidence (73.21%) falls below the strict human review threshold (85.00%). Infrared motion blur and dense acacia bush shadows partially obscure the head region, rendering prehensile lip verification ambiguous. Field verification by a conservation specialist is recommended before logging this record into the census.",
    alternative_candidates: [
      { species: "diceros_bicornis", confidence: 0.7321 },
      { species: "loxodanta_africana", confidence: 0.1840 },
      { species: "equus_zebra_hartmannae", confidence: 0.0615 }
    ]
  },
  panthera_leo: {
    species: "panthera_leo",
    confidence: 0.9128,
    review_needed: false,
    description: "Panthera leo (African Lion) is an apex carnivore. In Northern Namibia, desert-dwelling lions roam vast territories across sandy river courses, preying predominantly on gemsbok, ostrich, and mountain zebras. They exhibit exceptional thermoregulation and endurance in extreme heat.",
    explanation: "High confidence classification (91.28%). The model detected distinct tawny pelage, muscular forequarters, broad facial structure, and dark tail tuft characteristic of Panthera leo. RAG retrieval highlights that desert lion prides in this grid exhibit wide home ranges, and nighttime camera trap activation matches expected nocturnal movement corridors.",
    alternative_candidates: []
  },
  equus_zebra_hartmannae: {
    species: "equus_zebra_hartmannae",
    confidence: 0.9584,
    review_needed: false,
    description: "Equus zebra hartmannae (Hartmann's Mountain Zebra) is a vulnerable equid subspecies endemic to the rugged escarpments of Namibia. Features narrow, unstriped white belly with a distinct throat dewlap.",
    explanation: "The image classification model achieved 95.84% confidence. Sharp striping patterns down to the hooves and the presence of a throat dewlap clearly distinguish this specimen as Equus zebra hartmannae. No review required.",
    alternative_candidates: []
  },
  oryx_gazella: {
    species: "oryx_gazella",
    confidence: 0.8875,
    review_needed: false,
    description: "Oryx gazella (Gemsbok) is a large desert-adapted antelope with long V-shaped horns, pale grey coat, and bold black markings along the legs and face. Highly resilient to dehydration.",
    explanation: "Model identified prominent spear-like horns and facial mask geometry with 88.75% confidence. Grounded RAG analysis confirms typical daytime foraging behavior in gravel desert plains.",
    alternative_candidates: []
  },
  antidorcas_marsupialis: {
    species: "antidorcas_marsupialis",
    confidence: 0.9210,
    review_needed: false,
    description: "Antidorcas marsupialis (Springbok) is a medium gazelle known for its white face with dark stripe running from eye to mouth, lyre-shaped horns, and dorsal pocket of white hair.",
    explanation: "YOLOv11 identified the slender bodily outline and facial side-stripe with 92.10% confidence. High clarity image capture across open scrub terrain.",
    alternative_candidates: []
  },
  hyaena_brunnea: {
    species: "hyaena_brunnea",
    confidence: 0.8140,
    review_needed: true,
    description: "Hyaena brunnea (Brown Hyena) is a near-threatened nocturnal scavenger with a shaggy dark coat and pointed ears. Inhabits arid Namib coastal desert zones.",
    explanation: "Confidence score (81.40%) is slightly below the 85% safety threshold due to nighttime infrared shadow effects on the shaggy coat texture. Surfaced alternative candidates include Black-backed Jackal due to shared dark torso markings in night vision mode.",
    alternative_candidates: [
      { species: "hyaena_brunnea", confidence: 0.8140 },
      { species: "canis_mesomelas", confidence: 0.1230 },
      { species: "panthera_leo", confidence: 0.0450 }
    ]
  },
  giraffa_camelopardalis: {
    species: "giraffa_camelopardalis",
    confidence: 0.9650,
    review_needed: false,
    description: "Giraffa camelopardalis (Giraffe) is the tallest land mammal. Namibian dry riverbed populations feed heavily on elevated Acacia tortilis canopies.",
    explanation: "Impeccable detection (96.50%). Extremely distinct neck length and coat reticulation pattern recorded by camera trap sensor.",
    alternative_candidates: []
  },
  loxodanta_africana: {
    species: "loxodanta_africana",
    confidence: 0.9410,
    review_needed: false,
    description: "Loxodonta africana (African Elephant) in desert ecosystems are renowned for long-distance migration tracking seasonal water channels. Large pinnae and trunk enable thermoregulation and foraging.",
    explanation: "High confidence prediction (94.10%). Broad ear canvas and proboscis profile recognized immediately by neural vision backbone.",
    alternative_candidates: []
  },
  canis_mesomelas: {
    species: "canis_mesomelas",
    confidence: 0.8930,
    review_needed: false,
    description: "Canis mesomelas (Black-backed Jackal) is an adaptable canine predator with a silver-black saddle patch running along its back. Highly active at dusk and dawn.",
    explanation: "Classification confidence of 89.30%. Black saddle mantle and rufous side coloration match reference training profiles accurately.",
    alternative_candidates: []
  },
  struthio_camelus: {
    species: "struthio_camelus",
    confidence: 0.9720,
    review_needed: false,
    description: "Struthio camelus (Common Ostrich) is a flightless bird adapted to dry habitats, with powerful long legs and distinctive black/grey feathering.",
    explanation: "Top tier confidence (97.20%). Long neck and feather mass outline leave zero ambiguity in classifier output.",
    alternative_candidates: []
  }
};

export const getMockPrediction = (filename: string): PredictionResponse => {
  const lowerName = filename.toLowerCase();
  
  if (lowerName.includes('rhino') || lowerName.includes('diceros')) {
    if (lowerName.includes('low') || lowerName.includes('blur')) {
      return MOCK_RESPONSES.diceros_bicornis_low_conf;
    }
    return MOCK_RESPONSES.diceros_bicornis;
  }
  if (lowerName.includes('lion') || lowerName.includes('panthera')) return MOCK_RESPONSES.panthera_leo;
  if (lowerName.includes('zebra') || lowerName.includes('equus')) return MOCK_RESPONSES.equus_zebra_hartmannae;
  if (lowerName.includes('oryx') || lowerName.includes('gemsbok')) return MOCK_RESPONSES.oryx_gazella;
  if (lowerName.includes('springbok')) return MOCK_RESPONSES.antidorcas_marsupialis;
  if (lowerName.includes('hyena') || lowerName.includes('hyaena')) return MOCK_RESPONSES.hyaena_brunnea;
  if (lowerName.includes('giraffe')) return MOCK_RESPONSES.giraffa_camelopardalis;
  if (lowerName.includes('elephant') || lowerName.includes('loxodanta')) return MOCK_RESPONSES.loxodanta_africana;
  if (lowerName.includes('jackal') || lowerName.includes('canis')) return MOCK_RESPONSES.canis_mesomelas;
  if (lowerName.includes('ostrich') || lowerName.includes('struthio')) return MOCK_RESPONSES.struthio_camelus;

  // Default return Black Rhino or random high quality response
  const responseKeys = Object.keys(MOCK_RESPONSES);
  const randomKey = responseKeys[Math.floor(Math.random() * responseKeys.length)];
  return MOCK_RESPONSES[randomKey];
};
