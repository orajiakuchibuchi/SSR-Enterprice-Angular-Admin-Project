import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/Index';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/shared/models/Role';
import { UserService } from 'src/app/shared/services/user/user.service';
declare const $:any;
@Component({
  selector: 'app-employee-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  @Input('role') role:string='';
  @Input('showTitle') showTitle:boolean=false;
  isLinear = true;
  saved = false;
  message = '';
  errorMessage = '';
  newEmployee:any = {
    employeeID: '',
    firstName: '',
    lastName: '',
    gender: '',
    marital_status: '',
    country: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    date_of_employment: '',
    dob: '',
    email: '',
    password: '',
    role: '',
    job_title: '',
    reports_to: '',
    department: '',
    type_of_contract: '',
    working_hours: '',
    cfale: '',
    ale: '',
    ala: '',
    sort_code: '',
    location: '',
    probation: '',
    confidance: '',
    result: '',
    comments: '',
    behavior: '',
    amount: '',
    pay_type: '',
    payroll: '',
    pension: '',
    name_of_acc: '',
    name_of_bank: '',
    acc_num: '',
  }
  assignableRole:Observable<Role[]> = this._us.roles$.pipe(
    map((roles:Role[])=>{
      return roles.filter(r=>r.name != 'Master')
    })
  );
  @Output() hasSaved: EventEmitter<Role> = new EventEmitter<Role>();

  constructor(private _us: UserService,private _formBuilder: FormBuilder, private auth: AuthService, private router: Router) {
   }

  ngOnInit(): void {
    $(".tab-wizard").steps({
      headerTag: "h5",
      bodyTag: "section",
      transitionEffect: "fade",
      titleTemplate: '<span class="step">#index#</span> #title#',
      labels: {
        finish: "Submit"
      },
      onStepChanged: (event:any, currentIndex:any, priorIndex:any) =>{
        $('.steps .current').prevAll().addClass('disabled');
      },
      onFinished: (event:any, currentIndex:any) =>{
        console.log('Finishing');
        this.submit()
        // $('#success-modal').modal('show');
      }
    });
    
  }
  clickedUploadFile(){
    const formFile:any = document.getElementById('formFile');
    formFile.click()
  }
  valueChange(value:any){
    console.log(value)
  }
  submit(){
    console.log(this.newEmployee)
    this.errorMessage = ``;
    for (const [key, value] of Object.entries(this.newEmployee)) {
      // const v:any = value;
      // if(v.errors.required){
      //   this.errorMessage += `${key.replace('_', ' ').toUpperCase()} required, `;
      // }
      // console.log(key, value);
    }
  
    // let user = {
    //   firstName: this.firstControls.firstName.value,
    //   lastName: this.firstControls.lastName.value,
    //   country: this.firstControls.country.value,
    //   phone: this.firstControls.phone.value,
    //   state: this.firstControls.state.value,
    //   city: this.firstControls.city.value,
    //   address: this.firstControls.address.value,
    //   dob: this.firstControls.dob.value,
    //   date_of_employment: this.firstControls.date_of_employment.value,
    //   email: this.firstControls.email.value,
    //   password: this.firstControls.password.value,
    //   role: [this.firstControls.role.value],
    //   created_at: new Date(Date.now()).toISOString(),
    //   updated_at: new Date(Date.now()).toISOString(),
    //   status:'Active',
    // }
    // this._us.createUser(user, user.role[0])
    // .pipe(
    //   map(data=>data),
    //   tap(()=>this.saved = true)
    // )
    // .subscribe(
    //   (response:any)=>{
    //     this.message = response.response;
    //     if(response.user){
    //       this.hasSaved.emit(response.user);
    //     }
    //   }
    // )
  }
  loginnow(){
    this.router.navigate(['auth/login'])
  }

}
