import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuconfPageRoutingModule } from './usuconf-routing.module';

import { UsuconfPage } from './usuconf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuconfPageRoutingModule
  ],
  declarations: [UsuconfPage]
})
export class UsuconfPageModule {}
