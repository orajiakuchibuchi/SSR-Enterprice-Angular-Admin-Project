import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { RecordsComponent } from './records/records.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewComponent } from './view/view.component';


@NgModule({
  declarations: [
    BookingComponent,
    RecordsComponent,
    ListComponent,
    CreateComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    SharedModule
  ],
  exports: [
    ListComponent
  ]
})
export class BookingModule { }
