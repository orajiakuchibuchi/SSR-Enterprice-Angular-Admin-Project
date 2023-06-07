import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/Index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<any> = this._us.user$;
  constructor(private _us: UserService, private router:Router, private _auth: AuthService) { }

  ngOnInit(): void {
    this.user$.subscribe(
      u=>console.log(u)
    )
  }
  prevent(event:any){
    console.log(event)
    event.preventDefault()
  }
  navigateTo(route:any){
    this.router.navigate([route])
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
