import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/Index';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Role } from 'src/app/shared/models/Index';
import { DeviceService } from 'src/app/shared/services/client/device.service';

@Component({
  selector: 'app-role-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  @Output() doneCreating = new EventEmitter<boolean>()
  firstFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    status: ['Active', Validators.required]
  });
  isLinear = true;
  saved = false;
  message = '';
  constructor(private _formBuilder: FormBuilder, 
              private auth: AuthService, 
              private router: Router, 
              private _us: UserService,
              private _device: DeviceService) { }

  ngOnInit(): void {
  }

  get firstControls(){
    return this.firstFormGroup.controls;
  }
  submit(){
    let role: any = {
      name: this.firstControls.name.value,
      status: this.firstControls.status.value,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now())
    }

    this._us.createRole(role).subscribe(
      res=>{
        console.log(res)
        if(res.status !== '200'){
          this._device.openErrorNotification('Issues creating role', res.response);
          return;
        }
        this._device.openSuccessNotification(`Role Created`, res.response);
        this.doneCreating.emit(true);
      }
    )
  }
  loginnow(){
    this.router.navigate(['auth/login'])
  }
}