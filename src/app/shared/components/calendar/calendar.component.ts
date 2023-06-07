import { Component, OnInit, Input, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { User } from '../../models/User';
import { BookingService } from '../../services/booking/booking.service';
import { Booking } from '../../models/Booking';
import { environment } from 'src/environments/environment';
import { PlanService } from '../../services/plan/plan.service';
import { Plan } from '../../models/Plan';
import { AsyncPaymentOptions, Flutterwave } from 'flutterwave-angular-v3';
declare const jQuery: any;
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() id: string = 'calendar';
  canCreate: boolean = false;
  selectedPeriod: any = null;
  today: any = new Date().toISOString().slice(0, 16);
  eventList: any = [
  ];
  reference = 'ref-27535012752945';
  cleaners$: Observable<User[]> = this._us.cleaners$;
  publicKey = environment.flutter_public_key;
  newBooking: any = {
    postal: '',
    start: this.today,
    end: null,
    name: '',
    description: '',
    frequency: '',
    extra_service: '',
    color: 'fc-bg-default',
    icon: 'circle',
    cleaner: null,
    country: '',
    pricing: null,
    payment: null,
  }
  message = '';
  amount: number = 1;

  customizations = { title: 'Chow Cheap', description: 'Make your final payment for this order and get your item delivered ASAP!', logo: 'https://flutterwave.com/images/logo-colored.svg' }

  meta = {
    'counsumer_id': '7898',
    'consumer_mac': 'kjs9s8ss7dd'
  }
  user:any = null;

  //updated by the checkout() 
  customerDetails = {
    name: 'Demo Customer  Name',
    amount: 0,
    email: 'customer@mail.com', phone_number: '08100000000'
  }
  calendar: any = (params: any) => jQuery(`#${this.id}`).fullCalendar(params);
  params: any = {
    themeSystem: "bootstrap4",
    // emphasizes business hours
    businessHours: false,
    defaultView: "month",
    // event dragging & resizing
    editable: true,
    // header
    header: {
      left: "title",
      center: "month,agendaWeek,agendaDay",
      right: "today prev,next",
    },
    events: this.eventList,
    dayClick: (e: any) => {
      this.clickedOnDay(e);
      jQuery("#modal-view-event-add").modal();
    },
    eventClick: (event: any, jsEvent: any, view: any) => {
      console.log(event);
      jQuery(".event-icon").html("<i class='fa fa-" + event.icon + "'></i>");
      jQuery(".event-title").html(event.title);
      jQuery(".event-postal").html(event.postal);
      jQuery(".event-country").html(event.country);
      jQuery(".event-frequency").html(event.frequency);
      jQuery(".event-start").html(event.start);
      jQuery(".event-end").html(event.end);
      jQuery(".event-cleaner").html(event.cleaner);
      jQuery(".event-extra_service").html(event.extra_service);
      jQuery(".event-body").html(event.description);
      jQuery(".eventUrl").attr("href", event.url);
      jQuery("#modal-view-event").modal();
    },
  }
  bookings$: Observable<Booking[]> = this._bs.bookings$.pipe(
    map((events: any[]) => events.map(e => {
      return { ...e, date: e.start, title: `${e.country} ${e.postal} Between ${e.from} to ${e.end}` }
    })),
    tap((events: any[]) => {
      this.eventList = events;
      this.params.events = this.eventList;
    })
  );
  plans$: Observable<Plan[]> = this._ps.plans$;
  paymentData: AsyncPaymentOptions = {
    public_key: this.publicKey,
    tx_ref: this.generateReference(),
    amount: 10,
    currency: "GBP",
    payment_options: "card,ussd",
    meta: this.meta,
    customer: this.customerDetails,
    customizations: this.customizations,
  };
  constructor(private flutterwave: Flutterwave, private _ps: PlanService, private _us: UserService, private _bs: BookingService, private crf: ChangeDetectorRef) { }
  ngOnDestroy(): void {

  }

  async payViaPromise() {
    return this.flutterwave.asyncInlinePay(this.paymentData);
  }
  generateReference(): string {
    let date = new Date();
    return date.getTime().toString();
  }

  setAmount(event: any) {
    if (event) {
      this.plans$.subscribe(
        list => {
          this.amount = <number>list.find(l => l.id == event)?.amount;
          this.customerDetails.amount = this.amount;
          this.paymentData.amount = this.amount;
        }
      )
    } else {
      this.amount = 1;
    }
  }


  ngAfterViewInit(): void {
    this.bookings$.subscribe(
      result => {
        console.log(result);
        this.eventList = result;
        if(result.length > 0){
          this.params.events = result;
        }
        this.crf.detectChanges();
        this.calendar(this.params);

      }
    )
  }
  ngOnInit(): void {
    this._us.user$.subscribe(
      u=>{
        this.user = u;
        console.log(u);
        if(u && u.id){
          this.customerDetails.name = <string>u.firstName;
          this.customerDetails.email = u.email;
          this.customerDetails.phone_number = (<any>u.phone);
          this.meta.counsumer_id = (<any>u.id);
        }
      }
    )
    this.plans$.subscribe(
      p => console.log(p)
    );

  }

  clickedOnDay(event: any) {
    const rn = new Date(Date.now());
    const selected = new Date(event._d);
    this.selectedPeriod = selected;
    this.newBooking.start = this.selectedPeriod;
    console.log(event);
    console.log(selected);
    console.log(rn);
    if (rn.getTime() < selected.getTime()) {
      this.canCreate = true;
    } else {
      this.canCreate = false;
    }
    console.log(this.canCreate);
  }

  async submit() {
    let message = '';
    this.message = '';
    console.log(this.newBooking)
    if (!this.newBooking.country) {
      message += `Country (*) is required`;
    }
    if (!this.newBooking.postal) {
      message += `Postal (*) is required`;
    }
    if (!this.newBooking.name) {
      message += `Address (*) is required`;
    }
    if (!this.newBooking.start) {
      message += `Start date (*) is required`;
    }
    if (!this.newBooking.end) {
      message += `End date (*) is required`;
    }
    if (!this.newBooking.description) {
      message += `Description (*) is required`;
    }
    if (!this.newBooking.frequency) {
      message += `Frequency (*) is required`;
    }
    if (!this.newBooking.pricing) {
      message += `Pricing (*) is required`;
    }
    if (message.length > 1) {
      this.message = message;
      return;
    }
    await this.payViaPromise().then((response:any) => {
      console.log("Promise Res", response);
      // {
      //   "status": "successful",
      //     "customer": {
      //     "name": "Demo Customer  Name",
      //       "email": "customer@mail.com"
      //   },
      //   "transaction_id": 4346167,
      //     "tx_ref": "1684882159216",
      //       "flw_ref": "FLW-MOCK-2ce8edc63c212f59edbc20c6701400c0",
      //         "currency": "GBP",
      //           "amount": 10,
      //             "charged_amount": 10,
      //               "charge_response_code": "00",
      //                 "charge_response_message": "Please enter the OTP sent to your mobile number 080****** and email te**@rave**.com",
      //                   "created_at": "2023-05-23T22:50:18.000Z"
      // }
      if(response.status == 'successful'){
        this.newBooking.payment = response;
        this.newBooking.status = response.status;
        this.newBooking.created_at = this.today;
        this.newBooking.updated_at = this.today;
        this.newBooking.title = undefined;
        this.newBooking.date = undefined;
        this.newBooking.user = this.user;
        this._bs.add(this.newBooking).subscribe(
          r=>{
            console.log(r);
            this.newBooking = {
              postal: '',
              start: this.today,
              end: null,
              description: '',
              name: '',
              frequency: '',
              extra_service: '',
              color: 'fc-bg-default',
              icon: 'circle',
              cleaner: null,
              country: '',
              pricing: null,
              user: null,
              payment: null,
              status: '',
              created_at: '',
              updated_at: ''
            }
            this.message = 'New booking created.';
            this.bookings$.subscribe(
              result => {
                console.log(result);
                this.eventList = result;
                this.params.events = result;
                console.log(this.params);
                this.crf.detectChanges();
                this.calendar(this.params);
                // jQuery(`#${this.id}`).fullCalendar(this.params);
              }
            )
          }
        );

      }else{
        this.message = 'Issues with payment from payment gateway. Please rectify payment issues with https://flutterwave.com/';
      }
      this.flutterwave.closePaymentModal(5);
    }).finally(
      ()=>{
        this.bookings$.subscribe(
          result => {
            console.log(result);
            console.log(this.params);
            this.crf.detectChanges()
            this.calendar(this.params);
          }
        )
      }
    );
  }
}
