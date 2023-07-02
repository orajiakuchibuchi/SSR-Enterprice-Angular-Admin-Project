import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, shareReplay, map } from 'rxjs/operators';
import { UserService } from '../shared/services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/Index';
import { DeviceService } from '../shared/services/client/device.service';
import { AppService } from '../shared/services/client/app.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  today:any = new Date().toISOString().slice(0, 16);
  $user: Observable<any> = this._us.getAuthUserApi$.pipe(
    map((res: any) => {
      if (res.length && res.length > 0) {
        return res[0];
      }
      return undefined;
    })
  );
  $apps: Observable<any> = this._apps.apps$;
  urL: string = '/';
  _routeEvent$: Observable<any> = this.router.events.pipe(
    shareReplay(1),
  );
  isloggedIn: any = null;
  meeting:any = {
    name: '',
    email:'',
    phone: '',
    app: '',
    free_day_1: '',
    free_day_2: '',
    created_at: '',
    updated_at: '',
  }
  constructor(private _apps:AppService,private _us: UserService, private router: Router, private _as: AuthService, private _ds: DeviceService) {
  }

  ngOnInit(): void {
    this.isloggedIn = this._as.sessionAuth;
    this._routeEvent$.subscribe((e: any) => {
      if (e && e.urlAfterRedirects) {
        this.urL = e.urlAfterRedirects
      }
    })
  }

  submit(){
    let message:string = ``;
    this.meeting.created_at = this.today;
    this.meeting.updated_at = this.today;
    let toastOptions = this._ds.toastOptions;
    let timeOut:number = 0;
    for (const [key, value] of Object.entries(this.meeting)) {
      const v: any = value;
      if(!v){
        message+=`${key.replace('_', ' ').toLocaleLowerCase()} required\n`;
        timeOut+=2;
      }
      if(key =='email' && !(<string>v).includes('@')){
        message+=`Please enter a valid ${key.replace('_', ' ').toLocaleLowerCase()} address\n`;
        timeOut+=2;
      }
    }
    if(message.length > 0){
      timeOut = timeOut*1000;
      toastOptions = {...toastOptions, timeOut};
      console.log(timeOut)
      this._ds.oErrorNotification(`Unable to schedule meeting`, `Invalid form was submitted.\nReason: ${message}`, toastOptions);
      return;
    }
    this._ds.openSuccessNotification('Schedule submitted', 'Your schedule has been submitted');
    this.meeting = {
      name: '',
      email:'',
      phone: '',
      app: '',
      free_day_1: '',
      free_day_2: '',
      created_at: '',
      updated_at: '',
    }
  }

}
