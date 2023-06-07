import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from './material.module';
import { PageLoaderComponent, HeaderComponent, RightSidebarComponent,LeftSidebarComponent, CalendarComponent } from './components/Index';
import { FlutterwaveModule } from "flutterwave-angular-v3"
import { HttpClientModule } from '@angular/common/http';
import { NotificationComponent } from './components/notification/notification.component';
import { SitemapComponent } from './components/sitemap/sitemap.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


@NgModule({
  declarations: [
    PageLoaderComponent,
    HeaderComponent,
    RightSidebarComponent,
    LeftSidebarComponent,
    CalendarComponent,
    NotificationComponent,
    SitemapComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialExampleModule,
    FlutterwaveModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialExampleModule,
    PageLoaderComponent,
    HeaderComponent,
    RightSidebarComponent,
    LeftSidebarComponent,
    CalendarComponent,
    HttpClientModule,
    FlutterwaveModule,
    NotificationComponent,
    NotFoundComponent
  ]
})
export class SharedModule { }
