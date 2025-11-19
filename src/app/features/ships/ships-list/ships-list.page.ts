// File: src/app/features/ships/ships-list/ships-list.page.ts
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { SHIPS, ShipDisplayData } from '../../../data/seed-ships';
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
  ships: ShipDisplayData[] = SHIPS;

  classFilter = signal<string | null>(null);

  classes = Array.from(new Set(this.ships.map(s => s.class)));

  list = computed(() =>
    this.ships.filter(s =>
      (!this.classFilter() || s.class === this.classFilter())
    )
  );

  // Now the parameter type matches what *s* actually is
  tagsOf(s: ShipDisplayData): string[] {
    return [String(s.class), ...(s.tags || [])];
  }
}
