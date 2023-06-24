import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-department-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  departments:any[] = [];
  constructor() { }

  ngOnInit(): void {
  }
  departmentEvent(evt:any){
    console.log(evt);
    this.departments.unshift(evt)
  }

}
