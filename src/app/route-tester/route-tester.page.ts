import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoutingService, RouteResponse } from '../services/routing.service';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonNote, IonInput,
  IonSegment, IonSegmentButton,
  IonButton, IonSpinner, IonChip, IonIcon,
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-route-tester',
  templateUrl: './route-tester.page.html',
  styleUrls: ['./route-tester.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonLabel, IonNote, IonInput,
    IonSegment, IonSegmentButton,
    IonButton, IonSpinner, IonChip, IonIcon,
  ],
})
export class RouteTesterPage {
  fromId = 2244677;
  toId = 9008810;
  shipJumpMax: number | null = null;
  metric: '2d' | '3d' = '3d';
  optimize: 'distance' | 'hops' = 'distance';
  apiKey = '';

  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<RouteResponse | null>(null);

  constructor(private routing: RoutingService) {}

  async run() {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    try {
      const out = await this.routing.findRoute({
        from: Number(this.fromId),
        to: Number(this.toId),
        metric: this.metric,
        shipJumpMax: this.shipJumpMax ?? null,
        optimize: this.optimize,
      });
      if (!out.ok) this.error.set(out.error ?? 'Route failed');
      this.result.set(out);
    } catch (e: any) {
      this.error.set(e?.message || 'Network error');
    } finally {
      this.loading.set(false);
    }
  }
}
