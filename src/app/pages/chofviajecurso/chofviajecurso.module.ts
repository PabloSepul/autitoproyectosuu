import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChofviajecursoPageRoutingModule } from './chofviajecurso-routing.module';

import { ChofviajecursoPage } from './chofviajecurso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChofviajecursoPageRoutingModule
  ],
  declarations: [ChofviajecursoPage]
})
export class ChofviajecursoPageModule {}
