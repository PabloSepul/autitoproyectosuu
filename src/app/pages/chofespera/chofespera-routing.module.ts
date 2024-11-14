import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChofesperaPage } from './chofespera.page';

const routes: Routes = [
  {
    path: '',
    component: ChofesperaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChofesperaPageRoutingModule {}
