import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  page:string = '';
  constructor(private _us: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route
    .data
    .subscribe(v => this.page = v.component);
  }

}
