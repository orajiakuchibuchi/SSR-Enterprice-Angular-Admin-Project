import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {
  page:string = '';
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route
    .data
    .subscribe(v => this.page = v.component);
  }

}
