import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {HxService} from './hx.service';
import {Constant} from '../../Helper/constant';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'HX';
  searchProduct: object[] = [];
  searchValue: string;
  firstName: string;
  lastName: string;
  myProducts: object[] = [];
  login: string = Constant.LOGIN;
  cart: string = Constant.CART;
  getOurApp: string = Constant.GET_OUR_APP;
  loginDisplayCount: number = 0;
  loginPhoneNoForm: FormGroup;
  otpFormGroup: FormGroup;
  phoneSubmitted: boolean = false;
  otpFormSubmitted: boolean = false;
  isPhoneNoError: boolean = false;
  isOtpError: boolean = false;
  getOtpServerError: boolean = false;
  cancelId: number;
  canceled: boolean;

  constructor(private router: Router,
              private hxService: HxService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    this.firstName = atob(localStorage.getItem('ufn'));
    this.lastName = atob(localStorage.getItem('uln'));
    this.hxService.getCategoryProduct('SmartPhones').subscribe(
      res => {
        for (let i = 0; i < res['res']['pictures'].length; i++) {
          let searchProductJson = {};
          this.getModelNameFromSku(res['res']['pictures'][i]['sku']);
          searchProductJson['brand'] = this.getModelNameFromSku(res['res']['pictures'][i]['sku'])[1];
          searchProductJson['model'] = this.getModelNameFromSku(res['res']['pictures'][i]['sku'])[2];
          searchProductJson['color'] = this.getModelNameFromSku(res['res']['pictures'][i]['sku'])[3];
          searchProductJson['storage'] = this.getModelNameFromSku(res['res']['pictures'][i]['sku'])[4];
          searchProductJson['url'] = res['res']['pictures'][i]['url'];
          this.searchProduct.push(searchProductJson);
        }
      },
      err => {
        console.log(err);
      }
    );
    this.loginPhoneNoForm = this.fb.group({
      phoneNumber: ['', [Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10)]]
    });

    this.otpFormGroup = this.fb.group({
      otp: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]]
    });
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

  goCart() {
    this.router.navigate(['cart', atob(localStorage.getItem('ci'))]);
  }

  getApp() {

    // @ts-ignore
    window.location = 'https://play.google.com/store/apps/details?id=com.hyperxchange.hx_marketplace&hl=en_IN';
  }

  getUserDetails() {
    return !!(localStorage.getItem('ci') && localStorage.getItem('cm'));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['home']);
  }

  getModelNameFromSku(sku) {
    return sku.split('-');
  }

  getSearchProduct() {
    if (!this.searchValue.includes('Search entire store...')) {
      this.searchValue.split(' ');
      let sku = 'HX-' + this.searchValue.split(' ')[0] + '-' + this.searchValue.split(' ')[1] +
        '-' + this.searchValue.split(' ')[2] + '-' + this.searchValue.split(' ')[3] +
        '-EX-ON-HXWEB-SMARTPHONE';
      this.searchValue = '';
      this.router.navigate(['product', sku]);
    }
  }

  getOrder() {
    this.hxService.getCustomerOrderDetails(atob(localStorage.getItem('ci'))).subscribe(
      res => {
        console.log(res);
        for (let i = 0; i < res['res'].length; i++) {
          let myOrderObject = {};
          let product: object[] = [];
          myOrderObject['delivery_date'] = res['res'][i]['delivery_date'];
          myOrderObject['hx_order_id'] = res['res'][i]['channel_order_id'];
          myOrderObject['order_date'] = res['res'][i]['order_date'];
          myOrderObject['order_total_amount'] = res['res'][i]['order_total_amount'];
          myOrderObject['status_name'] = res['res'][i]['status_name'];
          for (let j = 0; j < res['res'][i]['product_details'].length; j++) {
            let myProductObject = {};
            myProductObject['sku'] = res['res'][i]['product_details'][j]['sku'];
            myProductObject['quantity'] = res['res'][i]['product_details'][j]['quantity'];
            product.push(myProductObject);
          }
          myOrderObject['product'] = product;
          this.myProducts.push(myOrderObject);
        }
        console.log(this.myProducts);
      },
      err => {
        console.log(err);
      }
    );
  }

  splitSku(sku) {
    return sku.split('-');
  }

  splitD(d) {
    return d.split('T');
  }

  getOptChange() {
    this.loginDisplayCount = 1;
  }

  get loginFormPhoneNumber() {
    return this.loginPhoneNoForm.controls;
  }

  loginPhoneNo() {
    this.phoneSubmitted = true;
    if (this.loginPhoneNoForm.invalid) {
      return;
    } else {
      if (isNaN(this.loginPhoneNoForm.get('phoneNumber').value)) {
        this.isPhoneNoError = true;
      } else {
        let requestOtpObject = {};
        requestOtpObject['phone_number'] = '+91' + this.loginPhoneNoForm.get('phoneNumber').value;
        this.hxService.requestOTP(requestOtpObject).subscribe(
          res => {
            if (res['res'] === true) {
              this.loginDisplayCount = 1;
            }
          }, err => {
            this.getOtpServerError = true;
            this.backPhoneNo();
          }
        );
      }
    }
  }

  backPhoneNo() {
    this.loginDisplayCount = 0;
    this.loginPhoneNoForm.reset();
    this.otpFormGroup.reset();
    this.isPhoneNoError = false;
    this.phoneSubmitted = false;
    this.otpFormSubmitted = false;
    this.isOtpError = false;
  }

  get otpForm() {
    return this.otpFormGroup.controls;
  }

  otpFormSubmit() {
    this.otpFormSubmitted = true;
    if (this.otpFormGroup.invalid) {
      return;
    } else {
      if (isNaN(this.otpFormGroup.get('otp').value)) {
        this.isOtpError = true;
      } else {
        let otpObject = {};
        otpObject['mobile_number'] = '+91' + this.loginPhoneNoForm.get('phoneNumber').value;
        otpObject['otp'] = this.otpFormGroup.get('otp').value;
        this.hxService.loginUser(otpObject).subscribe(
          res => {
            localStorage.setItem('csi', btoa(res['res']['session_id']));
            localStorage.setItem('ci', btoa(res['res']['customer_details']['customer_details']['id']));
            localStorage.setItem('cm', btoa(res['res']['customer_details']['customer_details']['mobile_number']));
            // @ts-ignore
            $('#loginModal').modal('hide');
            this.router.navigate(['cart', res['res']['customer_details']['customer_details']['id']]);
          },
          err => {
            this.backPhoneNo();
            this.getOtpServerError = true;
          }
        );
      }
    }
  }

  onActivate($event: any) {
    window.scroll(0, 0);
  }

  cancelOrderId(id: number) {
    this.cancelId = id;
  }

  cancelOrder() {
    let cancelProduct = {};
    cancelProduct['channel_order_id'] = this.cancelId;
    cancelProduct['customer_id'] = atob(localStorage.getItem('ci'));
    console.log(cancelProduct);
    this.hxService.cancelOrders(cancelProduct).subscribe(
      res => {
        console.log(res);
      }, err => {
        console.log(err);
      }
    );
  }

  momLogin() {
    //this.router.navigate(['http://192.168.5.143:4200']);
    // @ts-ignore
    //window.location = 'http://192.168.5.143:4200';
  }
}
