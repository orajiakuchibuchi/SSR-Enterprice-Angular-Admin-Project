import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from './material.module';
import { PageLoaderComponent, HeaderComponent, RightSidebarComponent,LeftSidebarComponent } from './components/Index';


@NgModule({
  declarations: [
    PageLoaderComponent,
    HeaderComponent,
    RightSidebarComponent,
    LeftSidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialExampleModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialExampleModule,
    PageLoaderComponent,
    HeaderComponent,
    RightSidebarComponent,
    LeftSidebarComponent
  ]
})
export class SharedModule { }
