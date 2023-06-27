import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/Index';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Role } from 'src/app/shared/models/Role';
import { UserService } from 'src/app/shared/services/user/user.service';
import { FileService } from 'src/app/shared/services/client/file.service';
import { DeviceService } from 'src/app/shared/services/client/device.service';

declare const $: any;
@Component({
  selector: 'app-employee-create',
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
  url: string = '';
  saved = false;
  message = '';
  errorMessage = '';
  country: any = {
    search: ''
  }
  newEmployee: any = {
    employeeID: '',
    firstName: '',
    lastName: '',
    gender: '',
    marital_status: '',
    country: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    date_of_employment: '',
    dob: '',
    email: '',
    password: '',
    passport: '',
    role: '',
    job_title: '',
    reports_to: '',
    department: '',
    type_of_contract: '',
    working_hours: '',
    cfale: '',
    ale: '',
    ala: '',
    sort_code: '',
    location: '',
    probation: '',
    confidance: '',
    result: '',
    comments: '',
    behavior: '',
    amount: '',
    currency: '',
    pay_type: '',
    payroll: '',
    pension: '',
    name_of_acc: '',
    name_of_bank: '',
    acc_num: '',
  }
  totalFields: number = 36;
  assignableRole: Observable<Role[]> = this._us.roles$.pipe(
    map((roles: Role[]) => {
      return roles.filter(r => r.name != 'Master')
    })
  );
  @Output() hasSaved: EventEmitter<Role> = new EventEmitter<Role>();
  result: any[] = [];

  constructor(private _ds: DeviceService, private _us: UserService, private _formBuilder: FormBuilder, private auth: AuthService, private router: Router, private _fs: FileService) {
    console.log(this.router.url)
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.loadForm) {
      if (changes.loadForm.currentValue) {
        $(() => {
          $('#smartwizard').smartWizard({
            selected: this.formStep, // Initial selected step, 0 = first step
            // theme: 'default', // theme for the wizard, related css need to include for other than default theme
            justified: true, // Nav menu justification. true/false
            autoAdjustHeight: true, // Automatically adjust content height
            backButtonSupport: true, // Enable the back button support
            enableUrlHash: true, // Enable selection of the step based on url hash
            transition: {
              animation: 'slideHorizontal', // Animation effect on navigation, none|fade|slideHorizontal|slideVertical|slideSwing|css(Animation CSS class also need to specify)
              speed: '400', // Animation speed. Not used if animation is 'css'
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
            getContent: this.provideContent // Callback function for content loading
          });
        });
      }
    }
    console.log(changes);
  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.url = this.router.url;
    console.log(this.url);

  }
  provideContent(idx: any, stepDirection: any, stepPosition: any, selStep: any, callback: any) {
    this.formStep = idx;
    const canisubmit64: any = document.getElementById("canisubmit64");
    console.log(canisubmit64)
    // You can use stepDirection to get ajax content on the forward movement and stepPosition to identify the step position
    if (stepDirection == 'forward' && stepPosition == 'middle') {
      let ajaxURL = "YOUR AJAX URL";
      // Ajax call to fetch your content
      // $.ajax({
      //     method  : "GET",
      //     url     : ajaxURL,
      //     beforeSend: function( xhr:any ) {
      //         // Show the loader
      //         $('#smartwizard').smartWizard("loader", "show");
      //     }
      // }).done(function( res:any ) {
      //     // Build the content HTML
      //     let html = `<div class="card w-100" >
      //                     <div class="card-body">
      //                         <p class="card-text">${res}</p>
      //                     </div>
      //                 </div>`;

      //     // Resolve the Promise with the tab content
      //     callback(html);

      //     // Hide the loader
      //     $('#smartwizard').smartWizard("loader", "hide");
      // }).fail(function(err:any) {
      //     // Handle ajax error

      //     // Hide the loader
      //     $('#smartwizard').smartWizard("loader", "hide");
      // });
    }
    if (this.formStep == 3) {
      canisubmit64.classList.remove('d-none')
    } else {
      canisubmit64.classList.add('d-none')
    }

    // The callback must called in any case to procced the steps
    // The empty callback will not apply any dynamic contents to the steps
    callback();
  }

  clickedUploadFile() {
    const formFile: any = document.getElementById('formFile');
    console.log(formFile)
    formFile.click()
  }
  reset() {
    this.newEmployee = {
      employeeID: '',
      firstName: '',
      lastName: '',
      gender: '',
      marital_status: '',
      country: '',
      phone: '',
      address: '',
      state: '',
      city: '',
      date_of_employment: '',
      dob: '',
      email: '',
      password: '',
      passport: '',
      role: '',
      job_title: '',
      reports_to: '',
      department: '',
      type_of_contract: '',
      working_hours: '',
      cfale: '',
      ale: '',
      ala: '',
      sort_code: '',
      location: '',
      probation: '',
      confidance: '',
      result: '',
      comments: '',
      behavior: '',
      amount: '',
      currency: '',
      pay_type: '',
      payroll: '',
      pension: '',
      name_of_acc: '',
      name_of_bank: '',
      acc_num: '',
    };
    $('#smartwizard').smartWizard("reset");
    $('#smartwizard').smartWizard("goToStep", 0, true);
  }
  resetConfirmation() {
    $('#danger-modal').modal('show');
  }
  uploadPassport() {
    const formFile: any = document.getElementById('formFile1');
    console.log(formFile);
    formFile.click()
  }
  valueChange(value: any) {
    console.log(value)
  }
  handleFileInput(event: any) {
    const files: FileList = event.target.files;
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
    let formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload?.name)
    this._fs.upload(formData)
      .pipe(
        catchError((err: any) => {
          console.log(err);
          return throwError(err);
        })
      )
      .subscribe(
        f => {
          this.newEmployee.passport = f.file;
          console.log(f);
        }
      )

  }
  isCheckedEvent(event: any) {
    console.log(event);
    console.log('here');
  }
  nameSearchChange(event: any) {
    if (event.length > 0) {
      const key = (<string>this.country.search).toLowerCase().trim();
      this.result = this._us.listOfUsersValue().filter(u => u.firstName.toLowerCase().includes(key) || u.lastName.toLowerCase().includes(key));
    } else {
      this.result = [];
    }

  }
  updateImageUploaded() {
    const passportEmployeeephotoId: HTMLInputElement = <HTMLInputElement>document.getElementById("passportEmployeeephotoId");
    passportEmployeeephotoId.click();
  }
  submit() {
    console.log(this.newEmployee)
    this.errorMessage = ``;
    let errF = '';
    for (const [key, value] of Object.entries(this.newEmployee)) {
      const v: any = value;
      if (!v || v.length == 0) {
        this.errorMessage += `${key.replace('_', ' ').toUpperCase()} required, `;
        errF += `${key}, `
      }
    }
    if (this.errorMessage.length > 0) {
      this._ds.openErrorNotification('Opps..', `Please reconfirm form, these fields: ${errF} might have been left empty by you which is required.`);
    } else {
      this._ds.openSuccessNotification('Employee Created', 'Saving Employee info to the database..');
      this.reset()
    }

    // let user = {
    //   firstName: this.firstControls.firstName.value,
    //   lastName: this.firstControls.lastName.value,
    //   country: this.firstControls.country.value,
    //   phone: this.firstControls.phone.value,
    //   state: this.firstControls.state.value,
    //   city: this.firstControls.city.value,
    //   address: this.firstControls.address.value,
    //   dob: this.firstControls.dob.value,
    //   date_of_employment: this.firstControls.date_of_employment.value,
    //   email: this.firstControls.email.value,
    //   password: this.firstControls.password.value,
    //   role: [this.firstControls.role.value],
    //   created_at: new Date(Date.now()).toISOString(),
    //   updated_at: new Date(Date.now()).toISOString(),
    //   status:'Active',
    // }
    // this._us.createUser(user, user.role[0])
    // .pipe(
    //   map(data=>data),
    //   tap(()=>this.saved = true)
    // )
    // .subscribe(
    //   (response:any)=>{
    //     this.message = response.response;
    //     if(response.user){
    //       this.hasSaved.emit(response.user);
    //     }
    //   }
    // )
  }
  loginnow() {
    this.router.navigate(['auth/login'])
  }

}
