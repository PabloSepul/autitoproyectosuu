import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChoferprogviajePageRoutingModule } from './choferprogviaje-routing.module';

import { ChoferprogviajePage } from './choferprogviaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoferprogviajePageRoutingModule
  ],
  declarations: [ChoferprogviajePage]
})
export class ChoferprogviajePageModule {}
