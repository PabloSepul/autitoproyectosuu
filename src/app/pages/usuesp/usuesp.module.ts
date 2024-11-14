import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuespPageRoutingModule } from './usuesp-routing.module';

import { UsuespPage } from './usuesp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuespPageRoutingModule
  ],
  declarations: [UsuespPage]
})
export class UsuespPageModule {}
