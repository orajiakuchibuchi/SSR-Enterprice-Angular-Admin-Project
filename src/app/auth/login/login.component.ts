import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/Index';
import { AuthService } from 'src/app/shared/services/Index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  message: any = '';
  constructor(private formBuilder: FormBuilder, private auth: AuthService) {
    this.loginForm = this.formBuilder.group({
      created_at: [new Date(Date.now()), Validators.required],
      submited_at: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_type: ['password', Validators.required]
    });
   }
   timeToSet: VoidFunction = () => setTimeout(() => {
    this.clearBrowserAutoFill()
    this.loginForm.controls.created_at.setValue(new Date(Date.now()));
   }, 1000);
  ngAfterViewInit(): void {
    this.timeToSet();
  }

  ngOnInit(): void {

  }

  setpassword_type(){
    let status = this.password_type == 'text' ? 'password' : 'text';
    this.loginForm.controls.password_type.setValue(status);
  }
  get password_type(){
    return this.loginForm.controls.password_type.value;
  }
  signIn(event:any){
    event.preventDefault();
    this.message = '';
    this.loginForm.controls.submited_at.setValue(new Date(Date.now()))
    console.log(this.loginForm);
    this.resetFormStyle();
    const password = (<HTMLInputElement>document.getElementById('password'));
    const email = (<HTMLInputElement>document.getElementById('email'));
    if(this.loginForm.controls.email.status == 'INVALID'){
      email.classList.add('error-border');
    }else{
      email.classList.add('sucess-border');
    }
    if(this.loginForm.controls.password.status == 'INVALID'){
      password.classList.add('error-border');
    }else{
      password.classList.add('sucess-border');
    }
    if(!this.loginForm.valid){
      this.loginForm.controls.submited_at.setValue(null)
      return;
    }
    const user = this.postUserToServer();
    this.auth.login(user).subscribe(
      res=>{
        console.log(res);
        this.message = res.response;
      },
      err =>{
        console.log(err)
      }
    )
  }
  resetFormStyle(){
    const password = (<HTMLInputElement>document.getElementById('password'));
    const email = (<HTMLInputElement>document.getElementById('email'));
    email.classList.remove('error-border');
    password.classList.remove('error-border');
    email.classList.remove('no-border');
    password.classList.remove('no-border');
    email.classList.remove('sucess-border');
    password.classList.remove('sucess-border');
  }

  postUserToServer():User{
    let user:any = {};
    Object.entries(this.loginForm.value).forEach(
      ([key, v]) => {
        if(key != 'created_at' && key != 'submited_at'){
          user[key] = (<string>v)
        }
      }
    );
    return user;
  }

  clearBrowserAutoFill(){
    const password = (<HTMLInputElement>document.getElementById('password'));
    const email = (<HTMLInputElement>document.getElementById('email'));
    password.value = " ".trim();
    email.value = " ".trim();
  }

}
