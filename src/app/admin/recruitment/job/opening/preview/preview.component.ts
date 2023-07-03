import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap,shareReplay, tap } from 'rxjs/operators';
import { JobService } from 'src/app/shared/services/recruitment/job.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {
  letWatcher:any = null;
  
  opening:Observable<any> = this.route.paramMap.pipe(
    switchMap((paramMap:any)=>{
      this.code = paramMap.get('code');
      if(this.code){
        return this._js.previewJobOpening(this.code);
      }
      return of(null);
    }),
    shareReplay()
  );
  position:Observable<any> = this.opening.pipe(
    switchMap((opening:any)=>{
      console.log(opening)
      if(opening){
        return this._js.getJobPosition(opening.position).pipe(
          tap(r=>console.log(r))
        );
      }
      return of(null);
    }),
    shareReplay()
  );
  code:any;
  constructor(private route: ActivatedRoute, private _js:JobService) { }
  ngOnDestroy(): void {
    if(this.letWatcher){
      clearInterval(this.letWatcher);
      this.letWatcher = null;
      this.uncheck()
    }
  }

  ngOnInit(): void {
    this.opening.subscribe()
    this.position.subscribe()
    this.check();
    this.letWatcher = setInterval(this.check,10000);
    this.route.paramMap.subscribe( paramMap => {
      this.code = paramMap.get('code');
  })
  }
  check(){
    const left_side_bar:any =document.getElementById('left-side-bar');
    const sidebar:any =document.getElementById('bdy');
    const mobilemenuoverlay:any =document.getElementById('mobilemenuoverlay');
    const header:any = document.getElementById('hdrh');
    const iclist:any = document.getElementById('iclist');
    const hsform:any = document.getElementById('hsform');
    if(left_side_bar){
      left_side_bar.style.left = '-281px';
      left_side_bar.classList.add('open');
    }
    if(header){

      header.classList.add('d-none');
      iclist.classList.add('d-none');
      hsform.classList.add('d-none');
    }
    if(sidebar){
      sidebar.classList.add('sidebar-shrink');
    }
    if(mobilemenuoverlay){
      mobilemenuoverlay.classList.add('show');
    }
  }
  uncheck(){
    const left_side_bar:any =document.getElementById('left-side-bar');
    const sidebar:any =document.getElementById('bdy');
    const mobilemenuoverlay:any =document.getElementById('mobilemenuoverlay');
    const header:any = document.getElementById('hdrh');
    const iclist:any = document.getElementById('iclist');
    const hsform:any = document.getElementById('hsform');

    if(left_side_bar){
      left_side_bar.style.left = '-0px';
      left_side_bar.classList.remove('open');
    }
    if(header){
      header.classList.remove('d-none');
      iclist.classList.remove('d-none');
      hsform.classList.remove('d-none');
    }
    if(sidebar){
      sidebar.classList.remove('sidebar-shrink');
    }
    if(mobilemenuoverlay){
      mobilemenuoverlay.classList.remove('show');
    }
  }
}
