// File: src/app/components/vds-card/vds-card.component.ts
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VdsBadgeComponent } from '../vds-badge/vds-badge.component';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'vds-card',
  standalone: true,
  imports: [RouterLink, VdsBadgeComponent, CommonModule],
  templateUrl: './vds-card.component.html',
  styleUrls: ['./vds-card.component.scss']
})
export class VdsCardComponent {
  @Input() title = '';
  @Input() code = '';
  @Input() series: any;
  @Input() summary = '';
  @Input() to = '';
  @Input() tags: string[] = [];
}
