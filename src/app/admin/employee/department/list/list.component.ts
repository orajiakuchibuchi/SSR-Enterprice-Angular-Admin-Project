import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DepartmentService } from 'src/app/shared/services/department/department.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  departments:any[] = [];
  constructor(private _deptService:DepartmentService, private activatedRoute: ActivatedRoute) {
    console.log(
      'Activated route data in Component:::',
      this.activatedRoute.data
    );
   }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      result=>console.log(result)
    )
    this._deptService.departments$.subscribe(
      d=>this.departments = d
    )
  }
  departmentEvent(evt:any){
    console.log(evt);
    this.departments.unshift(evt)
  }

}
