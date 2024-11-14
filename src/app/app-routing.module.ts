import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./pages/recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  },
  {
    path: 'confirmacion',
    loadChildren: () => import('./pages/confirmacion/confirmacion.module').then( m => m.ConfirmacionPageModule)
  },
  {
    path: 'logrado',
    loadChildren: () => import('./pages/logrado/logrado.module').then( m => m.LogradoPageModule)
  },
  {
    path: 'choferben',
    loadChildren: () => import('./pages/choferben/choferben.module').then( m => m.ChoferbenPageModule)
  },
  {
    path: 'choferprogviaje',
    loadChildren: () => import('./pages/choferprogviaje/choferprogviaje.module').then( m => m.ChoferprogviajePageModule)
  },
  {
    path: 'choferprogconfirmar',
    loadChildren: () => import('./pages/choferprogconfirmar/choferprogconfirmar.module').then( m => m.ChoferprogconfirmarPageModule)
  },
  {
    path: 'choferprognoti',
    loadChildren: () => import('./pages/choferprognoti/choferprognoti.module').then( m => m.ChoferprognotiPageModule)
  },
  {
    path: 'usuplan',
    loadChildren: () => import('./pages/usuplan/usuplan.module').then( m => m.UsuplanPageModule)
  },
  {
    path: 'usuconf',
    loadChildren: () => import('./pages/usuconf/usuconf.module').then( m => m.UsuconfPageModule)
  },
  {
    path: 'usuesp',
    loadChildren: () => import('./pages/usuesp/usuesp.module').then( m => m.UsuespPageModule)
  },
  {
    path: 'usuacep',
    loadChildren: () => import('./pages/usuacep/usuacep.module').then( m => m.UsuacepPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'ajustes',
    loadChildren: () => import('./pages/ajustes/ajustes.module').then( m => m.AjustesPageModule)
  },
  {
    path: 'chofespera',
    loadChildren: () => import('./pages/chofespera/chofespera.module').then( m => m.ChofesperaPageModule)
  },
  {
    path: 'chofviajecurso',
    loadChildren: () => import('./pages/chofviajecurso/chofviajecurso.module').then( m => m.ChofviajecursoPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
