// File: src/app/features/home/home.page.ts
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { VdsHeroComponent } from '../../components/vds-hero/vds-hero.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [IonContent, VdsHeroComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {}
