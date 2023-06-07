import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User , Notification} from '../../models/Index';
import { DeviceService } from '../../services/client/device.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  panelOpenState = false;
  notifications$: Observable<Notification[]> = this._ds.getNotificationApi$
  constructor(private _ds: DeviceService) { }

  ngOnInit(): void {
    this.notifications$.subscribe(
      l=>console.log(l)
    )
  }

}
