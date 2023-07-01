import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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
import { Department } from 'src/app/shared/models/Department';
import { ScriptsService } from 'src/app/shared/services/client/scripts.service';
import { JobService } from 'src/app/shared/services/recruitment/job.service';

declare const $: any;
@Component({
  selector: 'app-recruitment-opening-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, AfterViewInit, OnChanges {
  @Input('role') role: string = '';
  @Input('showTitle') showTitle: boolean = false;
  @Input('loadForm') loadForm: boolean = false;
  fileToUpload: any = null;
  formStep: number = 0;
  isChecked = false;
  isLinear = true;
  wantToSearch = true;
  url: string = '';
  saved = false;
  message = '';
  value = 'Clear me';
  errorMessage = '';
  country: any = {
    search: ''
  }
  formValid:boolean = false;
  allowableDoc: string[] = [
    'CV',
    'Resume',
    'Cover Letter',
    'Additional Document'
  ];
  newJobOpening: any = {
    title: '',
    code: `JO-${this._script.generateRandomAlphanumeric(3)}`,
    info: '',
    position: '',
    deadline: '',
    created_at: '',
    updated_at: '',
    status: '',
    public_url: '',
    private_url: ''
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
            this.newJobOpening.responsibility += `<a href="${res.file}" target="__blank">${res.fileName}</a><br>`
            this.newJobOpening.description += `<a href="${res.file}" target="__blank">${res.fileName}</a><br>`
            console.log(this.newJobOpening.responsibility);
            console.log(this.newJobOpening.description);
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
  totalFields: number = 36;
  labelPosition: any = null;
  assignableRole: Observable<Role[]> = this._us.roles$.pipe(
    map((roles: Role[]) => {
      return roles.filter(r => r.name != 'Master')
    })
  );
  departments$: Observable<Department[]> = this._departMentService.departments$;
  @Output() hasSaved: EventEmitter<Role> = new EventEmitter<Role>();
  result: any[] = [];
  summary:string=``;

  constructor(private _ds: DeviceService, 
    private _us: UserService, 
    private router: Router, 
    private _departMentService:DepartmentService,
    private _script: ScriptsService,
    private changeDetect: ChangeDetectorRef,
    private _js: JobService,
    private _fs: FileService) {
    console.log(this.router.url)
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.loadForm) {
      if (changes.loadForm.currentValue) {
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
              speed: '1000', // Animation speed. Not used if animation is 'css'
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
              save</button>` // Extra html to show on toolbar
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
    }
    console.log(changes);
  }
  ngAfterViewInit(): void {
    this.changeDetect.detectChanges();
  }

  ngOnInit(): void {
    this.url = this.router.url;
  }
  provideContent(idx: any, stepDirection: any, stepPosition: any, selStep: any, callback: any) {
    this.formStep = idx;
    const canisubmit64: any = document.getElementById("canisubmit64");
    console.log(canisubmit64)
    // You can use stepDirection to get ajax content on the forward movement and stepPosition to identify the step position
    if (stepDirection == 'forward' && stepPosition == 'middle') {
      let ajaxURL = "YOUR AJAX URL";
    }
    if (this.formStep == 3) {
      canisubmit64.classList.remove('d-none');
      this.summary = this.build;
    } else {
      this.summary = '';
      canisubmit64.classList.add('d-none')
    }
    this.changeDetect.detectChanges();
    callback();
  }
  reset() {
    this.newJobOpening = {
      title: '',
      code: `JO-${this._script.generateRandomAlphanumeric(3)}`,
      info: '',
      position: '',
      deadline: '',
      created_at: '',
      updated_at: '',
      status: '',
      public_url: '',
      private_url: ''
    };
    $('#smartwizardCreateOpening').smartWizard("reset");
    $('#smartwizardCreateOpening').smartWizard("goToStep", 0, true);
  }
  resetConfirmation() {
    $('#danger-modal').modal('show');
  }
  nameSearchChange(event:any){
    const key = (<string>this.search).toLowerCase().trim();
    this._js.getJobPositionsApi$
    .pipe(
      distinctUntilChanged(),
      debounceTime(3000)
    )
    .subscribe(
      res=>{
        this.result = res.filter(j=>j.title.toLowerCase().includes(key) || j.code.toLowerCase().includes(key));
        console.log(this.result)
      }
    )
  }

  valueChange(value: any) {
    console.log(value)
  }
  submit() {
    console.log(this.newJobOpening);
    this.formValid = true;
    for (const [key, value] of Object.entries(this.newJobOpening)) {
      const v: any = value;
      if (!v || v.length == 0) {
        this.formValid = false;
      }
    }
    if (!this.formValid) {
      this._ds.openErrorNotification('Opps..', `Please reconfirm form. Some fields are required`);
    } else {
      this._js.addOpening(this.newJobOpening).subscribe(
        res=>{
          this._ds.openSuccessNotification('Position Created', 'Saving job position info to the database..');
          this.reset();
        }
      )
      
    }
    
  }
  get build(){
    const today = new Date(Date.now());
    this.newJobOpening.created_at = today.toDateString();
    this.newJobOpening.updated_at = today.toDateString();
    let html:any = '';
    for (const [key, value] of Object.entries(this.newJobOpening)) {
      const v: any = value;
      html += this._build(key,v)
    }
    return html;
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
}

