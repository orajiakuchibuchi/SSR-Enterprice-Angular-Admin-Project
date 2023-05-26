import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking } from 'src/app/shared/models/Booking';
import { User } from 'src/app/shared/models/User';
import { BookingService } from 'src/app/shared/services/booking/booking.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user$: Observable<User> = this._us.user$;
  isAdmin: Observable<boolean> = this.user$.pipe(
    map((user:User)=>{
      return user.role.includes('Admin')
    })
  );
  successfulBookings:Observable<number> = this._bs.bookings$.pipe(
    map((bookings:Booking[])=>{
      return bookings.filter(b=>b.status=='successful').length;
    })
  )
  pendingBookings:Observable<number> = this._bs.bookings$.pipe(
    map((bookings:Booking[])=>{
      return bookings.filter(b=>b.status=='pending').length;
    })
  )
  spent:Observable<number> = this._bs.bookings$.pipe(
    map((bookings:Booking[])=>{
      // reduce((a, b) => +a + +b.price, 0)
      return bookings.filter(b=>b.status=='successful').reduce((a, b) => +a + +b.payment.amount, 0);
    })
  )
  constructor(private _us: UserService, private _bs: BookingService) { }

  ngOnInit(): void {
  }

}
