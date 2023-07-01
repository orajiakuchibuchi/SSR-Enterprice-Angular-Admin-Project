
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Department, Plan } from '../../models/Index';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
import { tap, map, shareReplay, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { JobPosition } from '../../models/JobPosition';
import { JobOpening } from '../../models/JobOpening';

@Injectable({
  providedIn: 'root'
})
export class JobService  {
  private _positions:BehaviorSubject<JobPosition[]> = new BehaviorSubject<JobPosition[]>([]);
  private _openings:BehaviorSubject<JobOpening[]> = new BehaviorSubject<JobOpening[]>([]);

  jobPositions$: Observable<JobPosition[]> = this._positions.asObservable();
  jobOpenings$: Observable<JobOpening[]> = this._openings.asObservable();
  departments$_status:'yet'| 'loaded' | 'failed' | 'retried' = 'yet';
  apiUrl: string = environment.api;

  constructor(private http: HttpClient, private _us: UserService) { }

  public getJobPositionsApi$: Observable<JobPosition[]> = this.getJoPositionsApi().pipe(
    tap((res:any[])=>{
      this._positions.next(res)
    }),
    shareReplay()
  );
  public getJobOpeningsApi$: Observable<JobOpening[]> = this.getJobOpeningsApi().pipe(
    tap((res:any[])=>{
      this._openings.next(res)
    }),
    shareReplay()
  );
  private getJoPositionsApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobPositions`);
  }
  private getJobOpeningsApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobOpenings`);
  }
  private newJobPositionApi(position:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobPositions`, position);
  }
  private newJobOpeningApi(position:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobOpenings`, position);
  }
  addPosition(position:any){
    return this.newJobPositionApi(position).pipe(
      tap((res:JobPosition)=>{
        this._positions.value.unshift(res);        
      })
    )
  }
  addOpening(opening:any){
    return this.newJobOpeningApi(opening).pipe(
      tap((res:JobOpening)=>{
        this._openings.value.unshift(res);        
      })
    )
  }
  get jobPositionsValue(){
    return this._positions.value;
  }
  get jobOpeningsValue(){
    return this._openings.value;
  }

  
}