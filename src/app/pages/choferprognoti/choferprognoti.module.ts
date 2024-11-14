import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChoferprognotiPageRoutingModule } from './choferprognoti-routing.module';

import { ChoferprognotiPage } from './choferprognoti.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoferprognotiPageRoutingModule
  ],
  declarations: [ChoferprognotiPage]
})
export class ChoferprognotiPageModule {}
