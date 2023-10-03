import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FechaHoraPage } from './fecha-hora.page';

const routes: Routes = [
  {
    path: '',
    component: FechaHoraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FechaHoraPageRoutingModule {}
