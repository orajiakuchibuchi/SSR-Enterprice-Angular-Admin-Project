import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/Index';
import { DeviceService } from '../../services/client/device.service';
import { CompanyService } from '../../services/company/company.service';
import { Company } from '../../models/Company';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<any> = this._us.user$;
  newCompany:any = {
    name: '',
    website: '',
    logo: '',
    country: '',
    address: ''
  }
  listOfCompanies$: Observable<Company[]> = this._company.companys$;
  runningSchool: any = null;
  constructor(private _company: CompanyService,private _us: UserService, private _ds: DeviceService, private router:Router, private _auth: AuthService) { }

  ngOnInit(): void {
    const runningSchool = this._company.getSessionCompany();
    if(runningSchool){
      this.runningSchool = JSON.parse(runningSchool)
    }
    this.listOfCompanies$.subscribe(
      r=>console.log(r)
    )
    this.user$.subscribe(
      // u=>console.log(u)
    )
  }
  prevent(event:any){
    console.log(event)
    event.preventDefault()
  }
  navigateTo(route:any){
    this.router.navigate([route])
  }
  selectCompany(event:any){
    const value = event.target.value;
    console.log(value);
    if(value.length == 0){
      const showCreateCompanyModal:any = document.getElementById('showCreateCompanyModal');
      showCreateCompanyModal.click();
    }
  }
  save(event:any){
    console.log(event);
    event.preventDefault();
    if(!this.newCompany.name){
      this._ds.openErrorNotification('Name', 'Company name is required');
      return;
    }
    // if(!this.newCompany.website){
      
    // }
    if(!this.newCompany.logo){
      this._ds.openErrorNotification('Logo', 'Company logo is required');
      return;
    }
    if(!this.newCompany.country){
      this._ds.openErrorNotification('Country', 'Company country is required');
      return;
    }
    if(!this.newCompany.address){
      this._ds.openErrorNotification('Address', 'Company address is required');
      return;
    }
    this._company.add(this.newCompany).subscribe(
      c=>{
        console.log(c);
        this.newCompany.name = '';
        this.newCompany.website ='';
        this.newCompany.logo ='';
        this.newCompany.country = '';
        const closeAddCompanyModal = <HTMLElement>document.getElementById('closeAddCompanyModal');
        closeAddCompanyModal.click();
      }
    );
    
  }
  closeModal(){
    const selectCompany_header:HTMLSelectElement = <HTMLSelectElement>document.getElementById('selectCompany_header');
    selectCompany_header.options.selectedIndex = 0;
  }

  logout(){
    this._auth.logout().subscribe(
      res=>{
        console.log(res);
        this.router.navigate([''])
      }
    );
    // this.router.navigate([''])
  }
}
