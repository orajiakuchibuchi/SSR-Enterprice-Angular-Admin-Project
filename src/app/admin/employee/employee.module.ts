import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { IndexComponent as DepartmentIndexComponent} from './department/index/index.component';
import { CreateComponent as DepartmentCreateComponent } from './department/create/create.component';
import { ListComponent as DepartmentListComponent } from './department/list/list.component';


import { IndexComponent } from './index/index.component';
import { CreateComponent  } from './create/create.component';
import { ListComponent } from './list/list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserRoleModule } from '../user-role/user-role.module';


@NgModule({
  declarations: [
    DepartmentIndexComponent,
    DepartmentCreateComponent,
    DepartmentListComponent,
    CreateComponent,
    IndexComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoleModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule { }
