import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-travel-modal',
  templateUrl: './travel-modal.component.html',
  styleUrls: ['./travel-modal.component.scss'],
})
export class TravelModalComponent {

  @Input() travelId: string = '';
  apiUrl: string = "https://mobile-api-one.vercel.app/api";
  locations: any[] = []; // Array para armazenar os locais
  description: string = '';
  prop1: string = '';
  prop2: string = '';
  name: string = "pedroboaventura@ipvc.pt";
  password: string = "L4%xNz3W";


  constructor(
    private http: HttpClient,  
    private loadingCtrl: LoadingController, 
    private router: Router,
    private modalCtrl: ModalController // Injeção do ModalController
  ) {}

  ngOnInit() {
    this.getLocations(); // Chama o método para buscar os locais ao inicializar
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
      console.error('Error fetching locations:', error);
    }
  }

  async deleteLocation(locationId: string) {
    const loading = await this.showLoading();
  
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });
  
    try {
      // Usando a URL correta para deletar o local
      await firstValueFrom(this.http.delete(`${this.apiUrl}/travels/locations/${locationId}`, { headers }));
      loading.dismiss();
  
      // Atualiza a lista de locais após a exclusão
      this.locations = this.locations.filter(location => location.id !== locationId);
      await this.presentToast('Local deletado com sucesso!', 'success');
    } catch (error: any) {
      loading.dismiss();
      console.error('Erro ao deletar local:', error); // Log do erro para depuração
      await this.presentToast('Erro ao deletar local.', 'danger');
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
  
    console.log('Posting new location:', newLocation); // Adicione este log
  
    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}/travels/locations`, newLocation, { headers }));
      
      loading.dismiss();
      await this.presentToast('LOCATION_CREATED', 'success');
      this.closeModal(); // Feche o modal após a criação
    } catch (error: any) {
      loading.dismiss();
      console.error('Error posting location:', error); // Adicione este log
      await this.presentToast('ERROR_OCCURRED', 'danger');
    }
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
    const message = messageKey; // Se você tiver a tradução, use o `translate.instant(messageKey)`
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
    this.modalCtrl.dismiss(); // Fecha o modal
  }
}
