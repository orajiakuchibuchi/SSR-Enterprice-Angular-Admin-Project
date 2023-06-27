import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  tab:string = 'View';
  url:string = '';
  loadForm:boolean = false;
  constructor(private location: Location,private _formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route
    .data
    .subscribe(v => {
      this.tab = v.tab;
      console.log(this.tab)
      this.url = this.router.url;
      if(this.tab == 'Create'){
        this.loadForm = true;
        if((this.url.match(/step/g) || []).length > 1){
          this.location.replaceState(`admin/employee/create#createEmployee`);
        }
      }else{
        this.loadForm = false;
      }
    });
  }
  goto(url:any, tab:string){
    this.tab = tab;
    this.location.replaceState(`/admin/employee/${url}`);
    if(this.tab == 'Create'){
      this.loadForm = true;
      if((this.url.match(/step/g) || []).length > 1){
        this.location.replaceState(`admin/employee/create#createEmployee`);
      }
    }else{
      this.loadForm = false;
    }
    console.log(url);
  }

}
