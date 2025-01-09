import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { RegisterPage } from './tab2.page';  

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    RegisterPage,
    TranslateModule,
  ],
  declarations: []  
})
export class Tab2PageModule {}
