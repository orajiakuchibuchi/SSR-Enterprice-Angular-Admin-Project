import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, switchMap, tap, shareReplay } from 'rxjs/operators';
import { User } from '../../models/Index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: BehaviorSubject<any> = new BehaviorSubject<any>({});
  listOfUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public user$: Observable<User> = this.user.asObservable();
  apiUrl: string = environment.api;
  constructor(private http: HttpClient) {
    let registedUser = sessionStorage.getItem('registedUser');
    if (registedUser) {
      this.listOfUsers.next(JSON.parse(registedUser));
    }
  }

  private generateAuthToken(): string {
    let date = new Date();
    return `Auth-${date.getTime().toString()}-temp-session`;
  }
  private registerApi(user: any) {
    let list = this.listOfUsers.value;
    // user.id = list.length;
    list.push(user);
    sessionStorage.setItem('registedUser', JSON.stringify(list));
    this.listOfUsers.next(list);
    return this.http.post(`${this.apiUrl}/users`, user).pipe(
      map(
        (res: any) => {
          console.log(res);
          return {
            status: '200',
            response: 'User successfully registered in the server',
            user,
            res
          }
        }
      )
    );
    return of({
      status: '200',
      response: 'User successfully registered in the server',
      user
    })
  }
  get sessionAuth(): any {
    return sessionStorage.getItem('_authToken');
  }
  setsessionAuth(token: string) {
    sessionStorage.setItem('_authToken', token)
  }
  clearsessionAuth() {
    sessionStorage.removeItem('_authToken')
  }
  logout(){
    this.clearsessionAuth();
    this.user.next(undefined)
  }

  private authticateUserApi(user: User) {
    // return of({
    //   status: '200',
    //   response: 'User successfully registered in the server',
    //   user
    // })
    user.userID = user.id;
    let authUser:any = user;
    authUser.id = undefined;
    user.authToken = this.generateAuthToken();
    return this.http.post(`${this.apiUrl}/auth`, user).pipe(
      map(
        (res: any) => {
          console.log(res);
          return {
            status: '200',
            response: 'User successfully authenticated',
            user: res,
            res
          }
        }
      )
    );
  }

  private loginApi(user: any): Observable<any> {
    let headerParams = new HttpParams().set('email', user.email).set('password', user.password);
    return this.http.get(`${this.apiUrl}/users`, { params: headerParams }).pipe(
      map(
        (res: any) => {
          console.log(res);
          if (res.length < 1) {
            return {
              status: false,
              message: 'Incorrect credentials. No user found'
            }
          }
          return {
            status: true,
            message: 'User exist',
            user: res[0]
          }
        }
      ),
      switchMap((response: any) => {
        console.log(response);
        if (response.status) {
          return this.authticateUserApi(response.user).pipe(
            tap((response: any) => {
              this.setsessionAuth(response.res.authToken);
              this.user.next(response.res);
            })
          );
        }
        return of(
          {
            status: '403',
            response: response.message
          }
        )
      }),
      shareReplay()
    );
  }

  private getAuthUserApi(token: any): Observable<any> {
    let headerParams = new HttpParams().set('authToken', token);
    return this.http.get(`${this.apiUrl}/auth`, { params: headerParams })
  }
  register(data: any) {
    return this.registerApi(data);
  }
  login(data: User) {
    return this.loginApi(data);
  }
}
