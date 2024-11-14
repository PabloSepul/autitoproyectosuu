import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChofviajecursoPage } from './chofviajecurso.page';

const routes: Routes = [
  {
    path: '',
    component: ChofviajecursoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChofviajecursoPageRoutingModule {}
