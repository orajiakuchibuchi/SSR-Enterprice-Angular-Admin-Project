import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Plan } from '../../models/Index';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
import { tap, map, shareReplay, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private listOfPlans:BehaviorSubject<Plan[]> = new BehaviorSubject<Plan[]>([]);
  plans$: Observable<Plan[]> = this.listOfPlans.asObservable();
  apiUrl: string = environment.api;
  equalPlans = ( obj1:Plan, obj2:Plan ) => {
    let keyExist = false;
    for ( const [key, value] of Object.entries(obj1) ) {
         // Search each key in reference object and attach a callback function to 
         // compare the two object keys
         console.log("============");
         console.log(key);
         console.log(value);
         console.log("============");
        if( Object.keys(obj2).some( ( e ) => e == key ) ) {
            keyExist = true;
        }
    }
    
    return keyExist;
    
    }
  public getPlansApi$: Observable<Plan[]> = this.getPlansApi().pipe(
    tap((res:any[])=>{
      this.listOfPlans.next(res)
    }),
    shareReplay(1)
  );
  constructor(private http: HttpClient, private _us: UserService) { }
  private getPlansApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/plans`)
  }
  add(plan:any){
    return this.http.post(`${this.apiUrl}/plans`, plan).pipe(
      tap((evnt:any)=>{
        this.listOfPlans.value.unshift(evnt);
        this.listOfPlans.next(
          [
            ...this.listOfPlans.value
          ]
        )
      })
    );
  }
}
