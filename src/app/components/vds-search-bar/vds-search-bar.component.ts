// File: src/app/components/vds-search-bar/vds-search-bar.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'vds-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],  
  template: `
  <label class="wrap">
    <span class="visually-hidden">Search</span>
    <input [placeholder]="placeholder" [(ngModel)]="q" (input)="change.emit(q)" />
  </label>`,
  styles:[`
    .wrap{display:block}
    input{width:100%; background:var(--vds-panel); border:1px solid var(--vds-border);
      border-radius:10px; padding:10px 12px; color:var(--vds-silver)}
    .visually-hidden{position:absolute;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;width:1px;overflow:hidden;white-space:nowrap}
  `]
})
export class VdsSearchBarComponent {
  @Input() placeholder = 'Search codex...';
  @Output() change = new EventEmitter<string>();
  q = '';
}
