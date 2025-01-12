import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router'; 
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service'; 

interface Commets{ 
  id: string;
  locationId: string ,
  comment: string ,
}

@Component({
  selector: 'app-modal-locations-comments',
  templateUrl: './modal-locations-comments.component.html',
  styleUrls: ['./modal-locations-comments.component.scss'],
})
export class ModalLocationsCommentsComponent implements OnInit {
  
  apiUrl: string = "https://mobile-api-one.vercel.app/api";
  name: string = "cesar.daniel@ipvc.pt";
  password: string = "uVt(D!u3";

  @Input() locationId: string = '';
  @Input() comments: Commets[] = [];
  comment: string = '';

  constructor(
    private http: HttpClient,  
    private loadingCtrl: LoadingController, 
    private router: Router,
    private modalCtrl: ModalController,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
  }

  async deleteComment(commentId: string) {
    const loading = await this.showLoading();
    
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });
    
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/travels/locations/comments/${commentId}`, { headers }));
      loading.dismiss();
    
      await this.presentToast('Comentario deletado com sucesso!', 'success');
      this.closeModal();
    } catch (error: any) {
      await this.presentToast('Erro ao deletar local.', 'danger');
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
      locationId: this.locationId,
      comment: this.comment, 
    };
    
    try {

      await firstValueFrom(this.http.post<Commets>(`${this.apiUrl}/travels/locations/comments`, newComment, { headers }));
      loading.dismiss();

      await this.presentToast('Commetn ', 'success'); 
      window.location.reload(); 

    } catch (error: any) {
      loading.dismiss();
      await this.presentToast('ERROR_OCCURRED', 'danger'); 
    }
  }
  // Método para fechar o modal
  closeModal() {
    this.modalCtrl.dismiss();
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