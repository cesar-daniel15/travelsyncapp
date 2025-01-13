import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-modal-travels-comments',
  templateUrl: './modal-travels-comments.component.html',
  styleUrls: ['./modal-travels-comments.component.scss']
})
export class ModalTravelsCommentsComponent implements OnInit {
  @Input() travelId!: string;  // Recebe o ID da viagem
  comments: string[] = [];  // Lista de comentários
  newComment: string = '';  // Comentário a ser adicionado

  apiUrl: string = 'https://mobile-api-one.vercel.app/api';  // API base

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadComments();  // Carregar os comentários ao iniciar
  }

  loadComments(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer your-auth-token-here`  // Adicione seu token de autenticação
    });

    this.http.get<{ comment: string }[]>(`${this.apiUrl}/travels/${this.travelId}/comments`, { headers })
      .subscribe(response => {
        this.comments = response.map(item => item.comment);  // Supondo que o retorno seja um array de objetos de comentários
      });
  }

  addComment(): void {
    if (!this.newComment) return;  // Evita adicionar comentário vazio

    const headers = new HttpHeaders({
      Authorization: `Bearer your-auth-token-here`  // Coloque seu token de autenticação aqui
    });

    // Enviar comentário via POST
    this.http.post(`${this.apiUrl}/travels/comments`, {
      travelId: this.travelId,
      comment: this.newComment
    }, { headers })
      .subscribe(() => {
        this.comments.push(this.newComment);  // Adiciona o novo comentário
        this.newComment = '';  // Limpa o campo de comentário
      });
  }

  deleteComment(comment: string): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer your-auth-token-here`  // Coloque seu token de autenticação aqui
    });

    this.http.delete(`${this.apiUrl}/travels/comments/${comment}`, { headers })
      .subscribe(() => {
        this.comments = this.comments.filter(c => c !== comment);  // Remove o comentário da lista
      });
  }
}
