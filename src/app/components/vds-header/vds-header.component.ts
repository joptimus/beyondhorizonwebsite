// File: src/app/components/vds-header/vds-header.component.ts
import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonMenuButton
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vds-header',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonMenuButton, RouterLink],
  templateUrl: './vds-header.component.html',
  styleUrls: ['./vds-header.component.scss']
})
export class VdsHeaderComponent {}
