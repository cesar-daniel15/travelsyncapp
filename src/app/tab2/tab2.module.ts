import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { RegisterPage } from './tab2.page';  
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    RegisterPage  
  ],
  declarations: []  
})
export class Tab2PageModule {}
