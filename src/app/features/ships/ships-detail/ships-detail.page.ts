// File: src/app/features/ships/ship-detail.page.ts
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent, IonButtons, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { SHIPS } from '../../../data/seed-ships'; // Stripped version
import { ShipDisplay, CatalogEntityStats } from '../../../models/catalog.models';
import { VdsBadgeComponent } from '../../../components/vds-badge/vds-badge.component';
import { VdsSpecGridComponent } from '../../../components/vds-spec-grid/vds-spec-grid.component';
import { ModelViewerComponent } from 'src/app/component/model-viewer/model-viewer.component';
import { UnitStatsService } from '../../../services/unit-stats/unit-stats';

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
  
  // Stats from API
  stats = signal<CatalogEntityStats | null>(null);
  loadingStats = signal<boolean>(false);
  statsError = signal<string | null>(null);

  // Ship display data (from seed file)
  ship = computed<ShipDisplay | undefined>(() =>
    SHIPS.find(s => s.id === this.id())
  );

  // Build the spec-grid input - now from API stats
  specs = computed<Record<string, string | number>>(() => {
    const apiStats = this.stats();
    if (!apiStats) {
      return {}; // Return empty if stats not loaded yet
    }

    const s = this.ship();
    if (!s) {
      return {};
    }

    if (this.id() == 'vx-6c-vulcan') {
      this.showViewer = true;
    }
    
    console.log('ShipDetailPage loaded', this.id());

    // Use stats from API instead of seed file
    const specs: Record<string, string | number> = {
      'Class': s.class, // Keep from seed file (display data)
      'Unit Type': apiStats.UnitType,
      'Size': apiStats.Size,
      'Hull': apiStats.BaseHealth,
      'Shield': apiStats.BaseShield,
      'Weapon Slots': apiStats.WeaponSlots,
      'Crew Required': apiStats.StaffRequired,
      'Housing': apiStats.TotalHousing,
      'Speed': apiStats.Speed,
      'Hyperspace': apiStats.Hyperspace,
      'Atmospheric': apiStats.Atmospheric ? 'Yes' : 'No',
      'Shield Type': apiStats.ShieldType,
      'Tech Tier': apiStats.TechTier,
      'Resource Capacity': apiStats.ResourceCapacity,
      'Dock Capacity': apiStats.DockCapacity,
      'Requires Power': apiStats.RequiresPower ? 'Yes' : 'No',
      'Provides Power': apiStats.ProvidesPower ? 'Yes' : 'No',
      'Provides Storage': apiStats.ProvidesStorage ? 'Yes' : 'No',
      'Construction Cost': apiStats.ConstructionCost,
      'Development Cost': apiStats.DevelopmentCost
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

  constructor(
    route: ActivatedRoute,
    private unitStatsService: UnitStatsService
  ) {
    const param = route.snapshot.paramMap.get('id') || '';
    this.id.set(param);
    
    // Load stats from API
    this.loadShipStats();
  }

  /**
   * Load ship stats from API using templateId
   */
  private loadShipStats() {
    const ship = this.ship();
    if (!ship) {
      console.error('Ship not found:', this.id());
      return;
    }

    this.loadingStats.set(true);
    this.statsError.set(null);

    this.unitStatsService.getUnitStats(ship.templateId).subscribe({
      next: (apiStats) => {
        this.stats.set(apiStats);
        this.loadingStats.set(false);
        console.log('Stats loaded for', ship.name, apiStats);
      },
      error: (error) => {
        this.statsError.set(error.message || 'Failed to load stats');
        this.loadingStats.set(false);
        console.error('Error loading stats:', error);
      }
    });
  }

  /**
   * Retry loading stats if there was an error
   */
  retryLoadStats() {
    this.loadShipStats();
  }
}