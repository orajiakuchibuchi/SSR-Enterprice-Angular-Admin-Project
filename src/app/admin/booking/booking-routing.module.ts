import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking.component';
import { RecordsComponent } from './records/records.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: BookingComponent,
    children: [
      {
        path: '',
        component: RecordsComponent
      },
      {
        path: 'records',
        component: RecordsComponent
      },
      {
        path: 'all',
        component: ListComponent
      },
      // {
      //   path: 'all-users',
      //   component: UserIndex
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
