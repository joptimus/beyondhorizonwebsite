// File: src/app/features/codex/codex-detail.page.ts
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonButtons, IonButton } from '@ionic/angular/standalone';

import { SHIPS } from '../../../data/seed-ships';
import { FACILITIES } from '../../../data/seed-facilities';
import { CX_ASSETS } from '../../../data/seed-cx';

import {
  CatalogEntityBase,
  Ship,
  Facility
} from '../../../models/catalog.models';

import { VdsBadgeComponent } from '../../../components/vds-badge/vds-badge.component';
import { VdsSpecGridComponent } from '../../../components/vds-spec-grid/vds-spec-grid.component';
import { ModelViewerComponent } from 'src/app/component/model-viewer/model-viewer.component';

type CodexEntity = CatalogEntityBase | Ship | Facility;

@Component({
  standalone: true,
  selector: 'app-codex-detail',
  imports: [
    IonContent,
    IonButtons,
    IonButton,
    CommonModule,
    RouterLink,
    VdsBadgeComponent,
    VdsSpecGridComponent,
    ModelViewerComponent
  ],
  templateUrl: './codex-detail.page.html',
  styleUrls: ['./codex-detail.page.scss']
})
export class CodexDetailPage {
  private id = signal<string>('');

  entity = computed<CodexEntity | undefined>(() => {
    const targetId = this.id();
    if (!targetId) return undefined;

    return (
      SHIPS.find(s => s.id === targetId) ||
      FACILITIES.find(f => f.id === targetId) ||
      CX_ASSETS.find(c => c.id === targetId)
    );
  });

  isShip = computed<boolean>(() => {
    const e = this.entity();
    return !!e && (e as any).isShip === true;
  });

  specs = computed<Record<string, string | number>>(() => {
    const e = this.entity();
    if (!e) return {};

    const isShip = (e as any).isShip === true;

    const specs: Record<string, string | number> = {
      'Unit Type': e.unitType,
      'Size': e.size,
      'Hull': e.baseHealth,
      'Shield': e.baseShield,
      'Weapon Slots': e.weaponSlots,
      'Crew Required': e.staffRequired,
      'Housing': e.totalHousing,
      'Speed': e.speed,
      'Hyperspace': e.hyperspace,
      'Atmospheric': e.atmospheric ? 'Yes' : 'No',
      'Shield Type': e.shieldType,
      'Tech Tier': e.techTier,
      'Resource Capacity': e.resourceCapacity,
      'Dock Capacity': e.dockCapacity,
      'Energy Produced': e.baseEnergyProduced,
      'Energy Used': e.baseEnergyUsed,
      'Requires Power': e.requiresPower ? 'Yes' : 'No',
      'Provides Power': e.providesPower,
      'Provides Storage': e.providesStorage,
      'Construction Cost': e.constructionCost,
      'Development Cost': e.developmentCost
    };

    if (isShip) {
      const ship = e as Ship;
      specs['Class'] = ship.class;
      if (ship.line) {
        specs['Line'] = ship.line;
      }
    }

    // Strip zero values so the grid doesn’t get noisy
    Object.keys(specs).forEach(key => {
      const v = specs[key];
      if (typeof v === 'number' && v === 0) {
        delete specs[key];
      }
    });

    return specs;
  });

  constructor(route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get('id') || '';
    this.id.set(id);
  }
}
