import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { User } from '../../models/Index';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user:BehaviorSubject<User> = new BehaviorSubject<any>({});
  listOfUsers:BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public user$: Observable<User> = this.user.asObservable();

  constructor() {
    let registedUser =  sessionStorage.getItem('registedUser');
    if(registedUser){
      this.listOfUsers.next(JSON.parse(registedUser));
    }
   }

  private registerApi (user:any){
    let list = this.listOfUsers.value;
    list.push(user);
    sessionStorage.setItem('registedUser', JSON.stringify(list));
    this.listOfUsers.next(list);
    return of({
      status: '200',
      response: 'User successfully registered in the server',
      user
    })
  }
  private loginApi (user:any): Observable<any>{
    let findUser = this.listOfUsers.value.find(u=>u.email ==user.email);
    if(findUser){
      return of({
        status: '200',
        response: 'User authenticated',
        foundUser: findUser
      })
    }
    return of({
      status: '403',
      response: 'User not found. Please register with us.',
      user
    })
  }
  register(data:User){
    return this.registerApi(data);
  }
  login(data:User){
    return this.loginApi(data);
  }
}
