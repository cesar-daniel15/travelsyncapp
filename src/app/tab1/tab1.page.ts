import { Component, OnInit } from '@angular/core'; 

import { LanguageService } from '../services/language.service'; 
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
  prop2: string | null;
  prop3: string | null;
  isFav: boolean;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  apiUrl: string = "https://mobile-api-one.vercel.app/api";
  name: string = "cesar.daniel@ipvc.pt";
  password: string = "uVt(D!u3";

  selectedState: State = State.Planed;
  selectedType: Type = Type.Leisure;
  description: string = '';
  isFav: boolean = false;
  prop1: string | null = null;
  prop2: string = '';
  selectedFile: File | null = null;

  Type = Type; 
  State = State;
  travels: Travels[] = [];
  favoriteTravels: Travels[] = [];
  startingTravels: Travels[] = [];
  plannedTravels: Travels[] = [];

  ngOnInit() {
    this.getTravels(); 
  }

  constructor(private languageService: LanguageService,  private loadingCtrl: LoadingController, private http: HttpClient,  private translate: TranslateService) {}
  
  async getTravels() {
    const loading = await this.showLoading();

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      this.travels = await firstValueFrom(this.http.get<Travels[]>(`${this.apiUrl}/travels/`, { headers }));

      loading.dismiss();

      this.favoriteTravels = this.travels.filter(travel => travel.isFav);
      this.startingTravels = this.travels.filter(travel => travel.state === State.Starting); 
      this.plannedTravels = this.travels.filter(travel => travel.state === State.Planed); 

      if(this.travels.length == 0) {
        const message = this.translate.instant('NO_TRAVELS'); 
        await this.presentToast(message, 'warning');
      }
      else {
        const message = this.translate.instant('SUCESS_GETING', { count: this.travels.length }); 
        await this.presentToast(message, 'success');      
      } 
      
    } catch (error : any) {
      loading.dismiss();
      await this.presentToast(error.error, 'danger');
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
