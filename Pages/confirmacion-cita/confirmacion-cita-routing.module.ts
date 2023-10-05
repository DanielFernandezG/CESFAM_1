import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmacionCitaPage } from './confirmacion-cita.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmacionCitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmacionCitaPageRoutingModule {}
