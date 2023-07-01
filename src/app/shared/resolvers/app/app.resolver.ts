import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppService } from '../../services/client/app.service';
import { App } from '../../models/Index';
import {tap, map, take, switchMap} from 'rxjs/operators';
import { UserService } from '../../services/user/user.service';
@Injectable({
  providedIn: 'root'
})
export class AppResolver implements Resolve<App> {
  constructor(private _app: AppService, private _us: UserService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<App> {
    const localApp:any = this._app.getLocalApp();
    return this._app.apps$.pipe(
      take(1),
      tap((res:any)=>{
        if(localApp && localApp.id){
          let appExists = res.find((_a:App)=>_a.id == localApp.id);
          if(appExists){
            this._app.saveLocalApp(appExists);
            this._app.selectedApp.next(appExists);
          }else{
            appExists = res[0];
            this._app.saveLocalApp(res[0]);
            this._app.selectedApp.next(res[0]);
          }
        }else{
          this._app.saveLocalApp(res[0]);
          this._app.selectedApp.next(res[0]);
        }
      })
    );
  }
}
