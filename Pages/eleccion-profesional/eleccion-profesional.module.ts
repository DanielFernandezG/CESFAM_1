import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EleccionProfesionalPageRoutingModule } from './eleccion-profesional-routing.module';

import { EleccionProfesionalPage } from './eleccion-profesional.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EleccionProfesionalPageRoutingModule
  ],
  declarations: [EleccionProfesionalPage]
})
export class EleccionProfesionalPageModule {}
