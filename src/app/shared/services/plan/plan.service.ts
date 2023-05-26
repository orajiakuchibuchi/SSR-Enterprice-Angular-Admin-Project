import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Plan } from '../../models/Index';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private listOfPlans:BehaviorSubject<Plan[]> = new BehaviorSubject<Plan[]>([
    {
      "id": 0,
      "name": "Somto",
      "amount": 10,
      "features": [
          "Iphone 7 red"
      ],
      "suggestion": "Weekly payment"
  }
  ]);
  plans$: Observable<Plan[]> = this.listOfPlans.asObservable();

  constructor() { }

  add(plan:any){
    this.listOfPlans.value.unshift(
      {
        ...plan,
        id: this.listOfPlans.value.length + 1 
      }
    );
    this.listOfPlans.next(
      [
        ...this.listOfPlans.value
      ]
    )
  }
}
