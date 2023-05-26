import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'user-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  users$: Observable<User[]> = this._us.list$.pipe(
    tap((users:User[])=>{
      this.admins = users.filter(u=>u.role?.includes('Admin')).length;
      this.customers = users.filter(u=>u.role?.includes('Customer')).length;
      this.cleaners = users.filter(u=>u.role?.includes('Cleaner')).length;
    })
  )
  admins: number = 0;
  customers: number = 0;
  cleaners: number = 0;

  constructor(private _us: UserService) { }

  ngOnInit(): void {
    
  }
}
