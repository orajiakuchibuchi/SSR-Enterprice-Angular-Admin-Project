import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../shared/services/company/company.service';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Company } from '../shared/models/Company';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  company:Observable<Company[]> = this._cs.companys$;
  constructor(private _cs: CompanyService) { }

  ngOnInit(): void {
  }

}
