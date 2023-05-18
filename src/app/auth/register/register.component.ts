import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  firstFormGroup = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    country: ['', Validators.required],
    phone: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  isLinear = true;
  saved = false;
  message = '';
  constructor(private _formBuilder: FormBuilder, private auth: AuthService, private router: Router) { }

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
    }
    this.auth.register(user)
    .pipe(
      map(data=>data.response),
      tap(()=>this.saved = true)
    )
    .subscribe(
      response=>{
        this.message = response;

      }
    )
  }
  loginnow(){
    this.router.navigate(['auth/login'])
  }

}
