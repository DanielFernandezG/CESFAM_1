import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FichaMedicoPageRoutingModule } from './ficha-medico-routing.module';

import { FichaMedicoPage } from './ficha-medico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FichaMedicoPageRoutingModule
  ],
  declarations: [FichaMedicoPage]
})
export class FichaMedicoPageModule {}
