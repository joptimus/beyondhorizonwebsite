// File: src/app/components/vds-poster/vds-poster.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'vds-poster',
  standalone: true,
  template: `
  <figure class="vds-card poster">
    <img [src]="src" [alt]="alt||'poster'" loading="lazy">
    <figcaption>{{caption}}</figcaption>
    <a class="dl" [href]="src" download>Download Poster</a>
  </figure>`,
  styles:[`
    .poster{padding:10px; position:relative}
    img{width:100%;height:auto;border-radius:8px; display:block}
    figcaption{font-size:12px; opacity:.7; margin-top:6px}
    .dl{position:absolute; top:10px; right:10px; border:1px solid var(--vds-border); border-radius:8px; padding:6px 8px; text-decoration:none}
    .dl:hover{border-color:var(--vds-teal); color:var(--vds-teal)}
  `]
})
export class VdsPosterComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() caption = '';
}
