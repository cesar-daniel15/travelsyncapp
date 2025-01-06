import { Component } from '@angular/core';

@Component({
  selector: 'app-favorite-trips',
  templateUrl: './favorite-trips.page.html',
  styleUrls: ['./favorite-trips.page.scss'],
})
export class FavoriteTripsPage {
  lugaresFavoritos: string[] = [
    'Praia de Copacabana',
    'Monte Everest',
    'Torre Eiffel',
    'Grand Canyon'
  ];

  constructor() {}

  acao(lugar: string) {
    console.log(`Ação para: ${lugar}`);
    // Adicione a lógica para a ação aqui
  }

  deletar(lugar: string) {
    this.lugaresFavoritos = this.lugaresFavoritos.filter(l => l !== lugar);
    console.log(`Deletado: ${lugar}`);
  }
}