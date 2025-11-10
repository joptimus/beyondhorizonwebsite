// File: src/app/components/vds-hero/vds-hero.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vds-hero',
  standalone: true,
    imports: [CommonModule, RouterLink],   
  templateUrl: './vds-hero.component.html',
  styleUrls: ['./vds-hero.component.scss']
})
export class VdsHeroComponent {
  @Input() title = 'Beyond Horizon';
  @Input() subtitle = 'Voran Defense Systems';
  @Input() ctas: {label:string, link:string}[] = [];
   @Input() bgImage = '../../../assets/beyond-horizon-standalone-hero-1920x1080.png';  
      @Input() logoImage = '../../../assets/beyond-horizon-standalone-hero-1920x1080.png';   // e.g. 'assets/brand/beyond-horizon-standalone-hero-1920x1080.png'
}
