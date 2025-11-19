// File: src/app/features/medical/medical.page.ts
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { FACILITIES } from '../../data/seed-facilities';
import { VdsCardComponent } from '../../components/vds-card/vds-card.component';
import { Facility } from '../../models/catalog.models';

@Component({
  standalone: true,
  selector: 'app-medical',
  imports: [IonContent, CommonModule, VdsCardComponent],
  templateUrl: './medical.page.html',
  styleUrls: ['./medical.page.scss']
})
export class MedicalPage {
  // Medical facilities: MX line + anything tagged as medical in DB
  list: Facility[] = FACILITIES.filter(
    (f: Facility) => f.subtype === 'medical' || f.unitType === 'Hospital'
  );
}
