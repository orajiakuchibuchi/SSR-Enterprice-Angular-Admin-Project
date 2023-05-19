import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Role, User } from '../../models/Index';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user:BehaviorSubject<User> = new BehaviorSubject<any>({});
  private listOfUsers:BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public user$: Observable<User> = this.user.asObservable();
  public list$: Observable<User> = this.user.asObservable();


  private listOfRoles:BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
  public roles$: Observable<Role[]> = this.listOfRoles.asObservable();

  constructor() { }


  private createUserApi(user:User){
    return of({
      status: '200',
      response: 'User Created',
      user
    })
  }
  private createRoleApi(role:Role){
    return of({
      status: '200',
      response: 'Role Created',
      role
    })
  }

  createRole(role: Role){
    const doesRoleExist = this.findRole(<string>role.name);
    if(!doesRoleExist){
      const existingList = this.listOfRoles.getValue();
      role.id = existingList.length;
      role.created_at = new Date(Date.now());
      role.updated_at = role.created_at;
      existingList.push(role);
      this.listOfRoles.next(existingList);
      return this.createRoleApi(role);
    }else{
      return of({
        status: '500',
        response: `Role With the name ${role?.name} already exists`
      })
    }
  }
  findRole(name: string){
    return this.listOfRoles.value.find(
      (role:Role)=>(<string>role.name).trim().toLocaleLowerCase() == name.trim().toLowerCase()
    );
  }
  createUser(user:User, role: string){
    const doesUserExist = this.findUser(user.email);
    const doesRoleExist = this.findRole(role);
    if(!doesRoleExist){
      return of({
        status: '500',
        response: `No role with name ${role} available on platform`
      })
    }
    if(!doesUserExist){
      const existingList = this.listOfUsers.getValue();
      user.id = existingList.length;
      user.role?.push(role);
      existingList.push({
        ...user
      });
      this.listOfUsers.next(existingList);
      return this.createUserApi(user).pipe(
      )
    }else{
      return of({
        status: '500',
        response: `User witht the email ${user?.email} already exists`
      })
    }
  }
  findUser(email: string){
    return this.listOfUsers.value.find(
      (user:User)=>user.email?.trim().toLocaleLowerCase().includes(email.trim().toLowerCase())
    );
  }
  checkIfUserHasRole(role: string){
    return this.listOfUsers.value.find(
      (user:User)=>user.role?.includes(role.toLowerCase())
    );
  }

}
