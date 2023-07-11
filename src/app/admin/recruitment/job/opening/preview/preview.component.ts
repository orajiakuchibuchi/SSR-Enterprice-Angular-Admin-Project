import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, concat, forkJoin, of, throwError } from 'rxjs';
import { switchMap,shareReplay, tap, map, catchError } from 'rxjs/operators';
import { JobService } from 'src/app/shared/services/recruitment/job.service';
import { Meta, Title } from '@angular/platform-browser';
import { FileService } from 'src/app/shared/services/client/file.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {
  letWatcher:any = null;
  application:any = null;
  loadForm:boolean = false;
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
  availableOpenings:Observable<any> = this._js.getAvailableJobOpening().pipe(
    map((res:any[])=>{
      const ex = res.findIndex(r=>r.code == this.code);
      if(ex > -1){
        res.splice(ex,1);
      }
      return res;
    }),
    shareReplay()
  );
  code:any;
  errorMessage:any;
  constructor(private route: ActivatedRoute,private _fs:FileService, private _js:JobService,private title: Title, private meta:Meta) { }
  ngOnDestroy(): void {
    if(this.letWatcher){
      clearInterval(this.letWatcher);
      this.letWatcher = null;
      this.uncheck()
    }
  }

  inpast(date:any){
    let givenDate1 = new Date(date)
    let diff = new Date().getTime() - givenDate1.getTime();
    return diff > 0;
  }
  hasSavedApplicatin(e:any){
    this.application = e;
    console.log(this.application);
  }
  
  hasSavedApplicatinForm(e:FormData){
    console.log(e);
    let requests = [];
    for (const [key, value] of Object.entries(this.application.requiredUploads)) {
      const v: any = value;
      if (!v) {
        let errF:any = `${key.replace('_', ' ').toUpperCase()} required, `;
        return errF;
      }else{
        const formData = new FormData();
        formData.append(key, v, v.name);
        requests.push(
          this._fs._upload(formData).pipe(
            tap((res:any)=>{
              this.application.requiredUploads[key] = res;
              console.log(this.application);
            })
          )
        )
      }
    }
    for (const [key, value] of Object.entries(this.application.optionalUploads)) {
      const v: any = value;
      if (v) {
        const formData = new FormData();
        formData.append(key, v, v.name);
        requests.push(
          this._fs._upload(formData).pipe(
            tap((res:any)=>{
              this.application.optionalUploads[key] = res.file;
            })
          )
        )
      }
    }
    this.application.status = 'submitted';
    const _upload = forkJoin(requests.map(source$ => source$));
    // create application post
    this._js.applyToOpening(this.application).pipe(
      // switch to new observable to upload documents
      switchMap((_res:any)=>{
        return _upload.pipe(
          switchMap(
            res=>{
              this.application.uploaded_at = new Date(Date.now());
              this.application.uploads = res;
              this.application.id = _res.id;
              // update
              return this._js.updateJobApplciationApi(this.application).pipe(
                catchError((e:any)=>{
                  console.log(e);
                  const applyNowModalBtn = document.getElementById('applyNowModalBtn');
                  applyNowModalBtn?.click();
                  return throwError(e);
                })
              )
            }
          ),
          catchError((e:any)=>{
            console.log(e);
            const applyNowModalBtn = document.getElementById('applyNowModalBtn');
            applyNowModalBtn?.click();
            return throwError(e);
          })
        )
      }),
      catchError((e:any)=>{
        console.log(e);
        const applyNowModalBtn = document.getElementById('applyNowModalBtn');
        applyNowModalBtn?.click();
        return throwError(e);
      })
    )
    .subscribe(
      response =>console.log(response)
    )
  }
  



  ngOnInit(): void {
    this.opening.subscribe(
      o=>{
        this.title.setTitle(`Apply for ${o.title} via Zinder Platform`);    
        this.meta.updateTag({ name:'author',content:'Zinder Platform'});   
        let today = new Date(o.deadline).toLocaleString();
        this.meta.updateTag({name:'keyword',content:`${o.title} ${today} ${o.info} ${o.deadline} ${o.position}`});    
        this.meta.updateTag({name:'description',content:`Apply for ${o.title} via Zinder Platform`});  
      }
    );
    this.position.subscribe(
      p=>{
        this.title.setTitle(`${p.title} Job Opening, Estimated Salary Of ${p.base_earning}. Apply now via Zinder Platform`); 
        this.meta.updateTag({name:'description',content:`Apply for the job position ${p.title} with an estimated ${p.base_earning} via Zinder Platform`});  
      }
    );
    this.availableOpenings.subscribe()
    this.check();
    this.letWatcher = setInterval(this.check,10000);
    this.route.paramMap.subscribe( paramMap => {
      this.code = paramMap.get('code');
    });
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
