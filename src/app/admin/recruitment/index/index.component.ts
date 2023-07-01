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
  tab:string = 'Home';
  url:string = '';
  constructor(private location: Location,private _formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route
    .data
    .subscribe(v => {
      this.tab = v.tab;
      console.log(this.tab)
      this.url = this.router.url;
      
    });
  }
  goto(url:any, tab:string){
    this.tab = tab;
    this.location.replaceState(`/admin/file-manager/${url}`);
  }

}
