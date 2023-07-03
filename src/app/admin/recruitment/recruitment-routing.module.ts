import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { OpeningComponent } from './job/opening/opening.component';
import { PositionComponent } from './job/position/position.component';
import { DepartmentResolver } from 'src/app/shared/resolvers/company/department.resolver';
import { PreviewComponent } from './job/opening/preview/preview.component';
import { ListComponent as ApplicationList } from './job/application/list/list.component';
import { IndexComponent as ApplicationIndex } from './job/application/index/index.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: 'job-opening',
        component: OpeningComponent,
        data: { tab: 'Opening'}
      },
      {
        path: 'job-opening/preview/:code',
        component: PreviewComponent,
        data: { tab: 'Application View'}
      },
      {
        path: 'job-opening/applications',
        component: ApplicationIndex,
        data: { tab: 'Application History'}
      },
      {
        path: 'job-position',
        component: PositionComponent,
        data: { tab: 'Position'}
      }
      // ,{
      //   path: 'applications/open',
      //   component: ListComponent
      // },
      // {
      //   path: 'applications/closed',
      //   component: ListComponent
      // }
    ],
    resolve: [DepartmentResolver]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentRoutingModule { }
