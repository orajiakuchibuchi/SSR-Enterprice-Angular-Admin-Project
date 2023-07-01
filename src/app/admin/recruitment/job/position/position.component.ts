import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {
  tab: string = 'View';
  loadForm:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  goto(url:any, tab:string){
    this.tab = tab;
    // this.location.replaceState(`/admin/employee/${url}`);
    if(this.tab == 'Create'){
      this.loadForm = true;
      // if((this.url.match(/step/g) || []).length > 1){
      //   this.location.replaceState(`admin/employee/create#createEmployee`);
      // }
    }else{
      this.loadForm = false;
    }
    console.log(url);
    console.log(tab);
  }

}
