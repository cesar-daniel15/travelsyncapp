import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3PageRoutingModule } from './tab3-routing.module'; 
import { FavoriteTripsPage } from './tab3.page'; 
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
    Tab3PageRoutingModule,
    TranslateModule,
    FavoriteTripsPage,
  ],
})
export class Tab3PageModule {}