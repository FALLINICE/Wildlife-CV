import { SpeciesMetadata } from '../types/api';

export const SPECIES_DATABASE: Record<string, SpeciesMetadata> = {
  diceros_bicornis: {
    id: 'diceros_bicornis',
    scientificName: 'Diceros bicornis',
    commonName: 'Black Rhinoceros',
    category: 'Mammalia / Perissodactyla',
    conservationStatus: 'Critically Endangered',
    statusColor: 'bg-red-900/60 text-red-300 border-red-700/50',
    habitat: 'Arid scrubland, savanna, desert edge (Namib)',
    description: 'A browser species distinguished by a hooked upper lip. Targeted heavily by poaching, black rhinos in northern Namibia are key indicators of desert ecosystem health.',
    sampleImageUrl: '/assets/species/diceros_bicornis.jpg'
  },
  equus_zebra_hartmannae: {
    id: 'equus_zebra_hartmannae',
    scientificName: "Equus zebra hartmannae",
    commonName: "Hartmann's Mountain Zebra",
    category: 'Mammalia / Perissodactyla',
    conservationStatus: 'Vulnerable',
    statusColor: 'bg-amber-900/60 text-amber-300 border-amber-700/50',
    habitat: 'Rugged mountainous terrain and escarpments',
    description: 'Characterized by vertical stripes on the neck and torso with horizontal stripes on the hindquarters and a distinct dewlap on the throat.',
    sampleImageUrl: '/assets/species/equus_zebra_hartmannae.jpg'
  },
  oryx_gazella: {
    id: 'oryx_gazella',
    scientificName: 'Oryx gazella',
    commonName: 'Gemsbok / Oryx',
    category: 'Mammalia / Artiodactyla',
    conservationStatus: 'Least Concern',
    statusColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
    habitat: 'Arid dunes, gravel plains, and open savanna',
    description: 'Iconic large antelope with striking black-and-white facial markings and long, spear-like horns. Remarkable physiological adaptations to desert heat.',
    sampleImageUrl: '/assets/species/oryx_gazella.jpg'
  },
  antidorcas_marsupialis: {
    id: 'antidorcas_marsupialis',
    scientificName: 'Antidorcas marsupialis',
    commonName: 'Springbok',
    category: 'Mammalia / Artiodactyla',
    conservationStatus: 'Least Concern',
    statusColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
    habitat: 'Dry open plains and semi-arid grasslands',
    description: 'Medium-sized gazelle-like antelope famed for "pronking" — high vertical leaps into the air. Key herbivore species in southern African dry ecosystems.',
    sampleImageUrl: '/assets/species/antidorcas_marsupialis.jpg'
  },
  panthera_leo: {
    id: 'panthera_leo',
    scientificName: 'Panthera leo',
    commonName: 'African Lion',
    category: 'Mammalia / Carnivora',
    conservationStatus: 'Vulnerable',
    statusColor: 'bg-amber-900/60 text-amber-300 border-amber-700/50',
    habitat: 'Savanna grasslands, desert riverbeds, open woodland',
    description: 'Apex predator. Desert-adapted populations in Namibia range widely across ephemeral rivers, preying on gemsbok, ostrich, and mountain zebra.',
    sampleImageUrl: '/assets/species/panthera_leo.jpg'
  },
  hyaena_brunnea: {
    id: 'hyaena_brunnea',
    scientificName: 'Hyaena brunnea',
    commonName: 'Brown Hyena',
    category: 'Mammalia / Carnivora',
    conservationStatus: 'Near Threatened',
    statusColor: 'bg-yellow-900/60 text-yellow-300 border-yellow-700/50',
    habitat: 'Arid desert, coastal beaches, dry scrubland',
    description: 'Shaggy, dark brown coat with pointed ears and striped legs. Solitary nocturnal scavenger adapted to extreme desert conditions and coastal marine debris.',
    sampleImageUrl: '/assets/species/hyaena_brunnea.jpg'
  },
  giraffa_camelopardalis: {
    id: 'giraffa_camelopardalis',
    scientificName: 'Giraffa camelopardalis',
    commonName: 'Giraffe',
    category: 'Mammalia / Artiodactyla',
    conservationStatus: 'Vulnerable',
    statusColor: 'bg-amber-900/60 text-amber-300 border-amber-700/50',
    habitat: 'Dry woodland, riverine forests, open bush savanna',
    description: 'The world tallest land mammal. Browses high canopy acacia trees, playing a vital ecological role in seed dispersal and vegetation pruning.',
    sampleImageUrl: '/assets/species/giraffa_camelopardalis.jpg'
  },
  loxodanta_africana: {
    id: 'loxodanta_africana',
    scientificName: 'Loxodonta africana',
    commonName: 'African Bush Elephant',
    category: 'Mammalia / Proboscidea',
    conservationStatus: 'Vulnerable',
    statusColor: 'bg-amber-900/60 text-amber-300 border-amber-700/50',
    habitat: 'Savanna, dry river valleys, bushland',
    description: 'Earth’s largest terrestrial animal. Desert elephants travel vast distances between water holes, excavating dry riverbeds and shaping habitat.',
    sampleImageUrl: '/assets/species/loxodanta_africana.jpg'
  },
  canis_mesomelas: {
    id: 'canis_mesomelas',
    scientificName: 'Canis mesomelas',
    commonName: 'Black-backed Jackal',
    category: 'Mammalia / Carnivora',
    conservationStatus: 'Least Concern',
    statusColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
    habitat: 'Open grassland, desert plains, coastal seals colonies',
    description: 'Adaptable mesopredator recognized by its reddish-brown coat and silver-black saddle across its back. Opportunistic feeder and skilled hunter.',
    sampleImageUrl: '/assets/species/canis_mesomelas.jpg'
  },
  struthio_camelus: {
    id: 'struthio_camelus',
    scientificName: 'Struthio camelus',
    commonName: 'Common Ostrich',
    category: 'Aves / Struthioniformes',
    conservationStatus: 'Least Concern',
    statusColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
    habitat: 'Arid open plains, semi-desert, savanna',
    description: 'Largest living bird species. Flightless runner capable of reaching speeds over 70 km/h, well suited for desert environmental extremes.',
    sampleImageUrl: '/assets/species/struthio_camelus.jpg'
  }
};

export const getSpeciesMeta = (rawSpeciesId: string): SpeciesMetadata => {
  const normalizedKey = rawSpeciesId.toLowerCase().trim();
  if (SPECIES_DATABASE[normalizedKey]) {
    return SPECIES_DATABASE[normalizedKey];
  }

  // Fallback formatting for unexpected species key
  const formattedName = rawSpeciesId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    id: rawSpeciesId,
    scientificName: formattedName,
    commonName: formattedName,
    category: 'Mammalia / Wildlife',
    conservationStatus: 'Least Concern',
    statusColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
    habitat: 'Namibian Camera Trap Research Site',
    description: `Target species ${formattedName} detected in field camera trap footage.`,
    sampleImageUrl: '/assets/species/diceros_bicornis.jpg'
  };
};
