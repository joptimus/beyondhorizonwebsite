// File: src/app/data/seed-cx.ts
import { CatalogEntityBase } from '../models/catalog.models';

export const CX_ASSETS: CatalogEntityBase[] = [
  {
    id: 'cx-7a-haulbreaker',
    series: 'CX',
    code: 'CX-7A',
    name: 'Haulbreaker',
    role: 'Frontier cargo hauler',
    summary: 'Rugged deep-space freighter for outer routes.',
    description: 'Reinforced truss bays and modular containers for unreliable corridors.',
    tags: ['cargo','frontier']
  },
  {
    id: 'cx-7d-goldreach',
    series: 'CX',
    code: 'CX-7D',
    name: 'Goldreach',
    role: 'Strategic cargo vessel',
    summary: 'High-value logistics and luxury materials.',
    description: 'Escort-rated cargo spines and vault-tier holds.',
    tags: ['cargo','strategic']
  }
];
