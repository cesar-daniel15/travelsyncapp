// post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://mobile-api-one.vercel.app/api'; // URL da API

  constructor(private httpClient: HttpClient) { }

  // Método para deletar um local
  deleteLocation(locationId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/travels/locations/${locationId}`);
  }
}