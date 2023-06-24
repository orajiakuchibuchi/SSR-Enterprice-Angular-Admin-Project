import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  users$: Observable<User []> = this._us.list$
  constructor(private _us: UserService) { }

  ngOnInit(): void {
  }

}
