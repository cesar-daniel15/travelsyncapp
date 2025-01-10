import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

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
  description: string;
  type: Type;
  state: State;
  map: null;
  startAt: string | null;
  endAt: null;
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
  name: string = "rubenbenedito@ipvc.pt";
  password: string = "K6$yTp2Q";

  travels: Travels[] = [];
  selectedTravel: Travels | null = null;
  isModalOpen: boolean = false;
  isFav: boolean = false;  // Variável auxiliar para controlar o checkbox

  constructor(
    private languageService: LanguageService,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private translate: TranslateService
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
      this.travels = await firstValueFrom(
        this.http.get<Travels[]>(`${this.apiUrl}/travels`, { headers })
      );
      loading.dismiss();
    } catch (error: any) {
      loading.dismiss();
      await this.presentToast(error.error, 'danger');
    }
  }

  openTravelDetails(travel: Travels) {
    this.selectedTravel = travel;
    this.isFav = travel.isFav;  // Inicializa o estado do checkbox
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTravel = null;
  }

  async deleteTravel(travelId: string | null) {
    if (!travelId) return;

    const loading = await this.showLoading();

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/travels/${travelId}`, { headers })
      );
      this.travels = this.travels.filter(travel => travel.id !== travelId);
      loading.dismiss();
      this.isModalOpen = false;
      await this.presentToast('Travel deleted successfully.', 'success');
    } catch (error: any) {
      loading.dismiss();
      await this.presentToast('Failed to delete travel.', 'danger');
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














// mal
async saveChanges() {
  if (!this.selectedTravel) return;

  const loading = await this.showLoading();

  const headers = new HttpHeaders({
    Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
  });

  try {
    const updatedTravel = {
      ...this.selectedTravel,
      isFav: this.isFav, // Atualiza o valor de isFav antes de salvar
    };

    // Envia a solicitação PUT para salvar as mudanças
    await firstValueFrom(
      this.http.put(`${this.apiUrl}/travels/${this.selectedTravel.id}`, updatedTravel, { headers })
    );

    // Atualiza a lista local de viagens com os novos dados
    this.travels = this.travels.map(travel =>
      travel.id === this.selectedTravel?.id ? updatedTravel : travel
    );

    loading.dismiss();
    this.isModalOpen = false;
    await this.presentToast('Changes saved successfully.', 'success');
  } catch (error: any) {
    loading.dismiss();
    await this.presentToast('Failed to save changes.', 'danger');
  }
}

  onFavChange(event: any) {
    this.isFav = event.detail.checked; // Atualiza o estado de isFav ao alterar o checkbox
  }

  
  cancelChanges() {
    console.log('Changes discarded');
    this.closeModal();  // Fechar o modal sem salvar as mudanças
  }


}
