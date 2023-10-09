import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateHoraMedicoPage } from './update-hora-medico.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateHoraMedicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateHoraMedicoPageRoutingModule {}
