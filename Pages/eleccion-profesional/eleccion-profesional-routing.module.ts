import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EleccionProfesionalPage } from './eleccion-profesional.page';

const routes: Routes = [
  {
    path: '',
    component: EleccionProfesionalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EleccionProfesionalPageRoutingModule {}
