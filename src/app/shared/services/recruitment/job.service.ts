
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Department, JobApplication, Plan } from '../../models/Index';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
import { tap, map, shareReplay, switchMap, mergeMap, distinctUntilChanged } from 'rxjs/operators';
import { JobPosition } from '../../models/JobPosition';
import { JobOpening } from '../../models/JobOpening';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private _positions: BehaviorSubject<JobPosition[]> = new BehaviorSubject<JobPosition[]>([]);
  private _openings: BehaviorSubject<JobOpening[]> = new BehaviorSubject<JobOpening[]>([]);
  private _applications: BehaviorSubject<Map<string, any>> = new BehaviorSubject<Map<string, any>>(new Map());
  private _job_applications: BehaviorSubject<Map<string, JobApplication[]>> = new BehaviorSubject<Map<string, JobApplication[]>>(new Map());
  jobPositions$: Observable<JobPosition[]> = this._positions.asObservable();
  jobOpenings$: Observable<JobOpening[]> = this._openings.asObservable();
  departments$_status: 'yet' | 'loaded' | 'failed' | 'retried' = 'yet';
  apiUrl: string = environment.api;

  constructor(private http: HttpClient, private _us: UserService) { }

  public getJobPositionsApi$: Observable<JobPosition[]> = this.getJoPositionsApi().pipe(
    tap((res: any[]) => {
      this._positions.next(res)
    }),
    shareReplay()
  );
  public getJobOpeningsApi$: Observable<JobOpening[]> = this.getJobOpeningsApi().pipe(
    tap((res: any[]) => {
      this._openings.next(res)
    }),
    shareReplay()
  );
  private getJoPositionsApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobPositions`);
  }
  applyToOpening(application:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobApplications`, application).pipe(
      tap((re)=>{this._addApplciation(re)})
    );
  }
  getJobPosition(code: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobPositions?code=${code}`).pipe(
      map(
        (res: any) => res.pop()
      )
    );
  }
  private getJobOpeningsApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobOpenings`);
  }
  getJobOpeningApplicationsApi(openingCode:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobApplications?opening_code=${openingCode}`).pipe(
      tap((applications:any)=>{
        const jobApp = this._job_applications.value;
        jobApp.set(openingCode, applications);
        this._job_applications.next(jobApp);
      })
    )
  }
  get job_applications(){
    return this._job_applications;
  }
  getJobOpening(code: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobOpenings?code=${code}`).pipe(
      map(
        (res: any) => res.pop()
      )
    );
  }
  getAvailableJobOpening(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobOpenings?status=Open`);
  }
  previewJobOpening(code: any): Observable<any> {
    return this.getJobOpening(code).pipe(
      switchMap(
        opening => {
          opening.views++;
          opening.status = this.inpast(opening.deadline) ? 'Closed' : 'Open';
          return this.updateJobOpening(opening)
        }
      )
    )
  }

  inpast(date: any) {
    let givenDate1 = new Date(date)
    let diff = new Date().getTime() - givenDate1.getTime();
    return diff > 0
  }
  private newJobPositionApi(position: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobPositions`, position);
  }
  private newJobOpeningApi(position: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobOpenings`, position);
  }
  private updateJobOpeningApi(position: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/jobOpenings/${position.id}`, position);
  }
  addPosition(position: any) {
    return this.newJobPositionApi(position).pipe(
      tap((res: JobPosition) => {
        this._positions.value.unshift(res);
      })
    )
  }
  addOpening(opening: any) {
    opening.views = 0;
    opening.applications = 0;
    return this.newJobOpeningApi(opening).pipe(
      tap((res: JobOpening) => {
        this._openings.value.unshift(res);
      })
    )
  }
  updateJobOpening(opening: any) {
    return this.updateJobOpeningApi(opening)
  }
  private _addApplciation(application:any){
    const exList = this._applications.value;
    let app = exList.get(application.code);
    console.log(app);
    if(!app){
      exList.set(application.code, application);
      this._applications.next(exList);
    }
  }
  updateJobApplciationApi(application: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/jobApplications/${application.id}`, application).pipe(
      tap((res:any)=>{
        this._updateApplication(res);
      })
    );
  }
  private _updateApplication(application:any){
    const exList = this._applications.value;
    exList.set(application.code, application);
    this._applications.next(exList);
  }
  get applications(){
    return this._applications.value;
  }
  get jobPositionsValue() {
    return this._positions.value;
  }
  get jobOpeningsValue() {
    return this._openings.value;
  }

}