import { Component, OnInit } from '@angular/core';
import { JobPosition } from 'src/app/shared/models/JobPosition';
import { JobService } from 'src/app/shared/services/recruitment/job.service';
import {Observable} from 'rxjs';
import { shareReplay } from 'rxjs/operators';
@Component({
  selector: 'app-recruitment-position-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  positions$:Observable<JobPosition[]> = this._js.getJobPositionsApi$.pipe(
    shareReplay()
  )
  constructor(private _js: JobService) { }

  ngOnInit(): void {
  }

}
