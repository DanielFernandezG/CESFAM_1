import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./Pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./Pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registrar',
    loadChildren: () => import('./Pages/registrar/registrar.module').then( m => m.RegistrarPageModule)
  },


  {
    path: 'eleccion-cita',
    loadChildren: () => import('./Pages/eleccion-cita/eleccion-cita.module').then( m => m.EleccionCitaPageModule)
  },
  {
    path: 'eleccion-fecha-hora',
    loadChildren: () => import('./Pages/eleccion-fecha-hora/eleccion-fecha-hora.module').then( m => m.EleccionFechaHoraPageModule)
  },
  {
    path: 'eleccion-profesional',
    loadChildren: () => import('./Pages/eleccion-profesional/eleccion-profesional.module').then( m => m.EleccionProfesionalPageModule)
  },

  {
    path: 'confirmacion-cita',
    loadChildren: () => import('./Pages/confirmacion-cita/confirmacion-cita.module').then( m => m.ConfirmacionCitaPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
