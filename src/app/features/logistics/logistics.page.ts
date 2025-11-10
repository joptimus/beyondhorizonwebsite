// File: src/app/features/logistics/logistics.page.ts
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CX_ASSETS } from '../../data/seed-cx';
import { VdsCardComponent } from '../../components/vds-card/vds-card.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-logistics',
  imports: [IonContent,CommonModule, VdsCardComponent],
  templateUrl: './logistics.page.html',
  styleUrls: ['./logistics.page.scss']
})
export class LogisticsPage { list = CX_ASSETS; }
