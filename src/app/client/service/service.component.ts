import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['../client.component.scss']
})
export class ServiceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.scrollToTop()
  }
  scrollToTop(){
    window.scrollTo({
      top: 400,
      behavior: 'smooth',
    });
  }

}
