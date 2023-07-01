import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { IndexComponent as DepartmentIndexComponent} from './department/index/index.component';
import { CreateComponent as DepartmentCreateComponent } from './department/create/create.component';
import { ListComponent as DepartmentListComponent } from './department/list/list.component';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { DepartmentResolver } from 'src/app/shared/resolvers/company/department.resolver';


const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'all',
    component: IndexComponent,
    data: { tab: 'View'}
  },
  {
    path: 'create',
    component: IndexComponent,
    data: { tab: 'Create'}
  },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'department',
    component: DepartmentIndexComponent,
    resolve: [DepartmentResolver]
  },
  {
    path: 'department/create',
    component: DepartmentCreateComponent
  },
  {
    path: 'department/list',
    component: DepartmentListComponent,
    resolve: [DepartmentResolver]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
