// File: src/app/features/stations/stations.page.ts
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { FACILITIES } from '../../data/seed-facilities';
import { VdsCardComponent } from '../../components/vds-card/vds-card.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-stations',
  imports: [IonContent, CommonModule, VdsCardComponent],
  templateUrl: './stations.page.html',
  styleUrls: ['./stations.page.scss']
})
export class StationsPage {
  list = FACILITIES.filter(f => f.series==='BX' || f.subtype==='gate' || f.subtype==='station' || f.subtype==='base');
}
