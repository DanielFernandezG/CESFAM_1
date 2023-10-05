import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EleccionFechaHoraPage } from './eleccion-fecha-hora.page';

const routes: Routes = [
  {
    path: '',
    component: EleccionFechaHoraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EleccionFechaHoraPageRoutingModule {}
