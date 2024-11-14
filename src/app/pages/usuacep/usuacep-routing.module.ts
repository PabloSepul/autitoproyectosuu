import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuacepPage } from './usuacep.page';

const routes: Routes = [
  {
    path: '',
    component: UsuacepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuacepPageRoutingModule {}
