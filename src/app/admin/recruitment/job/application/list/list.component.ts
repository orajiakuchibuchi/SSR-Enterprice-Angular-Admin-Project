import { Component, OnInit } from '@angular/core';
import { JobPosition } from 'src/app/shared/models/JobPosition';
import { JobService } from 'src/app/shared/services/recruitment/job.service';
import {Observable} from 'rxjs';
import { shareReplay,tap } from 'rxjs/operators';
import { JobOpening } from 'src/app/shared/models/JobOpening';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { DeviceService } from 'src/app/shared/services/client/device.service';

@Component({
  selector: 'app-recruitment-application-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ListComponent implements OnInit {
  creating:boolean = false;
  dataSource = [];
  opening$:Observable<JobOpening[]> = this._js.getJobOpeningsApi$.pipe(
    tap((res:any)=>{
      this.dataSource=res;
    }),
    shareReplay()
  );
  columnsToDisplay = ['title', 'code', 'deadline', 'status', 'public_url'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: JobOpening | null = null;

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