// File: src/app/features/contact/contact.page.ts
import { Component } from '@angular/core';
import {   IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  IonButton } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton],
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss']
})
export class ContactPage {
  submit(ev: Event){ ev.preventDefault(); alert('Press kit request queued.'); }
}
