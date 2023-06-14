import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppService } from '../../services/client/app.service';
import { App } from '../../models/Index';
import {tap, map, take} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AppResolver implements Resolve<App> {
  constructor(private _app: AppService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<App> {
    const localApp:any = this._app.getLocalApp();
    return this._app.apps$.pipe(
      take(1),
      // map((res:App[])=>{
      //   if(localApp && localApp.id){
      //     const appExists = res.find(_a=>_a.id == localApp.id);
      //     if(appExists){
      //       this._app.saveLocalApp(appExists);
      //       console.log(appExists)
      //       return appExists;
      //     }else{
      //       this._app.saveLocalApp(res[0]);
      //       return res[0];
      //     }
      //   }else{
      //     this._app.saveLocalApp(res[0]);
      //     return res[0];
      //   }
      // }),
      tap((res:any)=>{
        console.log(res);
        if(localApp && localApp.id){
          const appExists = res.find((_a:App)=>_a.id == localApp.id);
          if(appExists){
            this._app.saveLocalApp(appExists);
            this._app.selectedApp.next(appExists);
          }else{
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
