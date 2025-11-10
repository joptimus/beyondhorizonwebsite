// File: src/app/components/vds-skeleton/vds-skeleton.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'vds-skeleton',
  standalone: true,
  template: `<div class="skel" [style.height.px]="h"></div>`,
  styles:[`.skel{background:linear-gradient(90deg,#111,#1a1f27,#111);animation:sh 1.2s linear infinite;background-size:200% 100%;border-radius:8px;border:1px solid var(--vds-border)}@keyframes sh{0%{background-position:0 0}100%{background-position:200% 0}}`]
})
export class VdsSkeletonComponent { @Input() h = 120; }
