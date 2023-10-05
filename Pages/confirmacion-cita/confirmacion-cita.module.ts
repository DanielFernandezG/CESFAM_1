import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmacionCitaPageRoutingModule } from './confirmacion-cita-routing.module';

import { ConfirmacionCitaPage } from './confirmacion-cita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmacionCitaPageRoutingModule
  ],
  declarations: [ConfirmacionCitaPage]
})
export class ConfirmacionCitaPageModule {}
