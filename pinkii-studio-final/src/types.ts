export type WorldId = 'dollhouse' | 'garden' | 'teddy' | 'cafe';

export interface WorldMetadata {
  id: WorldId;
  name: string;
  tagline: string;
  hint: string;
  ambientColor: string;
  fogColor: string;
}

export const WORLDS: Record<WorldId, WorldMetadata> = {
  dollhouse: {
    id: 'dollhouse',
    name: 'Pink Dream Dollhouse',
    tagline: 'A Cozy Sanctuary for Ayra',
    hint: 'Tap the luxury gift or letter on the bedside table',
    ambientColor: '#fff0f5',
    fogColor: '#ffe4ec',
  },
  garden: {
    id: 'garden',
    name: 'Enchanted Midnight Garden',
    tagline: 'Under the Glowing Crescent',
    hint: 'Tap the blue roses to watch them bloom with starlight',
    ambientColor: '#0a0d24',
    fogColor: '#0e1233',
  },
  teddy: {
    id: 'teddy',
    name: 'Teddy Cuddle Room',
    tagline: 'Ayaan & Pinkii Together',
    hint: 'Press "Hug me, jana" for our warm cuddle',
    ambientColor: '#2b1b2f',
    fogColor: '#361d36',
  },
  cafe: {
    id: 'cafe',
    name: 'Little Forever Café',
    tagline: 'Warm Cinnamon & Sweet Latte',
    hint: 'Tap the cups to clink and share a cheers',
    ambientColor: '#2d1f18',
    fogColor: '#3a241b',
  },
};
