import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuconfPage } from './usuconf.page';

const routes: Routes = [
  {
    path: '',
    component: UsuconfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuconfPageRoutingModule {}
