// File: src/app/features/codex/codex.page.ts
import { Component, computed, signal } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { VdsSearchBarComponent } from '../../components/vds-search-bar/vds-search-bar.component';
import { VdsCardComponent } from '../../components/vds-card/vds-card.component';
import { SHIPS } from '../../data/seed-ships';
import { FACILITIES } from '../../data/seed-facilities';
import { CX_ASSETS } from '../../data/seed-cx';
import { matchesFilter } from '../../utils/format-utils';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-codex',
  imports: [IonContent,CommonModule, VdsSearchBarComponent, VdsCardComponent],
  templateUrl: './codex.page.html',
  styleUrls: ['./codex.page.scss']
})
export class CodexPage {
  q = signal('');
  all = [...SHIPS, ...FACILITIES, ...CX_ASSETS];
  list = computed(() => {
    const v = this.q().trim();
    return v ? this.all.filter(e => matchesFilter(`${e.code} ${e.name} ${e.summary} ${(e.tags||[]).join(' ')}`, v))
             : this.all;
  });
}
