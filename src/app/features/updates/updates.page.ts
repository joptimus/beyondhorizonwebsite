// File: src/app/features/updates/updates.page.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-updates',
  imports: [IonContent,CommonModule],
  templateUrl: './updates.page.html',
  styleUrls: ['./updates.page.scss']
})
export class UpdatesPage {
  entries = [
    { date: '2025-11-01', title: 'Initial scaffolding', body: 'Bootstrapped Ionic + Angular standalone app with VDS theme.' },
    { date: '2025-11-05', title: 'Codex online', body: 'Unified data index and search with seed datasets.' }
  ];
}
