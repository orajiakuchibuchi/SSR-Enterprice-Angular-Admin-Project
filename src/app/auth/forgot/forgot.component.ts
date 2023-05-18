
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/Index';
import { AuthService } from 'src/app/shared/services/Index';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit, AfterViewInit {
  forgotForm: FormGroup;
  message: any = '';
  changed: boolean = false;
  constructor(private formBuilder: FormBuilder, private auth: AuthService) {
    this.forgotForm = this.formBuilder.group({
      created_at: [new Date(Date.now()), Validators.required],
      submited_at: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      email_status: ['yet', [Validators.required]],
      code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(5)]],
      code_status: ['yet', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmationpassword: ['', [Validators.required, Validators.minLength(6)]],
      password_type: ['password', Validators.required]
    });
  }
  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {

  }

  setpassword_type(){
    let status = this.password_type == 'text' ? 'password' : 'text';
    this.forgotForm.controls.password_type.setValue(status);
  }
  get email_status(){
    return this.forgotForm.controls.email_status.value;
  }
  get code_status(){
    return this.forgotForm.controls.code_status.value;
  }
  get password_status(){
    return this.forgotForm.controls.password.status;
  }
  get password_type(){
    return this.forgotForm.controls.password_type.value;
  }
  processForEmail(){
    const email = (<HTMLInputElement>document.getElementById('email'));
    email.classList.remove('error-border');
    email.classList.remove('no-border');
    email.classList.remove('sucess-border');
    if(this.forgotForm.controls.email.status == 'INVALID'){
      email.classList.add('error-boarder');
      this.message = 'Email is invalid';
    }else{
      this.forgotForm.controls.email_status.setValue('approved');
    }
  }
  processForCode(){
    const code = (<HTMLInputElement>document.getElementById('code'));
    code.classList.remove('error-border');
    code.classList.remove('no-border');
    code.classList.remove('sucess-border');
    if(this.forgotForm.controls.code.status == 'INVALID'){
      code.classList.add('error-boarder');
      this.message = 'Code is invalid';
    }else{
      this.forgotForm.controls.code_status.setValue('approved');
      this.forgotForm.controls.email_status.setValue('pending code');
    }
  }
  processForPassword(){
    const password = (<HTMLInputElement>document.getElementById('password'));
    password.classList.remove('error-border');
    password.classList.remove('no-border');
    password.classList.remove('sucess-border');
    if(this.forgotForm.controls.password.status == 'INVALID'){
      password.classList.add('error-boarder');
      this.message = 'Password is not accepted';
    }else{
      const confirmationpassword = (<HTMLInputElement>document.getElementById('confirmationpassword'));
      confirmationpassword.classList.remove('error-border');
      confirmationpassword.classList.remove('no-border');
      confirmationpassword.classList.remove('sucess-border');
      if(this.forgotForm.controls.confirmationpassword.value !== this.forgotForm.controls.password.value){
        confirmationpassword.classList.add('error-boarder');
        this.message = 'Retyped password does not match your new password';
      }else{
        this.forgotForm.controls.submited_at.setValue(new Date(Date.now()));
        this.changeNewPassword();
      }
    }
  }
  submit(event:any){
    event.preventDefault();
    this.message = '';
    if(this.email_status == 'yet'){
      this.processForEmail();
      return;
    }
    if(this.email_status == 'approved'){
      this.processForCode();
      return;
    }
    if(this.code_status == 'approved'){
      this.processForPassword();
      return;
    }
  }
  changeNewPassword(){
    let passwordRequest = {
      email: this.forgotForm.controls.email.value,
      code: this.forgotForm.controls.code.value,
      password: this.forgotForm.controls.password.value,
      confirmationpassword: this.forgotForm.controls.confirmationpassword.value,
    };
    console.log(passwordRequest);
    this.message = 'Password was successfully changed. You can login now';
    this.changed= true;
  }
  resetFormStyle(){
    const email = (<HTMLInputElement>document.getElementById('email'));
    email.classList.remove('error-border');
    email.classList.remove('no-border');
    email.classList.remove('sucess-border');
  }

  postUserToServer():User{
    let user:any = {};
    Object.entries(this.forgotForm.value).forEach(
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
