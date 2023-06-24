import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
    search: '',
    user: null,
    assign: true
  };
  result:any[]= [];
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  @Output() department: EventEmitter<any> = new EventEmitter<any>();
  constructor(private _us: UserService) { }

  ngOnInit(): void {
  }
  save(event:any){
    event.preventDefault();
    this.department.emit(this.newDepartment);
    $('#create-department-modal').modal('hide');
    // const closeAddCompanyModal:any = document.getElementById('closeAddCompanyModal');
    // console.log(closeAddCompanyModal)
    // if(this.newDepartment.name){
    //   closeAddCompanyModal.click();
    // }
  }
  nameSearchChange(event:any){
    console.log(this.newDepartment.search)
    const key = (<string>this.newDepartment.search).toLowerCase().trim()
    this.result = this._us.listOfUsersValue().filter(u=>u.firstName.toLowerCase().includes(key) || u.lastName.toLowerCase().includes(key));
    console.log(this.result)
  }
  toggleAssign(event:any){
    console.log(event.target)
    console.log(this.newDepartment.assign)
  }
  closeModal(){

  }

}
