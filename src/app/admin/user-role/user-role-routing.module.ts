import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoleComponent } from './user-role.component';
import { RecordComponent } from './record/record.component';
import { RoleIndex } from './role/Index';
import { UserIndex } from './user/Index';

const routes: Routes = [
  {
    path: '',
    component: UserRoleComponent,
    children: [
      {
        path: 'records',
        component: RecordComponent
      },
      {
        path: 'all-roles',
        component: RoleIndex
      },
      {
        path: 'all-users',
        component: UserIndex
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoleRoutingModule { }
