import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChoferbenPage } from './choferben.page';

const routes: Routes = [
  {
    path: '',
    component: ChoferbenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChoferbenPageRoutingModule {}
