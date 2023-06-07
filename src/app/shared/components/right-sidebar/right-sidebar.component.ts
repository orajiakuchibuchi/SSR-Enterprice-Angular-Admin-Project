import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User , Notification} from '../../models/Index';
import { DeviceService } from '../../services/client/device.service';

declare const $:any;
declare const jQuery:any;

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
	user$: Observable<any> = this._us.user$;
	notifications$: Observable<Notification[]> = this._ds.getNotificationApi$
	constructor(private _us: UserService, private _ds: DeviceService) { }
  
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

}
