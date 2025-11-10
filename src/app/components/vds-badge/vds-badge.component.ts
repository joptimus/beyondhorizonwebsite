// File: src/app/components/vds-badge/vds-badge.component.ts
import { Component, Input } from '@angular/core';
import { seriesColor } from '../../utils/format-utils';

@Component({
  selector: 'vds-badge',
  standalone: true,
  template: `<span class="vds-badge" [style.borderColor]="color" [style.color]="color"><ng-content></ng-content></span>`,
// File: src/app/components/vds-badge/vds-badge.component.ts (styles inline)
styles: [`
  .vds-badge{
    display:inline-block; font-family:var(--vds-font-code);
    border:1px solid var(--vds-border); border-radius:8px; padding:3px 10px;
    box-shadow: 0 0 0 1px color-mix(in oklab, currentColor 18%, transparent) inset;
    letter-spacing:.02em;
  }
`]

})
export class VdsBadgeComponent {
  @Input() series: any;
  get color() { return seriesColor(this.series); }
}
