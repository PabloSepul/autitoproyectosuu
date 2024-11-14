import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuespPage } from './usuesp.page';

const routes: Routes = [
  {
    path: '',
    component: UsuespPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuespPageRoutingModule {}
