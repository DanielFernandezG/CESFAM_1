import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FechaHoraPageRoutingModule } from './fecha-hora-routing.module';

import { FechaHoraPage } from './fecha-hora.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FechaHoraPageRoutingModule
  ],
  declarations: [FechaHoraPage]
})
export class FechaHoraPageModule {}
