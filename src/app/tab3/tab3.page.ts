import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LanguageService } from '../services/language.service'; 
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ModalLocationsCommentsComponent } from '../components/modal-locations-comments/modal-locations-comments.component';

import { ModalController } from '@ionic/angular'; 

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
  IonSelectOption,
} from '@ionic/angular/standalone';

enum State {
}

enum Type {
}

interface Locations{ 
  id: string; 
  travelId: string,
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
  comments: Comment[];  
  // photos TravelPhotos;
  prop1: string | null;
  prop2: string | null;
  prop3: string | null;
  isFav: boolean;
}

interface Travel {
  id: string;
  prop2: string; 
  locations: Location[]; 
}

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
    IonSelectOption,
    CommonModule, 
    TranslateModule,
  ],
})
export class FavoriteTripsPage {

  apiUrl: string = "https://mobile-api-one.vercel.app/api";
  name: string = "cesar.daniel@ipvc.pt";
  password: string = "uVt(D!u3";

  travelId: string = '';
  locations: any[] = []; 
  description: string = '';
  prop1: string = '';
  prop2: string = '';

  constructor(
    private http: HttpClient,  
    private loadingCtrl: LoadingController, 
    private router: Router,
    private translate: TranslateService,
    private modalCtrl: ModalController,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.getLocations(); 
  }

  ionViewWillEnter() {
    this.getLocations();
  }

  async getLocations() {
    const loading = await this.showLoading();

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      this.locations = await firstValueFrom(this.http.get<Locations[]>(`${this.apiUrl}/travels/`, { headers }));
      
      const travels = await firstValueFrom(this.http.get<Travel[]>(`${this.apiUrl}/travels/`, { headers }));

      this.locations = travels.filter(travel => travel.locations && travel.locations.length > 0);

      loading.dismiss();


      if(this.locations.length == 0) {
        const message = this.translate.instant('NO_TRAVELS'); 
        await this.presentToast(message, 'warning');
      }
      else {
        const message = this.translate.instant('SUCESS_GETING', { count: this.locations.length }); 
        await this.presentToast(message, 'success');      
      } 
      
    } catch (error : any) {
      loading.dismiss();
      await this.presentToast(error.error, 'danger');
    }
  } 

  async openCommentModal(location: Locations) {
    const modal = await this.modalCtrl.create({
      component: ModalLocationsCommentsComponent,
      componentProps: { locationId: location.id, comments: location.comments }, 
    });
  
    modal.onDidDismiss().then(() => {
      this.getLocations(); 
    });
  
    await modal.present();
  }
  // Método para exibir a tela de carregamento
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 3000,
    });
    loading.present();
    return loading;
  }

  // Método para mostrar uma mensagem de sucesso ou erro
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