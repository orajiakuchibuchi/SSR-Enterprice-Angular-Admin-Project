import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Role } from 'src/app/shared/models/Index';

@Component({
  selector: 'app-role-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  showCreateForm:boolean = false;
  roles$: Observable<Role[]> = this._us.roles$;
  constructor(private _us: UserService) { }

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
