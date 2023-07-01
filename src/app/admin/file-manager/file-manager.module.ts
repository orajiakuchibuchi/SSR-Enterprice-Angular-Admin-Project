import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileManagerRoutingModule } from './file-manager-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent  } from './create/create.component';
import { ListComponent } from './list/list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserRoleModule } from '../user-role/user-role.module';
import { GalleryComponent } from './gallery/gallery.component';


@NgModule({
  declarations: [
    CreateComponent,
    IndexComponent,
    ListComponent,
    GalleryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoleModule,
    FileManagerRoutingModule
  ]
})
export class FileManagerModule { }
