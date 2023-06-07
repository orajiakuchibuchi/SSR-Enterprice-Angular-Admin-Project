import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../client.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router) { }

  navigateTo(route:any){
    this.router.navigate([route])
  }

  ngOnInit(): void {
    this.scrollToTop()
  }
  scrollToTop(){
    window.scrollTo({
      top: 200,
      behavior: 'smooth',
    });
  }

}
