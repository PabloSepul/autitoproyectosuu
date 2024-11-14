import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogradoPage } from './logrado.page';

const routes: Routes = [
  {
    path: '',
    component: LogradoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogradoPageRoutingModule {}
