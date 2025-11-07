// src/app/route-tester/route-tester.page.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoutingService, RouteResponse } from '../services/routing.service';
import {
  IonContent,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonNote, IonInput,
  IonSegment, IonSegmentButton,
  IonButton, IonSpinner,
  IonChip, IonIcon,
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-route-tester',
   imports: [
    CommonModule, FormsModule,
    IonContent,
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonLabel, IonNote, IonInput,
    IonSegment, IonSegmentButton,
    IonButton, IonSpinner,
    IonChip, IonIcon,
  ],
  templateUrl: './route-tester.page.html',
  styleUrls: ['./route-tester.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RouteTesterPage {
  fromId = 2244677;
  toId = 9008810;
  shipJumpMax: number | null = null;
  metric: '2d' | '3d' = '3d';

  loading = signal(false);
  result = signal<RouteResponse | null>(null);
  error = signal<string | null>(null);

  constructor(private routing: RoutingService) {}

  async run() {
    this.error.set(null);
    this.result.set(null);
    this.loading.set(true);
    try {
      const out = await this.routing.findRoute({
        from: Number(this.fromId),
        to: Number(this.toId),
        metric: this.metric,
        shipJumpMax: this.shipJumpMax ?? null
      });
      if (!out.ok) this.error.set(out.error ?? 'Unknown error');
      this.result.set(out);
    } catch (e: any) {
      this.error.set(e?.message || 'Network error');
    } finally {
      this.loading.set(false);
    }
  }
}
