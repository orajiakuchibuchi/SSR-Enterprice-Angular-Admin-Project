import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, map, shareReplay, switchMap } from 'rxjs/operators';
import { Role, User, Menu, GUESS, App } from '../../models/Index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../Index';
import { AppService } from '../client/app.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private listOfUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([
  ]);
  private listOfMenu: BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>([]);
  private app_menus:BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>([]);
  public app_Menus$: Observable<Menu[]>;
  // 
  public menu:Map<number, Menu[]> = new Map<number, Menu[]>()
  public listOfViewedRoles: Map<string, Role> = new Map<string, Role>();
  public user$: Observable<User> = this.user.asObservable();
  public list$: Observable<User[]> = this.listOfUsers.asObservable();
  public getAuthUserApi$: Observable<User> = of(GUESS);
  public getUsersApi$: Observable<User[]> = of([]);
  public cleaners$: Observable<User[]> = this.listOfUsers.asObservable().pipe(
    map((users: User[]) => {
      return users.filter(u => u.role?.includes('Cleaner'));
    })
  )
  
  private listOfRoles: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([
    
  ]);
  public roles$: Observable<Role[]> = this.listOfRoles.asObservable().pipe(
    switchMap((res:any)=>this.getRolesApi()),
    shareReplay(1)
  );
  apiUrl: string = environment.api;
  constructor(private http: HttpClient, private _auth: AuthService, private _app: AppService) {
    this.getAuthUserApi$ = this.getAuthUserApi(this._auth.sessionAuth).pipe(
      shareReplay()
    );
    this.getUsersApi$ = this.getUsersApi().pipe(
      shareReplay()
    );
    this.app_Menus$ = this.user$.pipe(
      switchMap((u:any)=>{
        return this.getMenusApi().pipe(
          map((res:any)=>{
            const app:any = this._app.selectedApp.value;
            const menusForAppndRole:any =res.filter((m:any)=>{return (m.roles == 'everyone' || u.role.includes(m.roles)) && m.app_id ==  app.id});
            this.app_menus.next(menusForAppndRole);
            return this.app_menus.value;
          }),
          shareReplay(1)
        )
      })
    );
    this.getUsersApi$ .subscribe(
      list=>this.listOfUsers.next(list)
    );
    this.getAuthUserApi$.subscribe(
      (r:any) => {
        if(r.length){
          this.user.next(r[0]);
        }
      }
    );
   }
  private createUserApi(user: User) {
    return this.http.post(`${this.apiUrl}/users`, user).pipe(
      map(
        (res: any) => {
          const existingList = this.listOfUsers.getValue();
          existingList.push(res);
          this.listOfUsers.next(existingList);
          return {
            status: '200',
            response: 'User successfully registered in the server',
            user,
            res
          }
        }
      )
    );
  }
  private createRoleApi(role: Role) {
    return this.http.post(`${this.apiUrl}/roles`, role).pipe(
      map(
        (res: any) => {
          return {
            status: '200',
            response: `${res.name} role successfully created`,
            role: res
          }
        }
      ),
      tap(
        (res:any)=>{
          const existingList = this.listOfRoles.getValue();
          existingList.unshift(res.role);
          this.listOfRoles.next(existingList);
        }
      )
    );
  }

  listOfUsersValue():User[]{
    return this.listOfUsers.value;
  }

  forgetUser(){
    this.user.next(GUESS);
    if(this._auth.sessionAuth){
      this._auth.clearsessionAuth();
    }
  }
  createRole(role: Role) {
    const doesRoleExist = this.findRole(<string>role.name);
    if (!doesRoleExist) {
      return this.createRoleApi(role);
    } else {
      return of({
        status: '500',
        response: `Role With the name ${role.name} already exists`
      })
    }
  }
  setapp_menus(values:any){
    this.app_menus.next(values);
  }
  findRole(name: string) {
    return this.listOfRoles.value.find(
      (role: Role) => (<string>role.name).trim().toLowerCase() == name.trim().toLowerCase()
    );
  }
  getAuthUserApi(token: any): Observable<any> {
    let headerParams = new HttpParams().set('authToken', token);
    return this.http.get(`${this.apiUrl}/auth`, { params: headerParams })
  }
  getUsersApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`)
  }
  getRolesApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/roles`);
  }
  getMenusApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/menus`);
  }
  createUser(user: any, role: string) {
    const doesUserExist = this.findUser(user.email); 
    if (!doesUserExist) {
      return this.createUserApi(user).pipe(
      )
    } else {
      return of({
        status: '500',
        response: `User witht the email ${user?.email} already exists`,
        user
      })
    }
  }
  findUser(email: string) {
    return this.listOfUsers.value.find(
      (user: User) => user.email?.trim().toLocaleLowerCase().includes(email.trim().toLowerCase())
    );
  }
  checkIfUserHasRole(role: string): Observable<boolean>{
    return this.user.asObservable().pipe(
      map((_user: User) =>_user.role.map(_r=>_r.toLowerCase().trim()).includes(role.toLowerCase()))
    );
  }

  setuser(user:User){
    this.user.next(user);
  }
  getuser(){
    return this.user.value;
  }

}
