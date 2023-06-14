import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { tap, map, shareReplay,switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user/user.service';
import { DeviceService } from 'src/app/shared/services/client/device.service';
@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {
  totalUsers:number = 0;
  role$:Observable<any> = this.route.paramMap.pipe( 
    map(paramMap=>{
      let id:any = paramMap.get('id');
      if(id){
        try {
          id = parseInt(id);
        } catch (error) {
          this._ds.openErrorNotification('Issues routing', 'Issues with querying route ID.')
        }
      }
      return id;
    }),
    switchMap((res:any)=>{
      console.log(res);
      return this._us.roles$.pipe(
        map(
          roles => {
            return roles.find(r=>r.id ==res)
          }
        )
      )
    })
  );
  menu:string = 'users';
  constructor(private _us:UserService,private crf: ChangeDetectorRef, private route: ActivatedRoute, private _ds: DeviceService) { }

  ngOnInit(): void {
    // this.role.subscribe()
  }
  getTotalUsers(event:any){
    console.log(event);
    this.totalUsers = event;
    this.crf.detectChanges()
  }
  navigateTo(page:string){
    this.menu = page;
    window.scrollTo({
      top: 50,
      behavior: 'smooth',
    });
  }

}
