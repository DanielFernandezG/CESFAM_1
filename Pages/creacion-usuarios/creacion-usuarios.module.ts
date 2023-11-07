import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreacionUsuariosPageRoutingModule } from './creacion-usuarios-routing.module';

import { CreacionUsuariosPage } from './creacion-usuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreacionUsuariosPageRoutingModule
  ],
  declarations: [CreacionUsuariosPage]
})
export class CreacionUsuariosPageModule {}
