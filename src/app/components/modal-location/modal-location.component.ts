import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service'; 


@Component({
  selector: 'app-modal-location',
  templateUrl: './modal-location.component.html',
  styleUrls: ['./modal-location.component.scss'],
})

export class ModalLocationComponent  implements OnInit {

  apiUrl: string = "https://mobile-api-one.vercel.app/api";
  name: string = "cesar.daniel@ipvc.pt";
  password: string = "uVt(D!u3";

  @Input() travelId: string = '';
  locations: any[] = []; 
  description: string = '';
  prop1: string = '';
  prop2: string = '';

  constructor(
    private http: HttpClient,  
    private loadingCtrl: LoadingController, 
    private router: Router,
    private modalCtrl: ModalController,
    private languageService: LanguageService, 
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getLocations(); 
  }

  async getLocations() {
    const loading = await this.showLoading();
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      this.locations = await firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/travels/${this.travelId}/locations`, { headers }));
      loading.dismiss();
    } catch (error) {
      loading.dismiss();
    }
  }

  async deleteLocation(locationId: string) {
    const loading = await this.showLoading();
  
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });
  
    try {

      await firstValueFrom(this.http.delete(`${this.apiUrl}/travels/locations/${locationId}`, { headers }));
      loading.dismiss();
  
      this.locations = this.locations.filter(location => location.id !== locationId);

      await this.presentToast('LOCATION_DELETED', 'success'); 
    } catch (error: any) {

      loading.dismiss();

      await this.presentToast('ERROR_OCCURRED', 'danger'); 

      this.closeModal(); 
    }
  }

  async updateLocation(locationId: string) {
    const loading = await this.showLoading();
  
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });
  
    const locationToUpdate = this.locations.find(location => location.id === locationId);
  
    if (!locationToUpdate) {
      loading.dismiss();
      await this.presentToast('ERROR_OCCURRED', 'danger'); 
      return;
    }
  
    const updatedLocation = {
      description: locationToUpdate.description, 
    };
  
    try {
      await firstValueFrom(this.http.put(`${this.apiUrl}/travels/locations/${locationId}`, updatedLocation, { headers }));
      loading.dismiss();
  
      this.locations = this.locations.map(location => 
        location.id === locationId ? { ...location, ...updatedLocation } : location
      );

      await this.presentToast('LOCATION_UPDATED', 'success'); 

      this.closeModal(); 

    } catch (error: any) {
      loading.dismiss();
      await this.presentToast('ERROR_OCCURRED', 'danger'); 
    }
  }

  // Método para adicionar um local à viagem
  async postLocation() {
    const loading = await this.showLoading();
  
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });
  
    const newLocation = {
      travelId: this.travelId,
      description: this.description,
      prop1: this.prop1,
      prop2: this.prop2,
      createdBy: this.name,
    };
  
  
    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}/travels/locations`, newLocation, { headers }));
      
      loading.dismiss();
      await this.presentToast('LOCATION_CREATED', 'success');
      this.closeModal(); 
    } catch (error: any) {
      loading.dismiss();
      await this.presentToast('ERROR_OCCURRED', 'danger'); 
    }
  }

  // Método para motrar a tela de carregamento
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

  // Método para fechar o modal
  closeModal() {
    this.modalCtrl.dismiss();
  }

  switchLanguage(language: string) {
    this.languageService.setLanguage(language);
  }

  getCurrentLanguage() {
    return this.languageService.getLanguage();
  }

}
