import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonSearchbar, 
  IonList, 
  IonItem, 
  IonButton, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonSelect,
  IonLabel,
  IonSelectOption 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonSearchbar, 
    IonList, 
    IonItem, 
    IonButton, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent,
    IonSelect,
    IonLabel,
    IonSelectOption 
  ],
})
export class FavoriteTripsPage {

}