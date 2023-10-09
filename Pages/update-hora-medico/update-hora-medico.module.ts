import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateHoraMedicoPageRoutingModule } from './update-hora-medico-routing.module';

import { UpdateHoraMedicoPage } from './update-hora-medico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateHoraMedicoPageRoutingModule
  ],
  declarations: [UpdateHoraMedicoPage]
})
export class UpdateHoraMedicoPageModule {}
