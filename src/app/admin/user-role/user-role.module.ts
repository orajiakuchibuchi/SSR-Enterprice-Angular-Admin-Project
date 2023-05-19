import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoleRoutingModule } from './user-role-routing.module';
import { RecordComponent } from './record/record.component';
import { UserRoleComponent } from './user-role.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserCreate, UserIndex, UserList } from './user/Index';
import { RoleCreate, RoleIndex, RoleList } from './role/Index';


@NgModule({
  declarations: [
    RecordComponent,
    UserIndex,
    UserList,
    UserCreate,
    RoleIndex,
    RoleList,
    RoleCreate,
    UserRoleComponent
  ],
  imports: [
    CommonModule,
    UserRoleRoutingModule,
    SharedModule
  ]
})
export class UserRoleModule { }
