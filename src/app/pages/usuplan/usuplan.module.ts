import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuplanPageRoutingModule } from './usuplan-routing.module';

import { UsuplanPage } from './usuplan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuplanPageRoutingModule
  ],
  declarations: [UsuplanPage]
})
export class UsuplanPageModule {}
