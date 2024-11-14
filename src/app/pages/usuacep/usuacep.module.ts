import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuacepPageRoutingModule } from './usuacep-routing.module';

import { UsuacepPage } from './usuacep.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuacepPageRoutingModule
  ],
  declarations: [UsuacepPage]
})
export class UsuacepPageModule {}
