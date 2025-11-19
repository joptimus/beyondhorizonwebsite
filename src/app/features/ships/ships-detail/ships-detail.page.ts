// File: src/app/features/ships/ship-detail.page.ts
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent, IonButtons, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { SHIPS } from '../../../data/seed-ships';
import { Ship } from '../../../models/catalog.models';
import { VdsBadgeComponent } from '../../../components/vds-badge/vds-badge.component';
import { VdsSpecGridComponent } from '../../../components/vds-spec-grid/vds-spec-grid.component';
import { ModelViewerComponent } from 'src/app/component/model-viewer/model-viewer.component';

@Component({
  standalone: true,
  selector: 'app-ship-detail',
  imports: [
    IonContent,
    CommonModule,
    RouterLink,
    IonButtons,
    IonButton,
    VdsBadgeComponent,
    VdsSpecGridComponent,
    ModelViewerComponent
  ],
  templateUrl: './ships-detail.page.html',
  styleUrls: ['./ships-detail.page.scss']
})


export class ShipDetailPage {
  showViewer: boolean = false;
  id = signal<string>('');

  ship = computed<Ship | undefined>(() =>
    SHIPS.find(s => s.id === this.id())
  );

  // Build the spec-grid input purely from DB-backed fields
  specs = computed<Record<string, string | number>>(() => {
    const s = this.ship();
    if (!s) {
      return {};
    }
    if(this.id() == 'vx-6c-vulcan') {
      this.showViewer = true;
    }
      console.log('ShipDetailPage loaded', this.id());

    const specs: Record<string, string | number> = {
      'Class': s.class,
      'Unit Type': s.unitType,
      'Size': s.size,
      'Hull': s.baseHealth,
      'Shield': s.baseShield,
      'Weapon Slots': s.weaponSlots,
      'Crew Required': s.staffRequired,
      'Housing': s.totalHousing,
      'Speed': s.speed,
      'Hyperspace': s.hyperspace,
      'Atmospheric': s.atmospheric ? 'Yes' : 'No',
      'Shield Type': s.shieldType,
      'Tech Tier': s.techTier,
      'Resource Capacity': s.resourceCapacity,
      'Dock Capacity': s.dockCapacity,
      'Requires Power': s.requiresPower ? 'Yes' : 'No',
      'Provides Power': s.providesPower,
      'Provides Storage': s.providesStorage,
      'Construction Cost': s.constructionCost,
      'Development Cost': s.developmentCost
    };

    // Optionally prune zeros to avoid noise:
    Object.keys(specs).forEach(key => {
      const v = specs[key];
      if (typeof v === 'number' && v === 0) {
        delete specs[key];
      }
    });

    return specs;
  });

  constructor(route: ActivatedRoute) {
    const param = route.snapshot.paramMap.get('id') || '';
    this.id.set(param);
  }
}
