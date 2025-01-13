import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
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
  comments: string[]; // Alterado para um array de comentários
}

@Component({
  selector: 'app-modal-travel',
  templateUrl: './modal-travel.component.html',
  styleUrls: ['./modal-travel.component.scss'],
})
export class ModalTravelComponent implements OnInit {
  apiUrl: string = "https://mobile-api-one.vercel.app/api";
  name: string = "cesar.daniel@ipvc.pt";
  password: string = "uVt(D!u3";

  travel!: Travels;
  type: string | null = null;
  state: string | null = null;
  description: string | null = null;
  isFav: boolean = false;
  prop2: string | null = null;
  startAt: string | null = null;
  endAt: string | null = null;
  comments: string[] = []; // Alterado para um array de comentários

  selectedType: Type | null = null;
  selectedState: State | null = null;
  newComment: string = ''; // Variável para armazenar o novo comentário

  constructor(
    private languageService: LanguageService,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private translate: TranslateService,
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    if (this.travel) {
      this.type = this.travel.type;
      this.state = this.travel.state;
      this.description = this.travel.description;
      this.isFav = this.travel.isFav;
      this.prop2 = this.travel.prop2;
      this.startAt = this.travel.startAt;
      this.endAt = this.travel.endAt;
      this.comments = this.travel.comments || []; // Inicializa a lista de comentários
      this.selectedType = this.travel.type;
      this.selectedState = this.travel.state;
    }
  }

  // Função para adicionar comentário
  addComment(newComment: string) {
    if (newComment.trim()) {
      this.comments.push(newComment); // Adiciona o novo comentário à lista de comentários
      this.saveComment(newComment);  // Envia o comentário para a API
      this.newComment = '';  // Limpa o campo de texto após adicionar o comentário
    }
  }

  // Função para salvar o comentário na API
  saveComment(newComment: string) {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    // Exemplo de corpo de requisição para salvar comentário
    const commentData = {
      travelId: this.travel.id,
      comment: newComment
    };

    this.http.post(`${this.apiUrl}/travels/comments`, commentData, { headers }).subscribe(
      (response) => {
        console.log("Comentário enviado com sucesso:", response);
        // Atualiza a lista de comentários após o envio
        this.comments.push(newComment);
        this.saveChanges();  // Salva as mudanças na viagem, incluindo os comentários
      },
      (error) => {
        console.error("Erro ao enviar comentário:", error);
      }
    );
  }

  // Função para atualizar a viagem
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

    const updatedNote = {
      ...this.travel,
      description: this.description,
      state: this.selectedState,
      priority: this.selectedType,
      prop2: this.prop2,
      isFav: this.isFav,
      startAt: this.startAt,
      endAt: this.endAt,
      comments: this.comments, // Incluindo os comentários
    };

    try {
      await firstValueFrom(this.http.put<Travels>(`${this.apiUrl}/travels/${this.travel.id}`, updatedNote, { headers }));
      loading.dismiss();

      await this.presentToast(`Travel successfully updated 🚀`, 'success');
      this.dismissModal();

      window.location.reload();
    } catch (error: any) {
      loading.dismiss();
      await this.presentToast(error.error, 'danger');
    }
  }

  closeModal() {
    this.modalCtrl.dismiss({
      role: 'cancel',
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

      await this.presentToast(`Travel successfully deleted 🚀`, 'success');
      window.location.reload();
    } catch (error: any) {
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
