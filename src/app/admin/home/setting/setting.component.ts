import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  $user:Observable<any> = this._us.user$;
  changingPassword:boolean = false;
  constructor(private _us: UserService) { }

  ngOnInit(): void {
  }

  save(user:any){
    console.log(user)
  }
  submit(){
    
  }

}
