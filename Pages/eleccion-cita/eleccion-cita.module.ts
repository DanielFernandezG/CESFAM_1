import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EleccionCitaPageRoutingModule } from './eleccion-cita-routing.module';

import { EleccionCitaPage } from './eleccion-cita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EleccionCitaPageRoutingModule
  ],
  declarations: [EleccionCitaPage]
})
export class EleccionCitaPageModule {}
