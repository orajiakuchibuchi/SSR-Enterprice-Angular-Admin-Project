import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Role, User } from 'src/app/shared/models/Index';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router'
@Component({
  selector: 'app-role-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  showCreateForm:boolean = false;
  roles$: Observable<Role[]> = this._us.roles$;
  isMaster: Observable<boolean> = this._us.user$.pipe(
    map((res:User)=>res.role.includes('Master'))
  )
  constructor(private _us: UserService, private router:Router) { }

  ngOnInit(): void {
  }
  closeForm(e:any){
    e.preventDefault();
    this.showCreateForm = !this.showCreateForm;
  }
  showRole(role:Role){
    this.router.navigate([`admin/user-role/role/show/${role.id}`])
  }


  saveCompleted(event:any){
    this.showCreateForm = false;
  }

}
