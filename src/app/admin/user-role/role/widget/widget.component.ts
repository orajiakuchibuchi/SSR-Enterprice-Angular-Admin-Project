import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap , map} from 'rxjs/operators';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'role-widget',
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
  totalRoles: Observable<number> = this._us.roles$.pipe(
    map((roles:any)=>{
      return roles.length;
    })
  );
  admins: number = 0;
  customers: number = 0;
  cleaners: number = 0;

  constructor(private _us: UserService) { }

  ngOnInit(): void {
  }

}
