// File: src/app/components/vds-footer/vds-footer.component.ts
import { Component } from '@angular/core';
import { IonFooter, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'vds-footer',
  standalone: true,
  imports: [IonFooter, IonToolbar],
  templateUrl: './vds-footer.component.html',
  styleUrls: ['./vds-footer.component.scss']
})
export class VdsFooterComponent {}
