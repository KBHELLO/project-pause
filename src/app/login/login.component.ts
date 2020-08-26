import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {State} from '../state';
import {HxService} from '../hx.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signInForm: FormGroup;
  loginForm: FormGroup;
  signSubmitted: boolean = false;
  states: State[] = [];
  cities: [] = [];
  displayCount: number = 0;
  loginSubmitted: boolean = false;
  login_json = {};
  registration_details = {};
  address_details_json = {};
  address_details: object[] = [];


  constructor(private fb: FormBuilder,
              private hxService: HxService,
              private router: Router) {
  }

  ngOnInit() {
    this.signInForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      Phone_number: ['', [Validators.required, Validators.maxLength(10)]],
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      pin_code: ['', [Validators.required, Validators.minLength(6)]],
      land_mark: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      address_type: ['', Validators.required]
    });

    this.loginForm = this.fb.group({
      email_address: ['', [Validators.required, Validators.email]],
      password_hash: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.hxService.getState().subscribe(
      res => {
        for (let i = 0; i < res['res'].length; i++) {
          this.states.push(res['res'][i]);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  get f() {
    return this.signInForm.controls;
  }

  onSubmit() {
    this.signSubmitted = true;
    if (this.signInForm.invalid) {
      return;
    }
    this.registration_details['first_name'] = this.signInForm.get('first_name').value;
    this.registration_details['last_name'] = this.signInForm.get('last_name').value;
    this.registration_details['email_address'] = this.signInForm.get('email').value;
    this.registration_details['password_hash'] = btoa(this.signInForm.get('password').value);
    this.registration_details['mobile_number'] = '+91'+this.signInForm.get('Phone_number').value;
    this.address_details_json['address_line_1'] = this.signInForm.get('addressLine1').value;
    this.address_details_json['address_line_2'] = this.signInForm.get('addressLine2').value;
    this.address_details_json['landmark'] = this.signInForm.get('land_mark').value;
    this.address_details_json['pincode'] = this.signInForm.get('pin_code').value;
    this.address_details_json['city_id'] = this.signInForm.get('city').value;
    this.address_details_json['state_id'] = this.signInForm.get('state').value;
    this.address_details_json['address_type'] = this.signInForm.get('address_type').value;
    this.address_details.push(this.address_details_json);
    this.registration_details['address_details'] = this.address_details;
    console.log('****',this.registration_details);
    this.hxService.registrationUser(this.registration_details).subscribe(
      res => {
        console.log(res);
        window.location.reload();
      },
      err => {
        console.log(err);
      }
    );

  }

  getStateId(event: Event) {
    this.hxService.getCity(event.target['value']).subscribe(
      res => {
        this.cities = res['res'][0];
      },
      err => {
        console.log(err);
      }
    );
  }

  get lf() {
    return this.loginForm.controls;
  }

  loginUser() {
    this.loginSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.login_json['email_address'] = this.loginForm.get('email_address').value;
    this.login_json['password_hash'] = btoa(this.loginForm.get('password_hash').value);
    console.log(this.login_json);
    this.hxService.loginUser(this.login_json).subscribe(
      res => {
        console.log(res);
        if (res['res']['login_status'] === true) {
          localStorage.setItem('user', res['res']['session_id']);
          localStorage.setItem('ufn', btoa(res['res']['customer_details']['customer_details']['first_name']));
          localStorage.setItem('uln', btoa(res['res']['customer_details']['customer_details']['last_name']));
          localStorage.setItem('ui', btoa(res['res']['customer_details']['customer_details']['id']));
          localStorage.setItem('ce', btoa(this.loginForm.get('email_address').value));
          localStorage.setItem('cmn', btoa(res['res']['customer_details']['customer_details']['mobile_number']));
          this.router.navigate(['cart', res['res']['customer_details']['customer_details']['id']]);
        } else {
          this.router.navigate(['home']);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  signInPage() {
    this.displayCount = 1;
  }

  resetForm() {
    this.displayCount = 0;
    this.signInForm.reset();
    this.loginForm.reset();
  }
}
