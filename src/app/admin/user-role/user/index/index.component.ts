import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(private _us: UserService) { }

  ngOnInit(): void {
    
  }

}
