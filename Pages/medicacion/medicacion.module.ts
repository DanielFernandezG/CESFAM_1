import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicacionPageRoutingModule } from './medicacion-routing.module';

import { MedicacionPage } from './medicacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicacionPageRoutingModule
  ],
  declarations: [MedicacionPage]
})
export class MedicacionPageModule {}
