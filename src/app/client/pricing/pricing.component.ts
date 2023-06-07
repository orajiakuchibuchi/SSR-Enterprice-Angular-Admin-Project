import { Component, OnInit } from '@angular/core';
import { Plan } from 'src/app/shared/models/Plan';
import {Observable} from 'rxjs';
import { PlanService } from 'src/app/shared/services/plan/plan.service';
import { Router } from '@angular/router';
@Component({
  selector: 'client-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  prices$:Observable<Plan[]> = this._ps.getPlansApi$;
  constructor(private _ps: PlanService, private router:Router) { }

  ngOnInit(): void {

    // setInterval(
    //   ()=>{
    //     this.prices$.subscribe(res=>console.log(res));
    //   }, 3000
    // )
  }
  navigateTo(route:string){
    this.router.navigate([route]).finally(
      ()=>this.scrollToTop()
    );
  }
  scrollToTop(){
    window.scrollTo({
      top: 100,
      behavior: 'smooth',
    });
  }

}
