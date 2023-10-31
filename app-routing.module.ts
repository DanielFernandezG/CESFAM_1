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
    path: 'actualizar-datos',
    loadChildren: () => import('./Pages/actualizar-datos/actualizar-datos.module').then( m => m.ActualizarDatosPageModule)
  },

  {
    path: 'eleccion-cita',
    loadChildren: () => import('./Pages/eleccion-cita/eleccion-cita.module').then( m => m.EleccionCitaPageModule)
  },
  {
    path: 'home-doctor',
    loadChildren: () => import('./Pages/home-doctor/home-doctor.module').then( m => m.HomeDoctorPageModule)
  },
  {
    path: 'home-secretaria',
    loadChildren: () => import('./Pages/home-secretaria/home-secretaria.module').then( m => m.HomeSecretariaPageModule)
  },
  {
    path: 'datos-prueba',
    loadChildren: () => import('./Pages/datos-prueba/datos-prueba.module').then( m => m.DatosPruebaPageModule)
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./Pages/recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  },
  {
    path: 'ficha-medico',
    loadChildren: () => import('./Pages/ficha-medico/ficha-medico.module').then( m => m.FichaMedicoPageModule)
  },
  {
    path: 'medicacion',
    loadChildren: () => import('./Pages/medicacion/medicacion.module').then( m => m.MedicacionPageModule)
  },
  {
    path: 'pdf',
    loadChildren: () => import('./Pages/pdf/pdf.module').then( m => m.PdfPageModule)
  },  {
    path: 'ver',
    loadChildren: () => import('./Pages/ver/ver.module').then( m => m.VerPageModule)
  },






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
