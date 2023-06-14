import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() filterByRole: string = '';
  @Input() showCreateFormTitle: boolean = false;
  @Output() totalUsers:EventEmitter<number> = new EventEmitter<number>();
  showCreateForm:boolean = false;
  users$: Observable<User[]> = this._us.list$.pipe(
    map(
      (users:User[])=>{
        if(this.filterByRole.length > 0){
          return users.filter((u:User)=>u.role.map(r=>r.toLowerCase()).includes(this.filterByRole.toLowerCase().trim()))
        }
        return users;
      }
    )
  )
  constructor(private _us: UserService) { 
    this.totalUsers.emit(0);
  }

  ngOnInit(): void {
    console.log(this.filterByRole)
    this.users$.subscribe(
      u=>{
        console.log(u);
        this.totalUsers.emit(u.length);
      }
    )
  }
  closeForm(e:any){
    e.preventDefault();
    this.showCreateForm = !this.showCreateForm;
  }

  saveCompleted(event:any){
    this.showCreateForm = false;
  }

}
