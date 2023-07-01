import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Observable, of } from 'rxjs';
import { map , tap, switchMap} from 'rxjs/operators';
import { User , Notification, App, Preference} from '../../models/Index';
import { DeviceService } from '../../services/client/device.service';
import { AuthService } from '../../services/Index';
import { Router } from '@angular/router';
import { AppService } from '../../services/client/app.service';

declare const $:any;
declare const jQuery:any;

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
	user$: Observable<any> = this._us.user$;
	notifications$: Observable<Notification[]> = this._ds.getNotificationApi$;
	config:Observable<Preference> =this._ds.preference$;
	selectedApp:Observable<any> = of(this._app.getLocalApp()).pipe(
		switchMap((res:App|null)=>this._app.selectedApp.asObservable())
	);
	apps: Observable<App[]> = this._app.apps$;
	constructor(private router: Router, 
		private _us: UserService, 
		private _ds: DeviceService, 
		private _app: AppService,
		private _auth: AuthService) { }
  
  ngOnInit(): void {
    		//Layout settings visible
		$('[data-toggle="right-sidebar"]').on("click", function () {
			jQuery(".right-sidebar").addClass("right-sidebar-visible");
		});

		//THEME OPTION CLOSE BUTTON
		$('[data-toggle="right-sidebar-close"]').on("click", function () {
			jQuery
			(".right-sidebar").removeClass("right-sidebar-visible");
		});

  }
  changeColor(preference:any){
	this._ds.setPreference(preference);
  }
  logout(){
    this._auth.logout().subscribe(
      res=>{
        this._us.forgetUser();
        this.router.navigate(['']);
      }
    );
  }
  changeApp(app:App){
	this._app.selectedApp.next(app);
	this._app.saveLocalApp(app);
	this._ds.showPageLoader.next(((200 / 1000) % 60) * 100);
  }
}
