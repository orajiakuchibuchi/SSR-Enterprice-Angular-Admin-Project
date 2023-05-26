import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  showCreateForm:boolean = false;
  users$: Observable<User[]> = this._us.list$
  constructor(private _us: UserService) { }

  ngOnInit(): void {
    this.users$.subscribe(
      u=>console.log(u)
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
