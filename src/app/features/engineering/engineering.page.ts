// File: src/app/features/engineering/engineering.page.ts
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { FACILITIES } from '../../data/seed-facilities';
import { VdsCardComponent } from '../../components/vds-card/vds-card.component';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-engineering',
  imports: [IonContent, CommonModule, VdsCardComponent],
  templateUrl: './engineering.page.html',
  styleUrls: ['./engineering.page.scss']
})
export class EngineeringPage {
  list = FACILITIES.filter(f => f.series==='EX' || f.code.startsWith('EXF'));
}
