import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { ModalTravelComponent } from '../components/modal-travel/modal-travel.component';
import { ModalController } from '@ionic/angular'; 

enum State {
  Planed = "Planed",
  Starting = "Starting",
  Finished = "Finished",
}

enum Type {
  Business = "Business",
  Leisure = "Leisure",
}

interface Travels {
  id: string;
  description: string | null;
  type: Type | null;
  state: State | null;
  map: null;
  startAt: string | null;
  endAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
  prop1: string | null;
  prop2: string | null;
  isFav: boolean;
}

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  apiUrl: string = "https://mobile-api-one.vercel.app/api";
  name: string = "cesar.daniel@ipvc.pt";
  password: string = "uVt(D!u3";

  type: Type | null = null;
  state: State | null = null;
  description: string | null = null;
  travels: Travels[] = [];
  filteredTravels: Travels[] = []; 
  selectedTravel: Travels | null = null;
  isModalOpen: boolean = false;
  isFav: boolean = false;

  startAt: string | null = null;
  endAt: string | null = null;
  searchQuery: string = ''; 

  constructor(
    private languageService: LanguageService,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private translate: TranslateService,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.getTravels();
  }

  async getTravels() {
      const loading = await this.showLoading();
  
      const headers = new HttpHeaders({
        Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
      });
  
      try {
        this.travels = await firstValueFrom(this.http.get<Travels[]>(`${this.apiUrl}/travels/`, { headers }));
        
        this.filteredTravels = [...this.travels];

        loading.dismiss();
  
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

  // Função para filtrar as viagens com base na pesquisa
  filterTravels() {
    const query = this.searchQuery.toLowerCase(); 
    this.filteredTravels = this.travels.filter(travel =>
      travel.prop2 ? travel.prop2.toLowerCase().includes(query) : false
    );
  }

  async openTravelModal(travel: Travels) {
    const modal = await this.modalCtrl.create({
      component: ModalTravelComponent,
      backdropDismiss: false,
      componentProps: { travel: travel }  
    });
    await modal.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading ...',
      duration: 3000,
    });

    loading.present();
    return loading;
  }

  async presentToast(message: string, color: string = 'success') {
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
