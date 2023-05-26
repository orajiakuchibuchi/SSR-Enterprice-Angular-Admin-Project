import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from 'src/app/shared/models/Booking';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user/user.service';
import { tap, map, shareReplay, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  @Input('showLabel') showLabel:boolean = false;
  @Input('showIcon') showIcon:boolean = true;
  @Input('booking') booking!:Booking;
  @Input('index') index!:number;
  statList:string[] = [
    'report request'
  ]
  isAdmin: Observable<boolean> = this._us.checkIfUserHasRole('Admin').pipe(
    tap((res:any)=>{
      if(res){
        this.statList =  [
          'pending', 'successful', 'completed','report request'
        ]
      }
    })
  );
  user$: Observable<User> = this._us.user$;
  cleaners$: Observable<User[]> = this._us.cleaners$;
  constructor(private _us: UserService) { }

  ngOnInit(): void {
    
  }
  updateBooking(){

  }

}
