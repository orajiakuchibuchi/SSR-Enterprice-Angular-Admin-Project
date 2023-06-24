import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UserResolver } from '../shared/resolvers/user/user.resolver';
import { AppResolver } from '../shared/resolvers/app/app.resolver';
import { AuthGuard } from '../shared/guards/auth/auth.guard';
import { CompanyResolver } from '../shared/resolvers/company/company.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'user-role',
        loadChildren: () => import('./user-role/user-role.module').then(m => m.UserRoleModule)
      },
      {
        path: 'booking',
        loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule)
      },
      {
        path: 'pricing',
        loadChildren: () => import('./pricing/pricing.module').then(m=> m.PricingModule)
      },
      {
        path: 'employee',
        loadChildren: () => import('./employee/employee.module').then(m=> m.EmployeeModule)
      },
    ],
    resolve: [UserResolver, AppResolver, CompanyResolver],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
