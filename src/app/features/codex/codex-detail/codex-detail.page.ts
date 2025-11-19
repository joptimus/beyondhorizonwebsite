// File: src/app/features/codex/codex-detail.page.ts
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonButtons, IonButton } from '@ionic/angular/standalone';

import { ShipDisplayData, SHIPS } from '../../../data/seed-ships';
import { FACILITIES } from '../../../data/seed-facilities';
import { CX_ASSETS } from '../../../data/seed-cx';

import { CatalogEntityBase } from '../../../models/catalog.models';



import { VdsBadgeComponent } from '../../../components/vds-badge/vds-badge.component';
import { VdsSpecGridComponent } from '../../../components/vds-spec-grid/vds-spec-grid.component';
import { ModelViewerComponent } from 'src/app/component/model-viewer/model-viewer.component';

// Ships use UI-only ShipDisplayData; facilities/CX use full DB-backed CatalogEntityBase
export type CodexEntity = ShipDisplayData | CatalogEntityBase;



function isShipDisplay(e: CodexEntity | undefined): e is ShipDisplayData {
  return !!e && (e as ShipDisplayData).templateId !== undefined && (e as any).unitType === undefined;
}


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
  ) as CodexEntity | undefined;
});

  isShip = computed<boolean>(() => isShipDisplay(this.entity()));
 // this will be used instead of e.unitType in the template
  unitTypeLabel = computed<string | null>(() => {
    const e = this.entity();
    if (!e) return null;

    if (isShipDisplay(e)) {
      // For UI ships, show something meaningful when there’s no class
      return e.role || 'Ship';
    }

    // Facilities / CX assets have unitType from CatalogEntityBase
    return e.unitType;
  });

  specs = computed<Record<string, string | number>>(() => {
    const e = this.entity();
    if (!e) return {};

    const specs: Record<string, string | number> = {};

    if (isShipDisplay(e)) {
      // Display-only ship: use the UI data you actually have
      specs['Series'] = e.series;
      specs['Code'] = e.code;
      specs['Role'] = e.role;
      if (e.class) specs['Class'] = e.class;
      specs['Template ID'] = e.templateId;
    } else {
      // Facilities / CX assets: full DB-backed stats from CatalogEntityBase
      specs['Unit Type'] = e.unitType;
      specs['Size'] = e.size;
      specs['Hull'] = e.baseHealth;
      specs['Shield'] = e.baseShield;
      specs['Weapon Slots'] = e.weaponSlots;
      specs['Crew Required'] = e.staffRequired;
      specs['Housing'] = e.totalHousing;
      specs['Speed'] = e.speed;
      specs['Hyperspace'] = e.hyperspace;
      specs['Atmospheric'] = e.atmospheric ? 'Yes' : 'No';
      specs['Shield Type'] = e.shieldType;
      specs['Tech Tier'] = e.techTier;
      specs['Resource Capacity'] = e.resourceCapacity;
      specs['Dock Capacity'] = e.dockCapacity;
      specs['Energy Produced'] = e.baseEnergyProduced;
      specs['Energy Used'] = e.baseEnergyUsed;
      specs['Requires Power'] = e.requiresPower ? 'Yes' : 'No';
      specs['Provides Power'] = e.providesPower;
      specs['Provides Storage'] = e.providesStorage;
      specs['Construction Cost'] = e.constructionCost;
      specs['Development Cost'] = e.developmentCost;
    }

    // Strip zero numeric values
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
