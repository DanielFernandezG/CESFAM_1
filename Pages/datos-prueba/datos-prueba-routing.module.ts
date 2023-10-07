import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosPruebaPage } from './datos-prueba.page';

const routes: Routes = [
  {
    path: '',
    component: DatosPruebaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosPruebaPageRoutingModule {}
