import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoleComponent } from './user-role.component';
import { RecordComponent } from './record/record.component';
import { RoleIndex, RoleShow } from './role/Index';
import { UserIndex } from './user/Index';

const routes: Routes = [
  {
    path: '',
    component: UserRoleComponent,
    children: [
      {
        path: 'records',
        component: RecordComponent,
        data: { component: 'Users'}
      },
      {
        path: 'records-employees',
        component: RecordComponent,
        data: { component: 'Employees'}
      },
      {
        path: 'all-roles',
        component: RoleIndex
      },
      {
        path: 'role/show/:id',
        component: RoleShow
      },
      {
        path: 'all-users',
        component: UserIndex,
        data: { component: 'Users'}
      },
      {
        path: 'all-employees',
        component: UserIndex,
        data: { component: 'Employees'}
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoleRoutingModule { }
