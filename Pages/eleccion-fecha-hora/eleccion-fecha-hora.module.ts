import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EleccionFechaHoraPageRoutingModule } from './eleccion-fecha-hora-routing.module';

import { EleccionFechaHoraPage } from './eleccion-fecha-hora.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EleccionFechaHoraPageRoutingModule
  ],
  declarations: [EleccionFechaHoraPage]
})
export class EleccionFechaHoraPageModule {}
