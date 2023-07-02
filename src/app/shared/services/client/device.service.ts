import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Notification, Preference } from '../../models/Index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map, shareReplay, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
import { NotificationsService, Notification as Ang2Notification } from 'angular2-notifications';
import { ScriptsService } from './scripts.service';


@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  apiUrl: string = environment.api;
  toastOptions: any = {
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxStack: 2,
    preventLastDuplicates: true,
  };
  private listOfNotifications: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  showPageLoader: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _availableId: BehaviorSubject<number> = new BehaviorSubject<number>(this._sservice.generateRandomAlphanumeric(5));
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
      return of(this.listOfNotifications.value)
    }),
    map((res:any)=>{
      let val = this.listOfNotifications.value;
      var ids = new Set(val.map(d => d.id));
      var merged = [...val, ...res.filter((d:any) => !ids.has(d.id))];
      merged.sort((a: Notification, b: Notification) => {
        return (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime();
      }).reverse();
      this.listOfNotifications.next(merged);
      return merged;
    }),
    shareReplay()
  );
  private user$: Observable<any> = this._us.user$;
  constructor(private http: HttpClient, private _sservice:ScriptsService, private _us: UserService, private _ns: NotificationsService) { 
    this.configuration;
   }
  private getNotificationsApi(user:any): Observable<any> {
    let headerParams = new HttpParams().set('user.userID', user.userID);
    return this.http.get(`${this.apiUrl}/notifications`, {params: headerParams});
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
  get availableId():number{
    const _availableId = this._availableId.value;
    this._availableId.next(this._sservice.generateRandomAlphanumeric(5));
    return _availableId;
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
    const _fullOption = {...this.toastOptions,id: this.availableId}
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
  oErrorNotification(title:string, content: string,options:Ang2Notification = this.toastOptions ){
    this.toastOptions = {...this.toastOptions,id: this.availableId}
    const list = this.listOfNotifications.value;
    const user: any = this._us.getuser;
    const today: any = new Date(Date.now());
    list.unshift({
      id: this.toastOptions.id,
      title,
      message: content,
      status: 'unseen',
      userID: user ? user.id : 0,
      created_at: today,
      updated_at: today
    })
    this.listOfNotifications.next(list);
    this._ns.error(title, content, {...options,id: this.toastOptions.id});
  }
  oSuccessNotification(title:string, content: string, options:Ang2Notification = this.toastOptions ){
    this.toastOptions = {...this.toastOptions,id: this.availableId}
    const list = this.listOfNotifications.value;
    const user: any = this._us.getuser;
    const today: any = new Date(Date.now());
    list.unshift({
      id: this.toastOptions.id,
      title,
      message: content,
      status: 'unseen',
      userID: user ? user.id : 0,
      created_at: today,
      updated_at: today
    })
    this.listOfNotifications.next(list);
    this._ns.success(title, content, {...options,id: this.toastOptions.id});
  }
  oInfoNotification(title:string, content: string, options:Ang2Notification = this.toastOptions ){
    this.toastOptions = {...this.toastOptions,id: this.availableId}
    const list = this.listOfNotifications.value;
    const user: any = this._us.getuser;
    const today: any = new Date(Date.now());
    list.unshift({
      id: this.toastOptions.id,
      title,
      message: content,
      status: 'unseen',
      userID: user ? user.id : 0,
      created_at: today,
      updated_at: today
    })
    this.listOfNotifications.next(list);
    this._ns.info(title, content, {...options,id: this.toastOptions.id});
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
