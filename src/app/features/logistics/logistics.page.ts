// File: src/app/features/logistics/logistics.page.ts
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { CX_ASSETS } from '../../data/seed-cx';
import { VdsCardComponent } from '../../components/vds-card/vds-card.component';
import { CatalogEntityBase } from '../../models/catalog.models';

@Component({
  standalone: true,
  selector: 'app-logistics',
  imports: [IonContent, CommonModule, VdsCardComponent],
  templateUrl: './logistics.page.html',
  styleUrls: ['./logistics.page.scss']
})
export class LogisticsPage {
  list: CatalogEntityBase[] = CX_ASSETS;
}
