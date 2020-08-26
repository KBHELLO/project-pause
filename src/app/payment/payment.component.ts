import {Component, OnInit} from '@angular/core';
import {HxService} from '../hx.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {State} from '../state';
import {Validation} from '../../../Helper/validation';
import {el} from '@angular/platform-browser/testing/src/browser_util';

declare const Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  customerAddress: string[] = [];
  customer = {};
  displayCount: number = 0;
  otpPhoneForm: FormGroup;
  isOtpSubmit: boolean = false;
  mobileNo: string;
  cart_product = [];
  skuArray: string[] = [];
  isOtpSubmitted: boolean = false;
  address_id: number;
  paymentProduct: object[] = [];
  paymentDone: boolean = false;
  otpError: boolean = false;
  firstName: string;
  lastName: string;
  isAddressBlank: boolean;
  customerForm: FormGroup;
  customerSubmitted: boolean = false;
  states: State[] = [];
  cities: [] = [];
  address_details_json = {};
  address_details: object[] = [];
  updateAddressForm: FormGroup;
  updateAddressSubmitted: boolean = false;
  isAddressSelected: boolean = false;
  getIndex: number;
  otpPhoneSubmit: boolean = false;
  otpDisplayCount: number = 0;
  otpForm: FormGroup;
  otpNumberSubmit: boolean = false;
  otpPhoneError: boolean = false;
  otpNumberError: boolean = false;
  gstArray: object[] = [];
  productArray: object[] = [];
  payment_details: object[] = [];

  constructor(private hxService: HxService,
              private fb: FormBuilder,
              private route: Router) {
  }

  ngOnInit() {
    this.customerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address_line_1: ['', Validators.required],
      address_line_2: ['', Validators.required],
      landmark: ['', Validators.required],
      pinCode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      address_type: ['', Validators.required]
    });
    this.firstName = atob(localStorage.getItem('ufn'));
    this.lastName = atob(localStorage.getItem('uln'));
    this.otpPhoneForm = this.fb.group({
      phone: [this.otpPhoneNumberSubstring(), [Validators.required,
        Validators.maxLength(10), Validators.minLength(10)]]
    });
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
    this.hxService.getAllCartProduct(atob(localStorage.getItem('ci'))).subscribe(
      res => {
        console.log(res['res']);
        let cart_array = [];
        let quantity_array = [];
        this.cart_product = [];
        for (let i = 0; i < res['res']['cart_details'].length; i++) {
          cart_array.push(res['res']['cart_details'][i]['product_sku']);
          quantity_array.push(res['res']['cart_details'][i]['quantity']);
          this.skuArray.push(res['res']['cart_details'][i]['product_sku']);
        }
        for (let i = 0; i < res['res']['asset_details'].length; i++) {
          let cart_product_json = {};
          if (cart_array.indexOf(res['res']['asset_details'][i]['asset_details']['sku'] !== -1)) {
            cart_product_json['picture'] = res['res']['asset_details'][i]['pictures'][0]['url'];
            cart_product_json['sale_price'] = res['res']['asset_details'][i]['special_price'];
            cart_product_json['sku'] = res['res']['asset_details'][i]['asset_details']['sku'];
            cart_product_json['product_brand'] =
              this.getProductDetailsFromSuk(res['res']['asset_details'][i]['asset_details']['sku'])[1];
            cart_product_json['product_name'] =
              this.getProductDetailsFromSuk(res['res']['asset_details'][i]['asset_details']['sku'])[2];
            cart_product_json['product_color'] =
              this.getProductDetailsFromSuk(res['res']['asset_details'][i]['asset_details']['sku'])[3];
            cart_product_json['product_storage'] =
              this.getProductDetailsFromSuk(res['res']['asset_details'][i]['asset_details']['sku'])[4];
            cart_product_json['quantity'] = quantity_array[i];
            cart_product_json['category_name'] = res['res']['asset_details'][i]['asset_details']['category_name'];
            cart_product_json['gst'] = res['res']['asset_details'][i]['asset_details']['gst_percentage'];
            this.cart_product.push(cart_product_json);

            let product_json = {};
            product_json['sku'] = res['res']['asset_details'][i]['asset_details']['sku'];
            product_json['gst'] = res['res']['asset_details'][i]['asset_details']['gst_percentage'];
            product_json['sale_price'] = res['res']['asset_details'][i]['sale_price'];
            product_json['special_price'] = res['res']['asset_details'][i]['special_price'];
            product_json['category'] = res['res']['asset_details'][i]['asset_details']['category_name'];
            this.productArray.push(product_json);

          }
        }
        console.log('cart array', this.cart_product);
        console.log('product array', this.productArray);
      },
      err => {
        console.log(err);
      }
    );
    this.hxService.getCustomerDetails(atob(localStorage.getItem('ci'))).subscribe(
      res => {
        this.customer['firstName'] = res['res']['customer_details']['first_name'];
        this.customer['lastName'] = res['res']['customer_details']['last_name'];
        for (let i = 0; i < res['res']['address_details'].length; i++) {
          this.customerAddress.push(res['res']['address_details'][i]);
        }
      },
      err => {
        console.log(err);
      }
    );
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

    this.updateAddressForm = this.fb.group({
      updateAddressLine1: ['', Validators.required],
      updateAddressLine2: ['', Validators.required],
      landmark: ['', Validators.required],
      pinCode: ['', Validators.required],
      city1: ['', Validators.required],
      state1: ['', Validators.required],
      address_type1: ['', Validators.required]
    });
  }

  getCustomerId(id: number, index) {
    this.address_id = id;
    this.isAddressSelected = true;
    this.getIndex = index;
    this.mobileNo = atob(localStorage.getItem('cm'));
    /* let optObject = {
       'phone_number': this.mobileNo
     };*/
    /*this.hxService.requestOTP(optObject).subscribe(
      res => {
        this.otpError = res['res'] !== true;
        console.log(res['res']);
      },
      err => {
        console.log(err);
        this.otpError = true;
      }
    );*/
  }

  getProductSum() {
    let sum = 0;
    for (let i = 0; i < this.cart_product.length; i++) {
      sum += this.cart_product[i]['quantity'];
    }
    return sum;
  }

  gst_json;

  get OtpF() {
    return this.otpPhoneForm.controls;
  }

  /*getOtp() {
    this.isOtpSubmit = true;
    if (this.otpPhoneForm.invalid) {
      return;
    }
    let otpVerification = {
      'phone_number': this.mobileNo,
      'otp': this.otpPhoneForm.get('otp').value
    };
    this.hxService.verifyOTP(otpVerification).subscribe(
      res => {
        console.log(res['res']);
        this.isOtpSubmitted = res['res'];
        if (this.isOtpSubmitted) {
          this.displayCount = 2;
        } else {
          window.location.reload();
        }
      }, err => {
        console.log(err);
        window.location.reload();
      }
    );
  }*/

  getTotalPrice() {
    let totalPrice = 0;
    for (let i = 0; i < this.cart_product.length; i++) {
      let price = 0;
      price = this.cart_product[i]['quantity'] * this.cart_product[i]['sale_price'];
      totalPrice += price;
    }
    return totalPrice;
  }

  getProductDetailsFromSuk(sku) {
    return sku.split('-');
  }

  back() {
    this.displayCount = 0;
    this.otpPhoneForm.reset();
  }

  confirmOrder(paymentId) {
    let orders = {};
    orders['platform_id'] = 1;
    orders['channel_type'] = 'ONLINE';
    orders['customer_id'] = atob(localStorage.getItem('ci'));
    orders['shipping_address_id'] = this.address_id;
    orders['payment_method'] = 'Prepaid';
    orders['payment_description'] = 'Payment for HX Order';
    orders['transaction_id'] = paymentId;
    orders['order_base_amount'] = this.getTotalPrice();
    orders['order_total_amount'] = this.getTotalPrice();
    for (let i = 0; i < this.cart_product.length; i++) {
      let payment_order = {};
      payment_order['sku'] = this.cart_product[i]['sku'];
      payment_order['quantity'] = this.cart_product[i]['quantity'];
      payment_order['category'] = 1;
      this.paymentProduct.push(payment_order);
    }
    orders['product_details'] = this.paymentProduct;

    let payment_details = {};
    payment_details['payment_method'] = 2;
    payment_details['transaction_id'] = paymentId;
    payment_details['gst_amount'] = this.getGstAmount();
    payment_details['amount_without_gst'] = this.amountWithoutGst();
    payment_details['total_amount'] = this.getTotalPrice();
    this.payment_details.push(payment_details);
    orders['payment_details'] = this.payment_details;
    this.hxService.requestOrders(orders).subscribe(
      res => {
        if (res['error'] === false) {
          this.paymentDone = true;
          confirm('Order Placed Successfully.');
          this.route.navigate(['home']);
        } else {
          window.location.reload();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  public amountWithoutGst() {
    let withoutGstPrice = 0;
    for (let i = 0; i < this.cart_product.length; i++) {
      withoutGstPrice += this.cart_product[i]['sale_price'];
    }
    return withoutGstPrice - this.getGstAmount();
  }

  getGstAmount() {
    let salePrice;
    let gst;
    let total_amount = 0;
    for (let i = 0; i < this.cart_product.length; i++) {
      gst = this.cart_product[i]['gst'];
      salePrice = this.cart_product[i]['sale_price'];
      total_amount += Math.floor((gst / 100) * salePrice);
    }
    console.log('total amount', total_amount);
    return total_amount;
  }

  shopDone() {
    this.route.navigate(['category', 'SmartPhones']);
  }

  openRazorpayCheckout() {
    if (isNaN(this.address_id)) {
      this.isAddressBlank = true;
    } else {
      this.isAddressBlank = false;
      let options = {
        key: 'rzp_live_RPqEnflbygo2Wv',
        amount: this.getTotalPrice() * 100,
        name: 'Yibeal Tradex Pvt Ltd',
        description: '',
        prefill: {
          name: atob(localStorage.getItem('ufn')),
          contact: atob(localStorage.getItem('cm'))
        },
        notes: {
          address: this.address_id
        },
        theme: {
          color: ''
        },
        handler: this.paymentResponseHander.bind(this)
      };
      let rzp = new Razorpay(options);
      rzp.open();
    }
  }

  paymentResponseHander(response) {
    this.confirmOrder(response.razorpay_payment_id);
  }

  get customerDetailsControl() {
    return this.customerForm.controls;
  }

  customerDetails() {
    this.customerSubmitted = true;
    if (this.customerForm.invalid) {
      return;
    } else {
      let customer = {};
      customer['first_name'] = this.customerForm.get('first_name').value;
      customer['last_name'] = this.customerForm.get('last_name').value;
      customer['email'] = this.customerForm.get('email').value;
      customer['mobile_number'] = atob(localStorage.getItem('cm'));
      this.address_details_json['address_line_1'] = this.customerForm.get('address_line_1').value;
      this.address_details_json['address_line_2'] = this.customerForm.get('address_line_2').value;
      this.address_details_json['landmark'] = this.customerForm.get('landmark').value;
      this.address_details_json['pincode'] = this.customerForm.get('pinCode').value;
      this.address_details_json['city_id'] = this.customerForm.get('city').value;
      this.address_details_json['state_id'] = this.customerForm.get('state').value;
      this.address_details_json['address_type'] = this.customerForm.get('address_type').value;
      this.address_details.push(this.address_details_json);
      customer['address_details'] = this.address_details;
      this.hxService.registrationUser(customer).subscribe(
        res => {
          console.log(res);
          window.location.reload();
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  closeModal() {
    window.location.reload();
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

  get updateAddress() {
    return this.updateAddressForm.controls;
  }

  updateCustomer() {
    this.updateAddressSubmitted = true;
    if (this.updateAddressForm.invalid) {
      return;
    } else {
      let updateAddress = {};
      updateAddress['mobile_number'] = atob(localStorage.getItem('cm'));
      this.address_details_json['address_line_1'] = this.updateAddressForm.get('updateAddressLine1').value;
      this.address_details_json['address_line_2'] = this.updateAddressForm.get('updateAddressLine1').value;
      this.address_details_json['landmark'] = this.updateAddressForm.get('landmark').value;
      this.address_details_json['pincode'] = this.updateAddressForm.get('pinCode').value;
      this.address_details_json['city_id'] = this.updateAddressForm.get('city1').value;
      this.address_details_json['state_id'] = this.updateAddressForm.get('state1').value;
      this.address_details_json['address_type'] = this.updateAddressForm.get('address_type1').value;
      this.address_details.push(this.address_details_json);
      updateAddress['address_details'] = this.address_details;
      console.log(updateAddress);
      this.hxService.registrationUser(updateAddress).subscribe(
        res => {
          console.log(res);
          window.location.reload();
        },
        err => {
          console.log(err);
        }
      );

    }
  }

  otpPhoneNumberSubstring() {
    return atob(localStorage.getItem('cm')).substr(3);
  }

  get otpPhoneFormControl() {
    return this.otpPhoneForm.controls;
  }

  getPhoneNumber() {
    this.otpPhoneSubmit = true;
    if (this.otpPhoneForm.invalid) {
      return;
    } else {
      if (Validation.ValidateNumber(this.otpPhoneForm.get('phone').value)) {
        let optObject = {
          'phone_number': '+91' + this.otpPhoneForm.get('phone').value
        };
        this.hxService.requestOTP(optObject).subscribe(
          res => {
            if (res['res'] === true) {
              this.otpDisplayCount = 1;
            } else {
              this.otpPhoneError = true;
            }
          },
          err => {
            this.otpPhoneError = true;
          }
        );
      } else {
        this.otpPhoneError = true;
      }
    }
  }

  get otpNumberControl() {
    return this.otpForm.controls;
  }

  getOtpNumber() {
    this.otpNumberSubmit = true;
    if (this.otpForm.invalid) {
      return;
    } else {
      if (Validation.ValidateNumber(this.otpForm.get('otp').value)) {
        let otpVerification = {
          'phone_number': '+91' + this.otpPhoneForm.get('phone').value,
          'otp': this.otpForm.get('otp').value
        };
        this.hxService.verifyOTP(otpVerification).subscribe(
          res => {
            console.log(res);
            if (res['res'][0] === true) {
              this.otpDisplayCount = 2;
            } else {
              this.otpNumberError = true;
            }
          }, err => {
            this.otpNumberError = true;
          }
        );
      } else {
        this.otpNumberError = true;
      }
    }
  }

  openCashOnDelivery() {
    if (isNaN(this.address_id)) {
      this.isAddressBlank = true;
    } else {
      this.isAddressBlank = false;
      // @ts-ignore
      $('#CODModal').modal('show');
    }
  }

  payCashOnDelivery() {
    // @ts-ignore
    $('#CODModal').modal('hide');
    let options = {
      key: 'rzp_live_RPqEnflbygo2Wv',
      amount: 500 * 100,
      name: 'Yibeal Tradex Pvt Ltd',
      description: '',
      prefill: {
        name: atob(localStorage.getItem('ufn')),
        contact: atob(localStorage.getItem('cm'))
      },
      notes: {
        address: this.address_id
      },
      theme: {
        color: ''
      },
      handler: this.codPaymentResponseHandler.bind(this)
    };
    let rzp = new Razorpay(options);
    rzp.open();
  }

  codPaymentResponseHandler(response) {
    this.confirmCodOrder(response.razorpay_payment_id);
  }

  confirmCodOrder(paymentId) {
    let orders = {};
    orders['platform_id'] = 1;
    orders['channel_type'] = 'ONLINE';
    orders['customer_id'] = atob(localStorage.getItem('ci'));
    orders['shipping_address_id'] = this.address_id;
    orders['payment_method'] = 'Prepaid';
    orders['payment_description'] = 'Payment for HX Order';
    orders['transaction_id'] = paymentId;
    orders['order_base_amount'] = 500;
    orders['order_total_amount'] = 500;
    for (let i = 0; i < this.cart_product.length; i++) {
      let payment_order = {};
      payment_order['sku'] = this.cart_product[i]['sku'];
      payment_order['quantity'] = this.cart_product[i]['quantity'];
      payment_order['category'] = 1;
      this.paymentProduct.push(payment_order);
    }
    let payment_details = {};
    payment_details['payment_method'] = 3;
    payment_details['transaction_id'] = paymentId;
    payment_details['gst_amount'] = 0;
    payment_details['amount_without_gst'] = 500;
    payment_details['total_amount'] = 500;
    this.payment_details.push(payment_details);
    orders['product_details'] = this.paymentProduct;
    orders['payment_details'] = this.payment_details;
    this.hxService.requestOrders(orders).subscribe(
      res => {
        if (res['error'] === false) {
          this.paymentDone = true;
          confirm('Order Placed Successfully.');
          this.route.navigate(['home']);
        } else {
          window.location.reload();
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
