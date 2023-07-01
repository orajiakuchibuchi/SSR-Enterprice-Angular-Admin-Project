import { Component, OnInit } from '@angular/core';
import { JobPosition } from 'src/app/shared/models/JobPosition';
import { JobService } from 'src/app/shared/services/recruitment/job.service';
import {Observable} from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { JobOpening } from 'src/app/shared/models/JobOpening';
@Component({
  selector: 'app-recruitment-opening-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  creating:boolean = false;
  opening$:Observable<JobOpening[]> = this._js.getJobOpeningsApi$.pipe(
    shareReplay()
  )
  constructor(private _js: JobService) { }

  ngOnInit(): void {
  }

}
