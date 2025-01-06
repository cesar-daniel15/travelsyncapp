import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonIcon,
  IonTextarea,
  IonButton,
  IonImg
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locateOutline,
  calendarOutline,
  filterOutline,
  locationOutline,
  documentTextOutline,
  gitBranchOutline,
  heartOutline,
  chatbubbleOutline
} from 'ionicons/icons';

// Adicionando os ícones ao Ionicons
addIcons({
  'locate-outline': locateOutline,
  'calendar-outline': calendarOutline,
  'filter-outline': filterOutline,
  'location-outline': locationOutline,
  'document-text-outline': documentTextOutline,
  'git-branch-outline': gitBranchOutline,
  'heart-outline': heartOutline,
  'chatbubble-outline': chatbubbleOutline
});

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html', // Verifique se esse arquivo existe
  styleUrls: ['./tab2.page.scss'], // Verifique se esse arquivo existe
  standalone: true, // Declara o componente como standalone
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
    IonIcon,
    IonTextarea,
    IonButton,
    IonImg
  ]
})
export class RegisterPage {

  showDatePicker: boolean = false;

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }
}