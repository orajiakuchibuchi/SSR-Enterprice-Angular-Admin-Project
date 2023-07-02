import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruitmentRoutingModule } from './recruitment-routing.module';

import { IndexComponent } from './index/index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserRoleModule } from '../user-role/user-role.module';
import { OpeningComponent } from './job/opening/opening.component';
import { PositionComponent } from './job/position/position.component';
import { CreateComponent as OpeningCreateComponent } from './job/opening/create/create.component';
import { CreateComponent as PositionCreateComponent } from './job/position/create/create.component';
import { ListComponent as PositionListComponent } from './job/position/list/list.component';
import { ListComponent as OpeningListComponent } from './job/opening/list/list.component';
import { PreviewComponent } from './job/opening/preview/preview.component';


@NgModule({
  declarations: [
    IndexComponent,
    OpeningComponent,
    PositionComponent,
    PositionCreateComponent,
    PositionListComponent,
    OpeningListComponent,
    OpeningCreateComponent,
    PreviewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoleModule,
    RecruitmentRoutingModule
  ]
})
export class RecruitmentModule { }
