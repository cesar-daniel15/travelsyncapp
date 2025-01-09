import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonSelect, IonSelectOption, IonItem, IonLabel, IonInput, IonDatetime, IonIcon, IonTextarea, IonButton,IonCheckbox, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locateOutline, calendarOutline, filterOutline, locationOutline, documentTextOutline, gitBranchOutline, heartOutline, chatbubbleOutline } from 'ionicons/icons';

import { LanguageService } from '../services/language.service'; 
import { TranslateModule } from '@ngx-translate/core';

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
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
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
    IonImg,
    IonCheckbox,
    TranslateModule 
  ]
})
export class RegisterPage {
  showDatePicker: boolean = false;

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  constructor(private languageService: LanguageService) {}
  
  switchLanguage(language: string) {
    this.languageService.setLanguage(language);
  }

  getCurrentLanguage() {
    return this.languageService.getLanguage();
  }
}