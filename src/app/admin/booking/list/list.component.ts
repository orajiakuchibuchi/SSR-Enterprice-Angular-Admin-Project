import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Booking } from 'src/app/shared/models/Index';
import { BookingService } from 'src/app/shared/services/booking/booking.service';
@Component({
  selector: 'booking-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() title:boolean = true;
  @Input() showCreateButton:boolean = true;
  showCreateForm:boolean = false;
  bookings$: Observable<Booking[]> = this._bs.bookings$;
  constructor(private _us: UserService, private _bs: BookingService) { }

  ngOnInit(): void {
  }
  closeForm(e:any){
    e.preventDefault();
    this.showCreateForm = !this.showCreateForm;
  }

  saveCompleted(event:any){
    this.showCreateForm = false;
  }

}
