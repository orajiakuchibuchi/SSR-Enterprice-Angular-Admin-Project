import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'home',
    component: IndexComponent,
    data: { tab: 'Home'}
  },
  {
    path: 'create',
    component: IndexComponent,
    data: { tab: 'Create'}
  },
  {
    path: 'recent',
    component: IndexComponent,
    data: { tab: 'Recent'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileManagerRoutingModule { }
