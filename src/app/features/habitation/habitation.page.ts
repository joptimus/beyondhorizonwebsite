// File: src/app/features/habitation/habitation.page.ts
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { FACILITIES } from '../../data/seed-facilities';
import { VdsCardComponent } from '../../components/vds-card/vds-card.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-habitation',
  imports: [IonContent,CommonModule, VdsCardComponent],
  templateUrl: './habitation.page.html',
  styleUrls: ['./habitation.page.scss']
})
export class HabitationPage { list = FACILITIES.filter(f => f.series==='HX'); }
