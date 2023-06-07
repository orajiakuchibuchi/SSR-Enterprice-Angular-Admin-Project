import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['../client.component.scss']
})
export class AboutComponent implements OnInit {

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
