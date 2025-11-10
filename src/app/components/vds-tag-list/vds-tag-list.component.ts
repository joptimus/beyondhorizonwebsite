// File: src/app/components/vds-tag-list/vds-tag-list.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vds-tag-list',
  standalone: true,
  
  imports: [CommonModule],   
  template: `
  <div class="tags">
    <button class="vds-chip" [class.active]="t===active" (click)="pick(t)" *ngFor="let t of tags">{{t}}</button>
    <button class="vds-chip" [class.active]="!active" (click)="pick('')">All</button>
  </div>`,
  styles:[`
    .tags{display:flex; gap:6px; flex-wrap:wrap}
    .vds-chip{background:transparent;color:inherit}
    .active{border-color:var(--vds-teal); color:var(--vds-teal)}
  `]
})
export class VdsTagListComponent {
  @Input() tags: string[] = [];
  @Input() active = '';
  @Output() change = new EventEmitter<string>();
  pick(t:string){ this.change.emit(t || ''); }
}
