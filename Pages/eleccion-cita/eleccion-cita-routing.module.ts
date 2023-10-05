import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EleccionCitaPage } from './eleccion-cita.page';

const routes: Routes = [
  {
    path: '',
    component: EleccionCitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EleccionCitaPageRoutingModule {}
