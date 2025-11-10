// File: src/app/features/medical/medical.page.ts
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { FACILITIES } from '../../data/seed-facilities';
import { VdsCardComponent } from '../../components/vds-card/vds-card.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-medical',
  imports: [IonContent,CommonModule, VdsCardComponent],
  templateUrl: './medical.page.html',
  styleUrls: ['./medical.page.scss']
})
export class MedicalPage { list = FACILITIES.filter(f => f.series==='MX'); }
