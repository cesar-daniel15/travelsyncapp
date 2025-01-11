import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-travel-modal',
  templateUrl: './travel-modal.component.html',
  styleUrls: ['./travel-modal.component.scss'],
})
export class TravelModalComponent {
  @Input() travel: any; // Recebe os detalhes da viagem do componente pai

  locations: string[] = [];

  constructor(private modalController: ModalController) {}

  addLocation(location: string) {
    if (location.trim()) {
      this.locations.push(location);
    }
  }

  closeModal() {
    this.modalController.dismiss({
      updatedTravel: { ...this.travel, locations: this.locations },
    });
  }
}
