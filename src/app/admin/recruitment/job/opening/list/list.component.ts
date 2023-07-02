import { Component, OnInit } from '@angular/core';
import { JobPosition } from 'src/app/shared/models/JobPosition';
import { JobService } from 'src/app/shared/services/recruitment/job.service';
import {Observable} from 'rxjs';
import { shareReplay,tap } from 'rxjs/operators';
import { JobOpening } from 'src/app/shared/models/JobOpening';
import { DeviceService } from 'src/app/shared/services/client/device.service';

@Component({
  selector: 'app-recruitment-opening-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  creating:boolean = false;
  opening$:Observable<JobOpening[]> = this._js.getJobOpeningsApi$.pipe(
    shareReplay()
  );

  constructor(private _js: JobService, private _ds: DeviceService) { }

  ngOnInit(): void {
    this.opening$.subscribe()
  }
  translate(key:string){
    return `${key.replace('_', ' ')}`;
  }
  copied(url:string){
    let opt = {...this._ds.toastOptions, theClass: 'welcome-modal', timeOut:3000 };
    this._ds.oSuccessNotification('Copied Job Opening URL', `${url} copied to clipboard.`, opt);
  }

}