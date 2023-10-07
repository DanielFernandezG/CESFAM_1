import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeSecretariaPage } from './home-secretaria.page';

const routes: Routes = [
  {
    path: '',
    component: HomeSecretariaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeSecretariaPageRoutingModule {}
