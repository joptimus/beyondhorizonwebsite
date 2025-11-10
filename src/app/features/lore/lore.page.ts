// File: src/app/features/lore/lore.page.ts
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { VdsBadgeComponent } from '../../components/vds-badge/vds-badge.component';

@Component({
  standalone: true,
  selector: 'app-lore',
  imports: [IonContent, VdsBadgeComponent],
  templateUrl: './lore.page.html',
  styleUrls: ['./lore.page.scss']
})
export class LorePage {}
