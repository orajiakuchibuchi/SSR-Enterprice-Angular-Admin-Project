import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap, map, shareReplay, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Plan, App } from '../../models/Index';

@Injectable({
  providedIn: 'root'
})
export class    AppService {
  private apiUrl: string = environment.api;
  private listOfApps:BehaviorSubject<App[]> = new BehaviorSubject<App[]>([]);
  selectedApp:BehaviorSubject<App | undefined> = new BehaviorSubject<App| undefined>(undefined);
  private getAppsApi$: Observable<App[]> = this.getAppsApi().pipe(
    shareReplay(1)
  );
  apps$: Observable<App[]> = this.getAppsApi$.pipe(
    switchMap((res:any)=>{
      const arrayOne = this.listOfApps.value;
      const arrayTwo = res;
      const results = arrayTwo.filter((app1:any) => !arrayOne.some((app2:any) => app2.id === app1.id));
      if(results.length > 0){
        this.listOfApps.next(res);
      }
      return this.listOfApps.asObservable();
    })
  )
  constructor(private http: HttpClient) { }
  private getAppsApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/apps`)
  }
  saveLocalApp(app:App){
    sessionStorage.setItem('runningApp', JSON.stringify(app));
  }
  getLocalApp(){
    let getLocalApp:any=  sessionStorage.getItem('runningApp');
    let toReturn:App | null = null;
    if(getLocalApp){
      try {
        getLocalApp = JSON.parse(getLocalApp);
        toReturn = getLocalApp;
      } catch (error) {
        sessionStorage.removeItem('runningApp');
        getLocalApp = null;
      }
    }
    return toReturn;
  }
}
