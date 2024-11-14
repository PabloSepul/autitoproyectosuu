import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChoferprogconfirmarPageRoutingModule } from './choferprogconfirmar-routing.module';

import { ChoferprogconfirmarPage } from './choferprogconfirmar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoferprogconfirmarPageRoutingModule
  ],
  declarations: [ChoferprogconfirmarPage]
})
export class ChoferprogconfirmarPageModule {}
