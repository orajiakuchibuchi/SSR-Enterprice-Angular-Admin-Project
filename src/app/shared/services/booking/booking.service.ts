import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Booking } from '../../models/Index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map, shareReplay, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';


@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private listOfBookings: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>([
  ]);
  bookings$: Observable<Booking[]> = this.listOfBookings.asObservable();
  public getBookingApi$: Observable<Booking[]> = this._us.user$.pipe(
    switchMap((user:any)=>{
      if(user.id){
        return this.getBookingsApi(user.role, user)
      }
      return of([])
    }),
    shareReplay()
  );
  apiUrl: string = environment.api;
  private user$: Observable<any> = this._us.user$;
  constructor(private http: HttpClient, private _us: UserService) { 
    this.getBookingApi$.subscribe(
      list=>this.listOfBookings.next(list)
    )
  }
  private getBookingsApi(role:any, user?:any): Observable<any> {
    if(role.includes('Admin')){
      return this.http.get(`${this.apiUrl}/bookings`)
    }
    let headerParams = new HttpParams().set('user.id', user.userID);
    return this.http.get(`${this.apiUrl}/bookings`, {params: headerParams})
  }
  add(event: any) {
    return this.http.post(`${this.apiUrl}/bookings`, event).pipe(
      tap((evnt:any)=>{
        this.listOfBookings.value.unshift(evnt);
        this.listOfBookings.next(
          [
            ...this.listOfBookings.value
          ]
        )
      })
    )

  }
}
