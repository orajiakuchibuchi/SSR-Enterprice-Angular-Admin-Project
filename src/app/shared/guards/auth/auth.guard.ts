import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/Index';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  public setsessionAuthToken: string | null;
  constructor(private _auth:AuthService, private router: Router){
    this.setsessionAuthToken = this._auth.sessionAuth;
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.setsessionAuthToken = this._auth.sessionAuth;
      if(!this.setsessionAuthToken){
        this.router.navigate(['auth/login']);
        return false;
      }
    return true;
  }
  
}
