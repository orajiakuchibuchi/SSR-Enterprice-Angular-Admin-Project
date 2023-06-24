import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Notification, Preference } from '../../models/Index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map, shareReplay, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
import { NotificationsService } from 'angular2-notifications';


@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  apiUrl: string = environment.api;
  private toastOptions: any = {
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  };
  private listOfNotifications: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  showPageLoader: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  notifications$: Observable<Notification[]> = this.listOfNotifications.asObservable();
  private configuration: BehaviorSubject< Preference > = new BehaviorSubject({
    sideNavColor: ''
  });
  preference$: Observable <Preference> = this.configuration.asObservable().pipe(
    switchMap((_pref: Preference)=>{
      if(!this.localStorageSideNavColor && _pref.sideNavColor.length < 1){
        _pref.sideNavColor = '#021645';
      }
      if(!this.localStorageSideNavColor){
        this.setlocalStorageSideNavColor(_pref.sideNavColor); 
      }
      console.log(_pref);
      return of(_pref);
    }),
    shareReplay()
  );
  public getNotificationApi$: Observable<Notification[]> = this._us.user$.pipe(
    switchMap((user:any)=>{
      if(user.id){
        return this.getNotificationsApi(user)
      }
      return of([])
    }),
    tap((list:any[])=>{
      this.listOfNotifications.next(list)
    }),
    shareReplay()
  );
  private user$: Observable<any> = this._us.user$;
  constructor(private http: HttpClient, private _us: UserService, private _ns: NotificationsService) { 
    this.configuration;
   }
  private getNotificationsApi(user:any): Observable<any> {
    let headerParams = new HttpParams().set('user.userID', user.userID);
    return this.http.get(`${this.apiUrl}/notifications`, {params: headerParams})
  }
  add(event: any) {
    return this.http.post(`${this.apiUrl}/notifications`, event).pipe(
      tap((evnt:any)=>{
        this.listOfNotifications.value.unshift(evnt);
        this.listOfNotifications.next(
          [
            ...this.listOfNotifications.value
          ]
        )
      })
    )

  }

  private get localStorageSideNavColor(){
    return localStorage.getItem('_sidenavcolor');
  }

  private setlocalStorageSideNavColor(value:string){
    localStorage.setItem('_sidenavcolor',value);
  }

  setPreference(preference: Preference){
    this.setlocalStorageSideNavColor(preference.sideNavColor);
    this.configuration.next(preference)
  }


  openSuccessNotification(title:string, content: string, clickHandler?: Function ){
    const _fullOption = {...this.toastOptions,id: this.listOfNotifications.value.length+1}
    const toast = this._ns.success(title, content, _fullOption);
    console.log(toast);
    toast.click?.pipe
    tap((event):any=>{
      console.log(event)
      // if(clickHandler){
      //   clickHandler();
      // }
    })
  }
  openErrorNotification(title:string, content: string, clickHandler?: Function ){
    const toast = this._ns.error(title, content, this.toastOptions);
    toast.click?.subscribe((event)=>{
      if(clickHandler){
        clickHandler();
      }
    })
  }
  openInfoNotification(title:string, content: string, clickHandler?: Function ){
    const toast = this._ns.info(title, content, this.toastOptions);
    toast.click?.subscribe((event)=>{
      if(clickHandler){
        clickHandler();
      }
    })
  }
  
}
