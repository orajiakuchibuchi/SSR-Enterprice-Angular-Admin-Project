import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Department, Plan } from '../../models/Index';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
import { tap, map, shareReplay, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService  {
  private _departments:BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>([]);

  departments$: Observable<Department[]> = this._departments.asObservable();
  departments$_status:'yet'| 'loaded' | 'failed' | 'retried' = 'yet';
  apiUrl: string = environment.api;

  constructor(private http: HttpClient, private _us: UserService) { }

  public getDepartmentsApi$: Observable<Department[]> = this.getDepartmentsApi().pipe(
    tap((res:any[])=>{
      this._departments.next(res)
    }),
    shareReplay()
  );
  private getDepartmentsApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/departments`);
    
  }
  private newDepartmentApi(department:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/departments`, department);
  }
  add(department:any){
    return this.newDepartmentApi(department).pipe(
      tap((res:Department)=>{
        this._departments.value.unshift(res);        
      })
    )

  }
  get departmentsValue(){
    return this._departments.value;
  }

  
}