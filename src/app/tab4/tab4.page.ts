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

function isValidType(type: any): type is Type {
  return type === Type.Business || type === Type.Leisure;
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

  type: Type | null = null;
  state: State | null = null;
  description: string | null = null;
  travels: Travels[] = [];
  selectedTravel: Travels | null = null;
  isModalOpen: boolean = false;
  isFav: boolean = false;

  startAt: string | null = null;
  endAt: string | null = null;
  minDate: string = new Date().toISOString(); // Para garantir que a data mínima seja a data atual

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
      const response = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/travels`, { headers })
      );

      this.travels = response.map(travel => ({
        ...travel,
        type: isValidType(travel.type) ? travel.type : null,
        state: travel.state ? travel.state : null,
      }));

      loading.dismiss();
    } catch (error: any) {
      loading.dismiss();
      await this.presentToast(error.error || 'Error fetching data', 'danger');
    }
  }

  openTravelDetails(travel: Travels) {
    this.selectedTravel = travel;
    this.type = travel.type;
    this.state = travel.state;
    this.description = travel.description;
    this.isFav = travel.isFav;
    this.startAt = travel.startAt;
    this.endAt = travel.endAt;
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

  // Função para salvar as alterações
  async saveChanges() {
    if (!this.selectedTravel) return;

    // Se o status for 'Starting' e não tiver startAt, preenche com a data atual de criação
    if (this.state === State.Starting && !this.startAt) {
      this.startAt = new Date().toISOString();
    }

    // Se o status for 'Finished' e não tiver endAt, preenche com a data de atualização
    if (this.state === State.Finished && !this.endAt) {
      this.endAt = new Date().toISOString();
    }

    if (!this.type || !this.state || !this.description) {
      await this.presentToast('All fields must be filled out.', 'danger');
      return;
    }

    const loading = await this.showLoading();
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      const updatedTravel = {
        ...this.selectedTravel,
        type: this.type,
        state: this.state,
        description: this.description,
        isFav: this.isFav,
        startAt: this.startAt,
        endAt: this.endAt,
      };

      const response = await firstValueFrom(
        this.http.put(`${this.apiUrl}/travels/${this.selectedTravel.id}`, updatedTravel, { headers })
      );

      this.travels = this.travels.map(travel =>
        travel.id === this.selectedTravel?.id ? updatedTravel : travel
      );

      loading.dismiss();
      this.isModalOpen = false;
      this.selectedTravel = null;
      await this.presentToast('Changes saved successfully.', 'success');
    } catch (error: any) {
      loading.dismiss();
      await this.presentToast('Failed to save changes.', 'danger');
    }
  }

  onStateChange() {
    // Lógica para atualizar as datas com base no estado
    if (this.state === State.Starting && !this.startAt) {
      this.startAt = new Date().toISOString();  // Definir startAt para a data atual
    }

    if (this.state === State.Finished && !this.endAt) {
      this.endAt = new Date().toISOString();  // Definir endAt para a data atual
    }
  }

  onFavChange(event: CustomEvent) {
    this.isFav = event.detail.value;
  }

  cancelChanges() {
    this.closeModal();
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
