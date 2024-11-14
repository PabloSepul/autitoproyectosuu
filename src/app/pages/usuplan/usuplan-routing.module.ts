import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuplanPage } from './usuplan.page';

const routes: Routes = [
  {
    path: '',
    component: UsuplanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuplanPageRoutingModule {}
