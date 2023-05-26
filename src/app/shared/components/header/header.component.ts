import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<any> = this._us.user$;
  constructor(private _us: UserService) { }

  ngOnInit(): void {
    this.user$.subscribe(
      u=>console.log(u)
    )
  }
  prevent(event:any){
    console.log(event)
    event.preventDefault()
  }

}
