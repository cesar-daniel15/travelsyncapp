import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { ModalController, NavParams } from '@ionic/angular';

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

interface Commets{ 
  id: string;
  locationId: string ,
  comment: string ,
}

@Component({
  selector: 'app-modal-travel',
  templateUrl: './modal-travel.component.html',
  styleUrls: ['./modal-travel.component.scss'],
})
export class ModalTravelComponent  implements OnInit {
  apiUrl: string = "https://mobile-api-one.vercel.app/api";
  name: string = "cesar.daniel@ipvc.pt";
  password: string = "uVt(D!u3";

  travel!: Travels;
  @Input() comments: Commets[] = [];
  @Input() traveld: string = '';
  comment: string = '';

  type: string | null = null;
  state: string | null = null;
  description: string | null = null;
  isFav: boolean = false;
  prop2: string | null = null;
  startAt:  string | null = null;
  endAt: string | null = null;

  selectedType: Type | null = null;
  selectedState: State | null = null;

  constructor(
    private languageService: LanguageService,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private translate: TranslateService,
    private navParams: NavParams, 
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (this.travel) {
      this.type = this.travel.type;
      this.state = this.travel.state;
      this.description = this.travel.description;
      this.isFav = this.travel.isFav;
      this.prop2 = this.travel.prop2
      this.startAt = this.travel.startAt;
      this.endAt = this.travel.endAt;
      this.selectedType = this.travel.type; 
      this.selectedState = this.travel.state
    }
  }

  async putTravel() {
    const loading = await this.showLoading();

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    
    if (this.selectedState === State.Finished) {
      this.endAt = new Date().toISOString().split('T')[0];
    }
  
    if (this.selectedState === State.Starting) {
      this.startAt = new Date().toISOString().split('T')[0]; 
    }


    var updatedNote = { 
      ...this.travel, 
      description: this.description, 
      state: this.selectedState, 
      priority: this.selectedType,
      prop2: this.prop2,
      isFav: this.isFav,
      startAt: this.startAt, 
      endAt: this.endAt
    }

    try {
      await firstValueFrom(this.http.put<Travels>(`${this.apiUrl}/travels/${this.travel.id}`, updatedNote, { headers }));
      loading.dismiss();

      await this.presentToast('TRAVEL_UPDATED', 'success'); 

      this.dismissModal();

      window.location.reload(); 
      
    } catch (error : any) {
      loading.dismiss();
      await this.presentToast(error.error, 'danger');
    }
  }

  closeModal() {
    this.modalCtrl.dismiss({
      role: 'cancel'
    });
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  saveChanges() {
    this.putTravel();
    this.modalCtrl.dismiss({
      role: 'confirm',
    });
  }

  async deleteTravel() {
    const loading = await this.showLoading();

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/travels/${this.travel.id}`, { headers }));
      loading.dismiss();

      await this.presentToast('TRAVEL_DELETED', 'success'); 
      
      window.location.reload(); 
      
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

  async deleteComment(commentId: string) {
    const loading = await this.showLoading();
    
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });
    
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/travels/comments/${commentId}`, { headers }));
      loading.dismiss();
    
      await this.presentToast('COMMENT_DELETED', 'sucess'); 
      this.closeModal();
      window.location.reload(); 

    } catch (error: any) {
      await this.presentToast('ERROR_OCCURRED', 'danger'); 
      loading.dismiss();
      window.location.reload(); 
    }
  }

    async postComment() {
      const loading = await this.showLoading();
  
      const headers = new HttpHeaders({
        Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
      });
    
      const newComment = {
        locationId: this.traveld,
        comment: this.comment, 
      };
      
      try {
  
        await firstValueFrom(this.http.post<Commets>(`${this.apiUrl}/travels/comments`, newComment, { headers }));
        loading.dismiss();
  
        await this.presentToast('COMMENT_CREATED', 'success'); 
        window.location.reload(); 
  
      } catch (error: any) {
        loading.dismiss();
        await this.presentToast('ERROR_OCCURRED', 'danger'); 
      }
    }

  switchLanguage(language: string) {
    this.languageService.setLanguage(language);
  }

  getCurrentLanguage() {
    return this.languageService.getLanguage();
  }
}
