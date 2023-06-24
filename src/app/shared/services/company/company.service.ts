import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Company } from '../../models/Index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
import { tap, map, shareReplay, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  company:any = null;
  private listOfCompanys:BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>([]);
  companys$: Observable<Company[]> = this.listOfCompanys.asObservable();
  apiUrl: string = environment.api;
  equalCompanys = ( obj1:Company, obj2:Company ) => {
    let keyExist = false;
    for ( const [key, value] of Object.entries(obj1) ) {
        if( Object.keys(obj2).some( ( e ) => e == key ) ) {
            keyExist = true;
        }
    }
    
    return keyExist;
    
    }
  public getCompanysApi$: Observable<Company[]> = this.getCompanysApi().pipe(
    tap((res:any[])=>{
      console.log(res)
      this.listOfCompanys.next(res)
    }),
    shareReplay(1)
  );
  constructor(private http: HttpClient, private _us: UserService) { }
  private getCompanysApi(): Observable<any> {
    return this._us.user$.pipe(
      switchMap((res:any)=>{
        let headerParams = new HttpParams().set('userId', res.id);
        return this.http.get(`${this.apiUrl}/companys`, {params: headerParams});
      })
    )
  }
  saveSessionCompany(res:any){
    localStorage.setItem('runningCompany', JSON.stringify(res));
  }
  getSessionCompany(){
    return localStorage.getItem('runningCompany');
  }
  add(company:any){
    return this.http.post(`${this.apiUrl}/companys`, company).pipe(
      tap((evnt:any)=>{
        this.listOfCompanys.value.unshift(
          {
            ...evnt,
            id: this.listOfCompanys.value.length + 1 
          }
        );
        this.listOfCompanys.next(
          [
            ...this.listOfCompanys.value
          ]
        )
      })
    );
  }
}
