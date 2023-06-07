import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { shareReplay, tap , map} from 'rxjs/operators';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/User';
import { AuthService } from '../../services/Index';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User> {
  constructor(private _us: UserService, private _auth:AuthService, private router: Router){
    
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this._us.getAuthUserApi(this._auth.sessionAuth).pipe(
      map((res:any[])=>res.pop())
    ).pipe(
      tap((res:any)=>{
        if(res && res.id){
          this._us.setuser(res)
        }else{
          this._auth.clearsessionAuth();
          this.router.navigate(['auth/login']);
        }
      })
    );
  }
}
