import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChoferprognotiPage } from './choferprognoti.page';

const routes: Routes = [
  {
    path: '',
    component: ChoferprognotiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChoferprognotiPageRoutingModule {}
