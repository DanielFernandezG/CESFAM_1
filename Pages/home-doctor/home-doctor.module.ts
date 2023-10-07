import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeDoctorPageRoutingModule } from './home-doctor-routing.module';

import { HomeDoctorPage } from './home-doctor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeDoctorPageRoutingModule
  ],
  declarations: [HomeDoctorPage]
})
export class HomeDoctorPageModule {}
