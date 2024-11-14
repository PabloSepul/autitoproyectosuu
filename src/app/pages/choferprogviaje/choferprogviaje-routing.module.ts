import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChoferprogviajePage } from './choferprogviaje.page';

const routes: Routes = [
  {
    path: '',
    component: ChoferprogviajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChoferprogviajePageRoutingModule {}
