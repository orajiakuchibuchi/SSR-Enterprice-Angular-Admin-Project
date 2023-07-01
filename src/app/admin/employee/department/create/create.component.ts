import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DepartmentService } from 'src/app/shared/services/department/department.service';
import { UserService } from 'src/app/shared/services/user/user.service';
declare const $:any;
@Component({
  selector: 'app-department-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  newDepartment:any = {
    name: '',
    code: '',
    search: '',
    user: null,
    assign: true
  };
  result:any[]= [];
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  @Output() department: EventEmitter<any> = new EventEmitter<any>();
  constructor(private _us: UserService, private _deptService: DepartmentService) { }

  ngOnInit(): void {
  }
  save(event:any){
    event.preventDefault();
    const submitedAt = new Date(Date.now());
    const newDepartment = {
      name: this.newDepartment.name,
      code: this.newDepartment.code,
      created_at: submitedAt,
      updated_at: submitedAt,
      hod: null,
      status: 'Active'
    };
    if(this.newDepartment.user){
      newDepartment.hod = this.newDepartment.user.id;
    }
    // this.department.emit(this.newDepartment);
    this._deptService.add(newDepartment).subscribe(
      res=>$('#create-department-modal').modal('hide')
    );
    // $('#create-department-modal').modal('hide');
    // const closeAddCompanyModal:any = document.getElementById('closeAddCompanyModal');
    // console.log(closeAddCompanyModal)
    // if(this.newDepartment.name){
    //   closeAddCompanyModal.click();
    // }
  }
  nameSearchChange(event:any){
    console.log(this.newDepartment.search)
    const key = (<string>this.newDepartment.search).toLowerCase().trim();
    console.log((<string>this.newDepartment.search).length)
    console.log(key.length)
    this.result = this._us.listOfUsersValue().filter(u=>u.firstName.toLowerCase().includes(key) || u.lastName.toLowerCase().includes(key));
    console.log(this.result)
  }

  handlePassportUpload(event:any){
    
  }
  toggleAssign(event:any){
    console.log(event.target)
    console.log(this.newDepartment.assign)
  }
  closeModal(){

  }

}
