// File: src/app/features/habitation/habitation.page.ts
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { FACILITIES } from '../../data/seed-facilities';
import { VdsCardComponent } from '../../components/vds-card/vds-card.component';
import { Facility } from '../../models/catalog.models';

@Component({
  standalone: true,
  selector: 'app-habitation',
  imports: [IonContent, CommonModule, VdsCardComponent],
  templateUrl: './habitation.page.html',
  styleUrls: ['./habitation.page.scss']
})
export class HabitationPage {
  // Housing, city governance, and any habitation-tagged facilities
  list: Facility[] = FACILITIES.filter((f: Facility) =>
    f.subtype === 'habitation' ||
    f.unitType === 'Housing' ||
    f.unitType === 'CityHall'
  );
}
