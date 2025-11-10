// File: src/app/app.component.ts
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonContent, IonList, IonItem } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { VdsHeaderComponent } from './components/vds-header/vds-header.component';
import { VdsFooterComponent } from './components/vds-footer/vds-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonApp, IonRouterOutlet,
    IonMenu, IonContent, IonList, IonItem, RouterLink,   // ⬅️ menu pieces
    VdsHeaderComponent, VdsFooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
