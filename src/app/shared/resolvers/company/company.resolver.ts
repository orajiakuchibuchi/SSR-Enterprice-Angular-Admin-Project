import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CompanyService } from '../../services/company/company.service';
import { UserService } from '../../services/user/user.service';
import { Company } from '../../models/Company';
import {tap, map, take, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyResolver implements Resolve<Company[]> {
  constructor(private _cs: CompanyService, private _us:UserService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Company[]> {
    return this._cs.getCompanysApi$.pipe(
      take(1),
      tap((res:any)=>{
        const local = this._cs.getSessionCompany();
        if(!local && res.length > 0){
          this._cs.saveSessionCompany(res[0]);
        }
      })
    )
    
    // return of(true);
  }
}
