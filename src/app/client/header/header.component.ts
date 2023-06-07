import { Component, OnInit, Input } from '@angular/core';
import {Observable } from 'rxjs';
@Component({
  selector: 'client-header',
  templateUrl: './header.component.html',
  styleUrls: ['../client.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() $user!: Observable<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
