// File: src/app/features/ships/ship-detail.page.ts
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent, IonButtons, IonButton } from '@ionic/angular/standalone';
import { SHIPS } from '../../../data/seed-ships';
import { VdsBadgeComponent } from '../../../components/vds-badge/vds-badge.component';
import { VdsSpecGridComponent } from '../../../components/vds-spec-grid/vds-spec-grid.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-ship-detail',
  imports: [IonContent, CommonModule, RouterLink, IonButtons, IonButton, VdsBadgeComponent, VdsSpecGridComponent],
  templateUrl: './ships-detail.page.html',
  styleUrls: ['./ships-detail.page.scss']
})
export class ShipDetailPage {
  id = signal<string>('');
  ship = computed(() => SHIPS.find(s => s.id === this.id()));

  constructor(route: ActivatedRoute) {
    const param = route.snapshot.paramMap.get('id') || '';
    this.id.set(param);
  }
}
