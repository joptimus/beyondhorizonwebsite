// File: src/app/models/catalog.models.ts

export type SeriesCode =
  | 'VX'
  | 'CX'
  | 'BX'
  | 'EX'
  | 'MX'
  | 'HX'
  | 'DR';

// Matches UnitType from the DB
export type UnitTypeCode =
  | 'Warehouse'
  | 'ImperialStation'
  | 'Base'
  | 'Headquarters'
  | 'Factory'
  | 'Builder'
  | 'Cargo'
  | 'Generator'
  | 'Harvester'
  | 'Mine'
  | 'HeavyCargo'
  | 'Command Ship'
  | 'Destroyer'
  | 'Frigate'
  | 'Carrier'
  | 'Hospital'
  | 'Battleship'
  | 'ResearchLab'
  | 'CityHall'
  | 'Dreadnought'
  | 'Housing'
  | 'Jumpgate';

export type ShieldTypeCode = 'Light' | 'Medium' | 'Heavy' | 'Super' | 'None';

// From the DB Category column
export type CategoryCode = 'Station' | 'Engine' | 'City';

// Base catalog entity used by ships, facilities, CX cargo, etc.
export interface CatalogEntityBase {
  id: string;               // kebab-case, e.g., 'vx-5-bastion'
  series: SeriesCode;       // 'VX' | 'CX' | ...
  code: string;             // 'VX-5', 'CXW-2', etc.
  name: string;             // display name as in DB (e.g. 'CXW-2 Depot')
  role: string;             // 'Capital line battleship', 'Orbital warehouse', etc.
  summary: string;          // short codex line (first sentence / hook)
  description: string;      // full lore description
  tags: string[];           // ['battleship','warship','command', ...]

  // ---- Raw DB-backed stats (mirror _UnitTemplates_ table) ----
  templateId: number;       // TemplateID
  unitType: UnitTypeCode;   // UnitType
  size: number;             // Size
  baseHealth: number;       // BaseHealth
  baseShield: number;       // BaseShield
  baseEnergyProduced: number; // BaseEnergyProduced
  baseEnergyUsed: number;   // BaseEnergyUsed
  weaponSlots: number;      // WeaponSlots
  staffRequired: number;    // StaffRequired
  totalHousing: number;     // TotalHousing
  speed: number;            // Speed
  atmospheric: boolean;     // Atmospheric
  hyperspace: number;       // Hyperspace
  sellPrice: number;        // SellPrice
  shieldType: ShieldTypeCode; // ShieldType
  techTier: number;         // TechTier
  minShipSize: number;      // MinShipSize
  maxShipSize: number;      // MaxShipSize
  views: number;            // Views
  blurring: number;         // Blurring
  prefabPath: string;       // PrefabPath
  developmentTime: number;  // DevelopmentTime
  constructionTime: number; // ConstructionTime
  constructionCost: number; // ConstructionCost
  developmentCost: number;  // DevelopmentCost
  category: CategoryCode;   // Category
  requiresPower: boolean;   // RequiresPower
  providesPower: number;    // ProvidesPower
  allowsStockLink: boolean; // AllowsStockLink
  providesStorage: number;  // ProvidesStorage
  isShip: boolean;          // IsShip
  resourceCapacity: number; // ResourceCapacity
  dockCapacity: number;     // DockCapacity

  // Optional / shared UI bits
  class?: string;          // ships will set this
  line?: string;           // ships may set this
  specs?: Record<string, string | number>;
  media?: { poster?: string; icon?: string };
}

// Ships now carry all DB fields directly on the entity
export interface Ship extends CatalogEntityBase {
  class: 'frigate' | 'destroyer' | 'battleship' | 'dreadnought' | 'carrier' | 'cargo' | 'command' | 'other';
  line?: string;            // 'VX-6 Battleship Line', etc.
}

// Facilities with DB-backed stats + DB subtype mapping
export interface Facility extends CatalogEntityBase {
  subtype: 'station' | 'base' | 'gate' | 'warehouse' | 'factory' | 'medical' | 'habitation' | 'power';
}

export interface City extends CatalogEntityBase {
  population?: number;
  world?: string;
}
