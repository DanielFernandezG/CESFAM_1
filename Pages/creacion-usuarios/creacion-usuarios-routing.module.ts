import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreacionUsuariosPage } from './creacion-usuarios.page';

const routes: Routes = [
  {
    path: '',
    component: CreacionUsuariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreacionUsuariosPageRoutingModule {}
