import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPruebaPageRoutingModule } from './datos-prueba-routing.module';

import { DatosPruebaPage } from './datos-prueba.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPruebaPageRoutingModule
  ],
  declarations: [DatosPruebaPage]
})
export class DatosPruebaPageModule {}
