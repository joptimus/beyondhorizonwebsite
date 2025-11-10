// File: src/app/components/vds-spec-grid/vds-spec-grid.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'vds-spec-grid',
  standalone: true,
    imports: [CommonModule],   
  templateUrl: './vds-spec-grid.component.html',
  styleUrls: ['./vds-spec-grid.component.scss']
})
export class VdsSpecGridComponent {
  @Input() specs: Record<string, string|number> | undefined;
}
  