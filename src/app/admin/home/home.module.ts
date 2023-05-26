import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingComponent } from './setting/setting.component';
import { BookingModule } from '../booking/booking.module';
import { NotificationComponent } from './notification/notification.component';


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    SettingComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    BookingModule
  ]
})
export class HomeModule { }
