import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogradoPageRoutingModule } from './logrado-routing.module';

import { LogradoPage } from './logrado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogradoPageRoutingModule
  ],
  declarations: [LogradoPage]
})
export class LogradoPageModule {}
