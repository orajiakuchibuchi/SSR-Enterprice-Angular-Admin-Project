import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Notification } from '../../models/Index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map, shareReplay, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
import { NotificationsService } from 'angular2-notifications';


@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private listOfNotifications: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  private toastOptions: any = {
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  };
  notifications$: Observable<Notification[]> = this.listOfNotifications.asObservable();
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
  apiUrl: string = environment.api;
  emailApiUrl: string = environment.emailApi;
  private user$: Observable<any> = this._us.user$;
  constructor(private http: HttpClient, private _us: UserService, private _ns: NotificationsService) {  }
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
  mail(event: any) {
    return this.http.post(`${this.emailApiUrl}`, event).pipe(
      tap((evnt:any)=>{
        console.log(evnt)
      })
    )

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
