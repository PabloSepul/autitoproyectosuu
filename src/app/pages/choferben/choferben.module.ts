import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChoferbenPageRoutingModule } from './choferben-routing.module';

import { ChoferbenPage } from './choferben.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoferbenPageRoutingModule
  ],
  declarations: [ChoferbenPage]
})
export class ChoferbenPageModule {}
