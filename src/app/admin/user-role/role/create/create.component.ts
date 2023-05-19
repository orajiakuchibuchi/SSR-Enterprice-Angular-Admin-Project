import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/Index';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Role } from 'src/app/shared/models/Index';


@Component({
  selector: 'app-role-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  @Output() doneCreating = new EventEmitter<boolean>()
  firstFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    status: ['', Validators.required],
    searchName: ['', [Validators.required]]
  });
  isLinear = true;
  saved = false;
  message = '';
  constructor(private _formBuilder: FormBuilder, private auth: AuthService, private router: Router, private _us: UserService) { }

  ngOnInit(): void {
  }

  get firstControls(){
    return this.firstFormGroup.controls;
  }
  submit(){
    let role: Role = {
      name: this.firstControls.name.value,
      status: this.firstControls.status.value
      // searchName: this.firstControls.searchName.value,
    }
    this._us.createRole(role).subscribe(
      res=>console.log(res)
    )

    this.doneCreating.emit(true);
    // this.auth.register(user)
    // .pipe(
    //   map(data=>data.response),
    //   tap(()=>this.saved = true)
    // )
    // .subscribe(
    //   response=>{
    //     this.message = response;

    //   }
    // )
  }
  loginnow(){
    this.router.navigate(['auth/login'])
  }
}