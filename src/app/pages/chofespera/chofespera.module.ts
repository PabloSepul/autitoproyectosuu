import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChofesperaPageRoutingModule } from './chofespera-routing.module';

import { ChofesperaPage } from './chofespera.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChofesperaPageRoutingModule
  ],
  declarations: [ChofesperaPage]
})
export class ChofesperaPageModule {}
