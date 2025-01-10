import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonSelect, IonSelectOption, IonItem, IonLabel, IonInput, IonDatetime, IonIcon, IonTextarea, IonButton,IonCheckbox, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locateOutline, calendarOutline, filterOutline, locationOutline, documentTextOutline, gitBranchOutline, heartOutline, chatbubbleOutline } from 'ionicons/icons';

import { LanguageService } from '../services/language.service'; 
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { put } from "@vercel/blob";

enum State {
  Planed = "Planed",
  Starting ="Starting",
  Finished = 'Finished',
}

enum Type {
  Business ="Business",
  Leisure = "Leisure",
}

interface Travels{ 
  id: string; 
  description: string; 
  type: Type; 
  state: State; 
  map: null,
  startAt: string | null,
  endAt: null,
  createdBy: string; 
  createdAt: string; 
  updatedBy: string | null; 
  updatedAt: string;
  // locations: TravelLocations;
  // commets TravelComments;
  // photos TravelPhotos;
  prop1: string | null;
  prop2: string;
  prop3: string | null;
  isFav: boolean;
}

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

  apiUrl: string = "https://mobile-api-one.vercel.app/api";
  name: string = "cesar.daniel@ipvc.pt";
  password: string = "uVt(D!u3";

  selectedState: State = State.Planed;
  selectedType: Type = Type.Business;
  description: string = '';
  isFav: boolean = false;
  prop1: string = '';
  prop2: string = '';
  
  Type = Type; 
  State = State;

  
  constructor(private languageService: LanguageService,  private loadingCtrl: LoadingController, private http: HttpClient,  private translate: TranslateService) {}
  
  
  async postTravel() {

    const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });

    const loading = await this.showLoading();

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    const startAt = this.selectedState === State.Starting ? new Date().toISOString() : null;
  
    const newTravel: Travels = {
      id: '',
      description: this.description,
      type: this.selectedType,
      state: this.selectedState,
      map: null,
      startAt: startAt,
      endAt: null,
      createdBy: this.name,
      createdAt: new Date().toISOString(),
      updatedBy: null,
      updatedAt: new Date().toISOString(),
      prop1: this.prop1,
      prop2: this.prop2,
      prop3: null,
      isFav: this.isFav,
    };
  
    try {
      await firstValueFrom(this.http.post<Travels>(`${this.apiUrl}/travels`, newTravel, { headers }));
      loading.dismiss();

      await this.presentToast('TRAVEL_CREATED', 'success'); 

    } catch (error: any) {
      loading.dismiss();
      
      await this.presentToast('ERROR_OCCURRED', 'danger'); 
    }
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading ...',
      duration: 3000,
    });

    loading.present();
    return loading;
  }

  async presentToast(messageKey: string, color: string = 'success') {
    const message = await firstValueFrom(this.translate.get(messageKey)); 
    const toast = document.createElement('ion-toast');

    toast.message = message;  
    toast.color = color;     
    toast.duration = 2000;  
    toast.position = 'top';
    
    document.body.appendChild(toast);  
    await toast.present();
  }

  switchLanguage(language: string) {
    this.languageService.setLanguage(language);
  }

  getCurrentLanguage() {
    return this.languageService.getLanguage();
  }
}