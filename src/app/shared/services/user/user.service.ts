import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, map, shareReplay, switchMap } from 'rxjs/operators';
import { Role, User, Menu, GUESS } from '../../models/Index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../Index';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private listOfUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([
  ]);
  private listOfMenu: BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>([]);
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
  private menus: Menu[] = [
    {
      id: 0,
      name: 'Home',
      icon: 'micon bi bi-house',
      children: [
        {
          id: 0,
          name: 'Dashboard',
          children: [],
          link: 'admin/home/dashboard',
          roles: this.listOfRoles.value
        },
        {
          id: 1,
          name: 'Account',
          children: [],
          link: 'admin/home/setting',
          roles: this.listOfRoles.value
        },
        {
          id: 2,
          name: 'Notification',
          children: [],
          link: 'admin/home/notification',
          roles: this.listOfRoles.value
        }
      ],
      link: undefined,
      roles: this.listOfRoles.value
    },
    {
      id: 1,
      name: 'User & Role Management',
      icon: 'micon bi bi-house',
      children: [
        {
          id: 0,
          name: 'Dashboard',
          children: [],
          link: 'admin/home/dashboard',
          roles: this.listOfRoles.value
        },
        {
          id: 1,
          name: 'Account',
          children: [],
          link: 'admin/home/setting',
          roles: this.listOfRoles.value
        },
        {
          id: 2,
          name: 'Notification',
          children: [],
          link: 'admin/home/notification',
          roles: this.listOfRoles.value
        }
      ],
      link: undefined,
      roles: this.listOfRoles.value
    },
    {
      id: 0,
      name: 'Home',
      icon: 'micon bi bi-house',
      children: [
        {
          id: 0,
          name: 'Dashboard',
          children: [],
          link: 'admin/home/dashboard',
          roles: this.listOfRoles.value
        },
        {
          id: 1,
          name: 'Account',
          children: [],
          link: 'admin/home/setting',
          roles: this.listOfRoles.value
        },
        {
          id: 2,
          name: 'Notification',
          children: [],
          link: 'admin/home/notification',
          roles: this.listOfRoles.value
        }
      ],
      link: undefined,
      roles: this.listOfRoles.value
    },
  ]
  constructor(private http: HttpClient, private _auth: AuthService) {
    this.getAuthUserApi$ = this.getAuthUserApi(this._auth.sessionAuth).pipe(
      shareReplay()
    );
    this.getUsersApi$ = this.getUsersApi().pipe(
      shareReplay()
    );
    this.getUsersApi$ .subscribe(
      list=>this.listOfUsers.next(list)
    )
    this.getAuthUserApi$.subscribe(
      (r:any) => {
        if(r.length){
          this.user.next(r[0]);
        }
      }
    )
   }
  private createUserApi(user: User) {
    return this.http.post(`${this.apiUrl}/users`, user).pipe(
      map(
        (res: any) => {
          console.log(res);
          const existingList = this.listOfUsers.getValue();
          existingList.push(res);
          console.log(existingList)
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
  findRole(name: string) {
    return this.listOfRoles.value.find(
      (role: Role) => (<string>role.name).trim().toLocaleLowerCase() == name.trim().toLowerCase()
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
    return this.http.get(`${this.apiUrl}/roles`)
  }
  createUser(user: any, role: string) {
    const doesUserExist = this.findUser(user.email);
    const doesRoleExist = this.findRole(role);
    if (!doesRoleExist) {
      return of({
        status: '500',
        response: `No role with name ${role} available on platform`
      })
    }
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

}
