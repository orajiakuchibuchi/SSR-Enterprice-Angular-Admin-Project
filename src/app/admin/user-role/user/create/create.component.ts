import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/Index';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/shared/models/Role';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  firstFormGroup = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    country: ['', Validators.required],
    phone: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', [Validators.required]],
  });
  isLinear = true;
  saved = false;
  message = '';
  assignableRole:Observable<Role[]> = this._us.roles$.pipe(
    map((roles:Role[])=>{
      return roles.filter(r=>r.name == 'Admin' || r.name =='Cleaner')
    })
  );
  @Output() hasSaved: EventEmitter<Role> = new EventEmitter<Role>();
  constructor(private _us: UserService,private _formBuilder: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  get firstControls(){
    return this.firstFormGroup.controls;
  }
  get secondControls(){
    return this.secondFormGroup.controls;
  }
  submit(){
    let user = {
      firstName: this.firstControls.firstName.value,
      lastName: this.firstControls.lastName.value,
      country: this.firstControls.country.value,
      phone: this.firstControls.phone.value,
      email: this.secondControls.email.value,
      password: this.secondControls.password.value,
      role: [this.secondControls.role.value],
      created_at: new Date(Date.now()).toISOString(),
      updated_at: new Date(Date.now()).toISOString(),
      status:'Active',
    }
    this._us.createUser(user, user.role[0])
    .pipe(
      map(data=>data),
      tap(()=>this.saved = true)
    )
    .subscribe(
      (response:any)=>{
        this.message = response.response;
        if(response.user){
          this.hasSaved.emit(response.user);
        }
      }
    )
  }
  loginnow(){
    this.router.navigate(['auth/login'])
  }

}
