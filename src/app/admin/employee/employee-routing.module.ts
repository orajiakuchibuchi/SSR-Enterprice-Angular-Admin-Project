import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { IndexComponent as DepartmentIndexComponent} from './department/index/index.component';
import { CreateComponent as DepartmentCreateComponent } from './department/create/create.component';
import { ListComponent as DepartmentListComponent } from './department/list/list.component';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'all',
    component: IndexComponent
  },
  {
    path: 'create',
    component: CreateComponent
  },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'department',
    component: DepartmentIndexComponent
  },
  {
    path: 'department/create',
    component: DepartmentCreateComponent
  },
  {
    path: 'department/list',
    component: DepartmentListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
