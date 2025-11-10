// File: src/app/features/ships/ships-list/ships-list.page.ts
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { SHIPS } from '../../../data/seed-ships'; // adjust path if needed
import { Ship } from '../../../models/catalog.models';
import { VdsCardComponent } from '../../../components/vds-card/vds-card.component';
// import { VdsTagListComponent } from '../../../components/vds-tag-list/vds-tag-list.component'; // (still optional/unused)

@Component({
  standalone: true,
  selector: 'app-ships-list',
  imports: [CommonModule, IonContent, IonSelect, IonSelectOption, VdsCardComponent],
  templateUrl: './ships-list.page.html',
  styleUrls: ['./ships-list.page.scss']
})
export class ShipsListPage {
  ships = SHIPS;
  classFilter = signal<string>('');
  lineFilter = signal<string>('');
  lines = Array.from(new Set(this.ships.map(s => s.line).filter(Boolean))) as string[];
  classes = Array.from(new Set(this.ships.map(s => s.class)));

  list = computed(() =>
    this.ships.filter(s =>
      (!this.classFilter() || s.class === this.classFilter()) &&
      (!this.lineFilter() || s.line === this.lineFilter())
    )
  );

  // Build tags array in TS to avoid template casting/parsing issues
  tagsOf(s: Ship): string[] {
    return [String(s.class), ...(s.tags || [])];
  }
}
