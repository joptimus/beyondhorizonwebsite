// File: src/app/models/catalog.models.ts
export type SeriesCode = 'VX' | 'CX' | 'BX' | 'EX' | 'MX' | 'HX';

export interface CatalogEntityBase {
  id: string;               // kebab-case, e.g., 'vx-5-bastion'
  series: SeriesCode;       // 'VX' | 'CX' | ...
  code: string;             // 'VX-5'
  name: string;             // 'Bastion'
  role: string;             // 'Defensive escort carrier'
  summary: string;          // short codex line
  description: string;      // concise but atmospheric
  tags: string[];           // ['carrier', 'escort', ...]
  specs?: Record<string, string | number>;
  media?: { poster?: string; icon?: string };
}

export interface Ship extends CatalogEntityBase {
  class: 'frigate'|'destroyer'|'battleship'|'dreadnought'|'carrier'|'other';
  line?: string;            // 'VX-5 Carrier Line'
}

export interface Facility extends CatalogEntityBase {
  subtype: 'station'|'base'|'gate'|'warehouse'|'factory'|'medical'|'habitation'|'power';
}

export interface City extends CatalogEntityBase {
  population?: number;
  world?: string;
}
