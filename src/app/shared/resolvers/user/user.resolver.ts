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
  public getUserApi$: Observable<User>;
  constructor(private _us: UserService, private _auth:AuthService, private router: Router){
    this.getUserApi$ = this._us.getAuthUserApi(this._auth.sessionAuth).pipe(
      map(res=>res.length>0 ? res[0] : null),
      shareReplay()
    );
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.getUserApi$.pipe(
      tap((res:any)=>{
        if(res.id){
          this._us.setuser(res)
        }else{
          this._auth.clearsessionAuth();
          this.router.navigate(['auth/login']);
        }
      })
    );
  }
}
