// File: src/app/features/stations/stations.page.ts
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { FACILITIES } from '../../data/seed-facilities';
import { VdsCardComponent } from '../../components/vds-card/vds-card.component';
import { Facility } from '../../models/catalog.models';

@Component({
  standalone: true,
  selector: 'app-stations',
  imports: [IonContent, CommonModule, VdsCardComponent],
  templateUrl: './stations.page.html',
  styleUrls: ['./stations.page.scss']
})
export class StationsPage {
  // Bases, stations, jumpgates, HQ / imperial command nodes
  list: Facility[] = FACILITIES.filter((f: Facility) =>
    f.subtype === 'station' ||
    f.subtype === 'base' ||
    f.subtype === 'gate' ||
    f.unitType === 'Headquarters' ||
    f.unitType === 'ImperialStation'
  );
}
