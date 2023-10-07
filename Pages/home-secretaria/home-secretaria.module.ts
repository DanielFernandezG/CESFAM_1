import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeSecretariaPageRoutingModule } from './home-secretaria-routing.module';

import { HomeSecretariaPage } from './home-secretaria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeSecretariaPageRoutingModule
  ],
  declarations: [HomeSecretariaPage]
})
export class HomeSecretariaPageModule {}
