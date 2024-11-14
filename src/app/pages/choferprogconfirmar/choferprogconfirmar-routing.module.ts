import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChoferprogconfirmarPage } from './choferprogconfirmar.page';

const routes: Routes = [
  {
    path: '',
    component: ChoferprogconfirmarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChoferprogconfirmarPageRoutingModule {}
