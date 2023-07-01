

import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {tap, map, take, switchMap, shareReplay} from 'rxjs/operators';
import { DepartmentService } from '../../services/department/department.service';
import { Department } from '../../models/Index';

@Injectable({
  providedIn: 'root'
})
export class DepartmentResolver implements Resolve<Department[]> {
  constructor(private departMentService: DepartmentService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Department[]> {
    return this.departMentService.getDepartmentsApi$;
  }
}
