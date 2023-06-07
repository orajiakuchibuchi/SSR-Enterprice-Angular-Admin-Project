import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { AboutComponent } from './about/about.component';
import { ServiceComponent } from './service/service.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { PricingComponent } from './pricing/pricing.component';

@NgModule({
  declarations: [
    ClientComponent,
    HeaderComponent,
    AboutComponent,
    ServiceComponent,
    HomeComponent,
    FooterComponent,
    PricingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
