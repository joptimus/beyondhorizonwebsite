// File: src/app/features/engineering/engineering.page.ts
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { FACILITIES } from '../../data/seed-facilities';
import { VdsCardComponent } from '../../components/vds-card/vds-card.component';
import { Facility } from '../../models/catalog.models';

@Component({
  standalone: true,
  selector: 'app-engineering',
  imports: [IonContent, CommonModule, VdsCardComponent],
  templateUrl: './engineering.page.html',
  styleUrls: ['./engineering.page.scss']
})
export class EngineeringPage {
  // Factories, power cores, harvesters, and mines
  list: Facility[] = FACILITIES.filter((f: Facility) =>
    f.subtype === 'factory' ||
    f.subtype === 'power' ||
    f.unitType === 'Harvester' ||
    f.unitType === 'Mine'
  );
}
