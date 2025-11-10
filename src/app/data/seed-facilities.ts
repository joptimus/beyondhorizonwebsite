// File: src/app/data/seed-facilities.ts
import { Facility } from '../models/catalog.models';

export const FACILITIES: Facility[] = [
  {
    id: 'cxw-2-depot',
    series: 'CX',
    code: 'CXW-2',
    name: 'Depot',
    role: 'Orbital warehouse',
    summary: 'High-throughput orbital storage and distribution.',
    description: 'Tethered silos and magline racks buffer sector logistics under Voran custody.',
    tags: ['warehouse','logistics'],
    subtype: 'warehouse',
    specs: { capacity: '12.4 Mm³', berths: 12 }
  },
  {
    id: 'bx-9-citadel',
    series: 'BX',
    code: 'BX-9',
    name: 'Citadel',
    role: 'Sector command fortress',
    summary: 'Immovable command lattice, anchor of regional control.',
    description: 'Command spires, deep armor caverns, and fleet-grade arrays fortify sector ops.',
    tags: ['station','command'],
    subtype: 'station',
    specs: { batteries: 48, docks: 22, crew: 18000 }
  },
  {
    id: 'bxg-9-relay-nexus',
    series: 'BX',
    code: 'BXG-9',
    name: 'Relay Nexus',
    role: 'Strategic Jump Interface',
    summary: 'Fleet-scale synchronization for hyperspace projection beyond normal range.',
    description: 'Quantum-phased arches bind outgoing vectors, bending the corridor into compliant geometry.',
    tags: ['gate','jump','navigation'],
    subtype: 'gate',
    specs: { span: '3.2 km', concurrency: '8 lanes', throughput: 'fleet' }
  },
  {
    id: 'exf-9-titan-forge',
    series: 'EX',
    code: 'EXF-9',
    name: 'Titan Forge',
    role: 'Massive orbital foundry complex',
    summary: 'Where Voran bends stars into steel.',
    description: 'Macro crucibles and autonomous mills assemble hull macros for VX lines.',
    tags: ['factory','engineering'],
    subtype: 'factory',
    specs: { output: '4 hulls/day', power: 'VXG-2 tether' }
  },
  {
    id: 'mx-2-sanctum',
    series: 'MX',
    code: 'MX-2',
    name: 'Sanctum',
    role: 'Standard medical facility',
    summary: 'Trauma isolation and augmentation clinics.',
    description: 'Sterile corridors and bio-shield suites salvage the irreplaceable.',
    tags: ['medical','recovery'],
    subtype: 'medical',
    specs: { beds: 620, theaters: 18 }
  },
  {
    id: 'hx-1-habspire',
    series: 'HX',
    code: 'HX-1',
    name: 'Habspire',
    role: 'Vertical housing complex',
    summary: 'Civil tiers under corporate protection.',
    description: 'Arcology plates feed, house, and indoctrinate the workforce.',
    tags: ['habitation','civilian'],
    subtype: 'habitation',
    specs: { population: 120000, tiers: 64 }
  }
];
