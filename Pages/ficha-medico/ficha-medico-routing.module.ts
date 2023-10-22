import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FichaMedicoPage } from './ficha-medico.page';

const routes: Routes = [
  {
    path: '',
    component: FichaMedicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FichaMedicoPageRoutingModule {}
