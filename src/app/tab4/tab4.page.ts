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
  filteredTravels: Travels[] = []; // Lista filtrada
  selectedTravel: Travels | null = null;
  isModalOpen: boolean = false;
  isFav: boolean = false;

  startAt: string | null = null;
  endAt: string | null = null;
  minDate: string = new Date().toISOString(); // Garantir que a data mínima seja a data atual
  searchQuery: string = ''; // Variável para armazenar o valor da pesquisa

  constructor(
    private languageService: LanguageService,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getTravels();
  }

  // Função para formatar a data no formato "DD/MM/YYYY"
  formatDate(date: string): string {
    const formattedDate = new Date(date);
    const day = String(formattedDate.getDate()).padStart(2, '0');
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const year = formattedDate.getFullYear();
    return `${day}/${month}/${year}`;
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
        startAt: travel.startAt ? this.formatDate(travel.startAt) : null,
        endAt: travel.endAt ? this.formatDate(travel.endAt) : null,
      }));

      // Inicializa a lista filtrada com todos os itens
      this.filteredTravels = [...this.travels];
      loading.dismiss();
    } catch (error: any) {
      loading.dismiss();
      await this.presentToast(error.error || 'Error fetching data', 'danger');
    }
  }

  // Função para filtrar as viagens com base na pesquisa
  filterTravels() {
    const query = this.searchQuery.toLowerCase(); // Obtém o valor da pesquisa em minúsculas
    this.filteredTravels = this.travels.filter(travel =>
      travel.prop2 ? travel.prop2.toLowerCase().includes(query) : false
    );
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
      this.filteredTravels = this.filteredTravels.filter(travel => travel.id !== travelId); // Remove também da lista filtrada
      loading.dismiss();
      this.isModalOpen = false;
      await this.presentToast('Travel deleted successfully.', 'success');
    } catch (error: any) {
      loading.dismiss();
      await this.presentToast('Failed to delete travel.', 'danger');
    }
  }

  async saveChanges() {
    if (!this.selectedTravel) return;

    if (!this.type || !this.state || !this.description) {
      await this.presentToast('All fields must be filled out.', 'danger');
      return;
    }

    if (this.state === State.Starting && !this.startAt) {
      this.startAt = this.formatDate(new Date().toISOString());
    }

    if (this.state === State.Finished && !this.endAt) {
      this.endAt = this.formatDate(new Date().toISOString());
    }

    const loading = await this.showLoading();
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    const updatedTravel = {
      ...this.selectedTravel,
      type: this.type, // Certifique-se de usar o valor atualizado de type
      state: this.state,
      description: this.description,
      isFav: this.isFav, // Certifique-se de usar o valor atualizado de isFav
      startAt: this.startAt,
      endAt: this.endAt,
    };

    try {
      await firstValueFrom(
        this.http.put(`${this.apiUrl}/travels/${this.selectedTravel.id}`, updatedTravel, { headers })
      );

      this.travels = this.travels.map(travel =>
        travel.id === this.selectedTravel?.id ? updatedTravel : travel
      );
      this.filteredTravels = this.filteredTravels.map(travel =>
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
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${
      (currentDate.getMonth() + 1).toString().padStart(2, '0')
    }/${currentDate.getFullYear()}`;

    if (this.state === State.Starting && !this.startAt) {
      this.startAt = formattedDate;
    }

    if (this.state === State.Finished && !this.endAt) {
      this.endAt = formattedDate;
    }
  }

  onFavChange(event: CustomEvent) {
    this.isFav = event.detail.checked; // Use `checked` para obter o valor booleano do toggle/checkbox
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
