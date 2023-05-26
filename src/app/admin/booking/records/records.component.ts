import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingService } from 'src/app/shared/services/booking/booking.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  totalBooking: Observable<number> = this._bs.bookings$.pipe(
    map(((list:any[])=>list.length))
  )
  successBooking: Observable<number> = this._bs.bookings$.pipe(
    map(((list:any[])=>list.filter(l=>l.status =='successful').length))
  )
  pendingBooking: Observable<number> = this._bs.bookings$.pipe(
    map(((list:any[])=>list.filter(l=>l.status =='pending').length))
  )
  constructor(private _bs: BookingService) { }

  ngOnInit(): void {
  
  }

}
