import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/Index';
import { map, tap, catchError, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Role } from 'src/app/shared/models/Role';
import { UserService } from 'src/app/shared/services/user/user.service';
import { FileService } from 'src/app/shared/services/client/file.service';
import { DeviceService } from 'src/app/shared/services/client/device.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from 'src/environments/environment';
import { DepartmentService } from 'src/app/shared/services/department/department.service';
import { ScriptsService } from 'src/app/shared/services/client/scripts.service';
import { JobService } from 'src/app/shared/services/recruitment/job.service';
import {Location} from '@angular/common'; 

declare const $: any;

@Component({
  selector: 'app-opening-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})

export class ApplyComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input('role') role: string = '';
  @Input('showTitle') showTitle: boolean = false;
  @Input('loadForm') loadForm: boolean = false;
  @Input('opening') opening:any = null;
  @Input('position') position:any = null;
  @Input('routeCode') routeCode:any = null;
  formStep: number = 0;
  url: string = '';
  saved = false;
  message = '';
  errorMessage = '';
  sucmes = '';
  formValid:boolean = false;;
  code:any = `JA-${this._script.generateRandomAlphanumeric(3)}`;
  applicationcode:any = ``;
  newJobApplication: any = {
    firstName: '',
    lastName: '',
    country: '',
    phone: ' ',
    email: '',
    requiredUploads: {},
    optionalUploads: {},
    coverLetterTypeContent: '',
    referredBy: '',
    code: this.code, 
    created_at: '',
    updated_at: '',
    status: 'unsubmitted',
    public_url: this.public_url
  }
  search:string = '';
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '50',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: `${environment.uploadApi}/upload`,
    upload: (file: File) => { 
      console.log(file); 
      let formData = new FormData();
      formData.append('file', file, file.name)
      return this._fs.upload(formData)
        .pipe(
          catchError((err: any) => {
            console.log(err);
            return throwError(err);
          }),
          tap((res:any)=>{
            console.log(res);
            // this.newJobApplication.responsibility += `<a href="${res.file}" target="__blank">${res.fileName}</a><br>`
            // this.newJobApplication.description += `<a href="${res.file}" target="__blank">${res.fileName}</a><br>`
            // console.log(this.newJobApplication.responsibility);
            // console.log(this.newJobApplication.description);
          })
        );
      },
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  @Output() hasSaved: EventEmitter<any> = new EventEmitter<any>();
  @Output() hasSavedForm: EventEmitter<any> = new EventEmitter<any>();
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.validateeReload(event)
    return false;
  }
  summary:string=``;

  constructor(private _ds: DeviceService, 
    private _us: UserService, 
    private router: Router, 
    private _departMentService:DepartmentService,
    private _script: ScriptsService,
    private changeDetect: ChangeDetectorRef,
    private _js: JobService,
    private _fs: FileService,
    private location: Location) {
  }
  ngOnDestroy(): void {
    this.reset();
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.loadForm) {
      if (changes.loadForm.currentValue) {
        this.initalizeForm()
      }
    }
    // this.changeDetect.detectChanges();
  }
  ngAfterViewInit(): void {
    // this.changeDetect.detectChanges();
  }

  ngOnInit(): void {
    this.url = this.router.url;
    this.location.go(`admin/recruitment/job-opening/preview/${this.routeCode}`);
    console.log(this.url)
  }
  initalizeForm(){
    $(() => {
      $('#smartwizardCreateOpening').smartWizard({
        selected: this.formStep, // Initial selected step, 0 = first step
        // theme: 'default', // theme for the wizard, related css need to include for other than default theme
        justified: true, // Nav menu justification. true/false
        autoAdjustHeight: true, // Automatically adjust content height
        backButtonSupport: true, // Enable the back button support
        enableUrlHash: true, // Enable selection of the step based on url hash
        transition: {
          animation: 'slideSwing', // Animation effect on navigation, none|fade|slideHorizontal|slideVertical|slideSwing|css(Animation CSS class also need to specify)
          speed: '1500', // Animation speed. Not used if animation is 'css'
          easing: '', // Animation easing. Not supported without a jQuery easing plugin. Not used if animation is 'css'
          prefixCss: '', // Only used if animation is 'css'. Animation CSS prefix
          fwdShowCss: '', // Only used if animation is 'css'. Step show Animation CSS on forward direction
          fwdHideCss: '', // Only used if animation is 'css'. Step hide Animation CSS on forward direction
          bckShowCss: '', // Only used if animation is 'css'. Step show Animation CSS on backward direction
          bckHideCss: '', // Only used if animation is 'css'. Step hide Animation CSS on backward direction
        },
        toolbar: {
          position: 'bottom', // none|top|bottom|both
          showNextButton: true, // show/hide a Next button
          showPreviousButton: true, // show/hide a Previous button
          extraHtml: `
          <button class="btn btn-danger" onclick="clickId('resetEmployeeFormBtnHidden')">Reset</button>
          <button class="btn btn-success" id="canisubmit64" onclick="clickId('createEmployeeSubmitBtnHidden')">
          Save</button>` // Extra html to show on toolbar
        },
        anchor: {
          enableNavigation: true, // Enable/Disable anchor navigation 
          enableNavigationAlways: false, // Activates all anchors clickable always
          enableDoneState: true, // Add done state on visited steps
          markPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
          unDoneOnBackNavigation: false, // While navigate back, done state will be cleared
          enableDoneStateNavigation: true // Enable/Disable the done state navigation
        },
        keyboard: {
          keyNavigation: true, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
          keyLeft: [37], // Left key code
          keyRight: [39] // Right key code
        },
        lang: { // Language variables for button
          next: 'Next',
          previous: 'Previous'
        },
        disabledSteps: [], // Array Steps disabled
        errorSteps: [], // Array Steps error
        warningSteps: [], // Array Steps warning
        hiddenSteps: [], // Hidden steps
        getContent: (idx: any, stepDirection: any, stepPosition: any, selStep: any, callback: any)=>{this.provideContent(idx, stepDirection, stepPosition, selStep, callback) }// Callback function for content loading
      });
    });
  }
  provideContent(idx: any, stepDirection: any, stepPosition: any, selStep: any, callback: any) {
    this.formStep = idx;
    const canisubmit64: any = document.getElementById("canisubmit64");
    console.log(canisubmit64)
    // You can use stepDirection to get ajax content on the forward movement and stepPosition to identify the step position
    if (stepDirection == 'forward' && stepPosition == 'middle') {
      let ajaxURL = "YOUR AJAX URL";
    }
    if (this.formStep == 3 && this.newJobApplication.status == 'unsubmitted') {
      canisubmit64.classList.remove('d-none');
      this.summary = this.build;
    } else {
      this.summary = '';
      canisubmit64.classList.add('d-none')
    }
    this.changeDetect.detectChanges();
    callback();
  }
  validateeReload(event:any){
    console.log(event);
    this.location.go(this.url);
  }
  handleFileInput(event: any,status: any, index:any) {
    const files: FileList = event.target.files;
    if(files.length > 0){
      const file: File = files[0];
      const getsize: any = file.size.toString();
      let size = ``;
      let unit = 'kb';
      if(getsize.length >= 7 ){
        unit = 'mb';
        size = `${(Math.round(+getsize/1024)/1000).toFixed(2)}MB`;
        this._ds.oErrorNotification('File exceeds limit', `Maximum upload file for a file is 1MB. Uploaded document size is ${size}`);
        return;
      }
      size = `${Math.round(+getsize/1024).toFixed(2)}kb`;
      this._ds.oSuccessNotification('File was uploaded', `${file.name} was accepted`);
      this.newJobApplication[status][index] = files[0];
    }
  }
  deleteFileInput(status: any, index:any) {
    let record = this.doesExist(status,index);
    this._ds.oSuccessNotification(`${status} File Removed`, `${record.name} successfully removed. Kindly note to upload a new one if required`);
    this.newJobApplication[status][index] = null;
  }
  doesExist(status: any, index:any) {
    return this.newJobApplication[status][index];
  }
  reset() {
    this.code = `JA-${this._script.generateRandomAlphanumeric(3)}`;
    this.newJobApplication = {
      firstName: '',
      lastName: '',
      country: '',
      phone: ' ',
      email: '',
      requiredUploads: {},
      optionalUploads: {},
      coverLetterTypeContent: '',
      referredBy: '',
      code: this.code, 
      created_at: '',
      updated_at: '',
      status: 'unsubmitted',
      public_url: this.public_url
    };
    $('#smartwizardCreateOpening').smartWizard("reset");
    $('#smartwizardCreateOpening').smartWizard("goToStep", 0, true);
  }
  resetConfirmation() {
    $('#danger-modal').modal('show');
  }

  valueChange(value: any) {
    console.log(value)
  }
  submit() {
    console.log(this.newJobApplication);
    this.formValid = true;
    let form = new FormData();
    for (const [key, value] of Object.entries(this.newJobApplication)) {
      const v: any = value;
      if (!v || v.length == 0) {
        this.formValid = false;
      }else{
        if(key !== 'requiredUploads' && key !== 'optionalUploads'){
          form.append(key, v)
        }else{
          for (const [_key, _value] of Object.entries(v)) {
            form.append(_key, <any>_value, (<any>_value).name);
          }
        }
      }
    }
    if (!this.formValid) {
      this._ds.openErrorNotification('Opps..', `Please reconfirm form. Some fields are required`);
    } else {
      this.newJobApplication.public_url = this.public_url;
      this.newJobApplication.private_url = this.private_url;
      this.newJobApplication.status = 'unsubmitted';
      this.newJobApplication.opening_code = this.routeCode;
      this.sucmes = 'Your application has been submitted.';
      this._ds.openSuccessNotification('Application Submitted', this.sucmes);
      const canisubmit64: any = document.getElementById("canisubmit64");
      canisubmit64.classList.add('d-none');
      this.loadForm = false;
      this.formStep = this.formStep > 0 ? this.formStep-1 : this.formStep;
      this.changeDetect.detectChanges();
      this.hasSaved.emit(this.newJobApplication);
      this.hasSavedForm.emit(form);

    }
  }
  get build(){
    const today = new Date(Date.now());
    this.newJobApplication.created_at = today.toDateString();
    this.newJobApplication.updated_at = today.toDateString();
    this.applicationcode = `JA-${this._script.generateRandomAlphanumeric(3)}`;
    let html:any = '';
    for (const [key, value] of Object.entries(this.newJobApplication)) {
      const v: any = value;
      html += this._build(key,v)
    }
    return html;
  }
  get public_url(){
    return `${environment.appDomain}/admin/recruitment/job-opening/applications/preview/${this.code}`;
  }
  get private_url(){
    return `${environment.appDomain}/admin/recruitment/job-opening/applications/${this.code}`
  }
  private _build(key:any, v:any){
    let html:string = '';
    if (!v || v.length == 0) {
      html += `<p class="text-danger">${key.replace('_', ' ').toUpperCase()}: ${v}</p>`;
    }else{
      html += `<p><span class="text-primary">${key.replace('_', ' ').toUpperCase()}</span>: <span class="text-success">${v}</span></p>`;
    }
    return html.replace('undefined', '');

  }

  getkey(key:any){
    return key.replace(' ', '_').toLowerCase()
  }
}

