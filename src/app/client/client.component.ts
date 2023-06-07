import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, shareReplay, map } from 'rxjs/operators';
import { UserService } from '../shared/services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/Index';
import { DeviceService } from '../shared/services/client/device.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  $user: Observable<any> = this._us.getAuthUserApi$.pipe(
    map((res: any) => {
      if (res.length && res.length > 0) {
        return res[0];
      }
      return undefined;
    })
  );
  urL: string = '/';
  _routeEvent$: Observable<any> = this.router.events.pipe(
    shareReplay(1),
  );
  isloggedIn: any = null;
  constructor(private _us: UserService, private router: Router, private _as: AuthService, private _ds: DeviceService) {
  }

  ngOnInit(): void {
    this._ds.openSuccessNotification('Testing', 'Testing notification');
    this.isloggedIn = this._as.sessionAuth;
    this._routeEvent$.subscribe((e: any) => {
      if (e && e.urlAfterRedirects) {
        this.urL = e.urlAfterRedirects
      }
    })
  }

}
