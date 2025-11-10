// File: src/app/data/seed-ships.ts
import { Ship } from '../models/catalog.models';

export const SHIPS: Ship[] = [
  {
    id: 'vx-5-warlord',
    series: 'VX',
    code: 'VX-5',
    name: 'Warlord',
    role: 'Assault carrier',
    summary: 'VX-5 line spearhead with rapid strike-wing deployment.',
    description: 'Built to break sieges with relentless strike-craft sorties and hardened flak corridors.',
    tags: ['carrier','assault','hangar'],
    class: 'carrier',
    line: 'VX-5 Carrier Line',
    specs: { displacement: '820,000 t', hangars: 6, hardpoints: 16, crew: 5400 }
  },
  {
    id: 'vx-5-bastion',
    series: 'VX',
    code: 'VX-5',
    name: 'Bastion',
    role: 'Defensive escort carrier',
    summary: 'Guardian of convoys and forward arsenals.',
    description: 'Layered fields, point-defense lattices, and resilient armor make Bastion immovable.',
    tags: ['carrier','escort','pd'],
    class: 'carrier',
    line: 'VX-5 Carrier Line',
    specs: { displacement: '765,000 t', hangars: 4, hardpoints: 14, crew: 4900 }
  },
  {
    id: 'vx-6-helios',
    series: 'VX',
    code: 'VX-6',
    name: 'Helios',
    role: 'Long-range beam battleship',
    summary: 'Precision solar-lance arrays for standoff engagements.',
    description: 'Capacitor spines feed coherent beam lances across astronomical distances.',
    tags: ['battleship','beam','long-range'],
    class: 'battleship',
    specs: { displacement: '1.2 Mt', hardpoints: 24, crew: 6200 }
  },
  {
    id: 'vx-8-nemesis',
    series: 'VX',
    code: 'VX-8',
    name: 'Nemesis',
    role: 'EMP disruption & command interceptor',
    summary: 'Command-grade disruption platform for fleet decapitation.',
    description: 'Pulse inverters nullify hostile nets while spearhead wings isolate command craft.',
    tags: ['dreadnought','emp','command'],
    class: 'dreadnought',
    specs: { displacement: '2.6 Mt', hardpoints: 30, crew: 9800 }
  }
];
