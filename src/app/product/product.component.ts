import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {HxService} from '../hx.service';
import {Attribute} from './attribute';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productDetails: {} = {};
  attribute: Attribute[] = [];
  storage: number = 32;
  price: number = 0;
  specialPrice: number = 0;
  processorName: string[] = [];
  cart = {};
  cart_json = {};
  cart_product: object[] = [];
  productImageUrl: string[] = [];
  imageUrl: string;
  productSku: string;
  descriptionImage: string;
  loginDisplayCount: number = 0;
  loginPhoneNoForm: FormGroup;
  otpFormGroup: FormGroup;
  phoneSubmitted: boolean = false;
  isPhoneNoError: boolean = false;
  getOtpServerError: boolean = false;
  otpFormSubmitted: boolean = false;
  isOtpError: boolean = false;

  constructor(private root: ActivatedRoute,
              private hxService: HxService,
              private route: Router,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    //console.log(location.href.split('/')[5]);
    this.hxService.getProduct(location.href.split('/')[5]).subscribe(
      res => {
        //console.log(res);
        this.productDetails = res['res']['asset_details'];
        this.attribute = res['res']['attribute_details'];
        this.productSku = this.productDetails['sku'];
        this.storage = this.getProductDetailsSku(this.productDetails['sku']);
        this.price = res['res']['sale_price'];
        this.specialPrice = res['res']['special_price'];

        for (let i = 0; i < res['res']['pictures'].length; i++) {
          if (res['res']['pictures'][i]['position'] !== 'description') {
            this.productImageUrl.push(res['res']['pictures'][i]);
          } else {
            this.descriptionImage = res['res']['pictures'][i]['url'];
          }
        }
        this.imageUrl = this.productImageUrl[0]['url'];
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

  goCart() {
    if (atob(localStorage.getItem('ci'))) {
      this.cart['customer_id'] = atob(localStorage.getItem('ci'));
    } else {
      this.cart['customer_id'] = 1;
    }
    this.cart_json['product_sku'] = this.root.snapshot.paramMap.get('sku');
    this.cart_json['quantity'] = 1;
    this.cart_product.push(this.cart_json);
    this.cart['cart_details'] = this.cart_product;
    //console.log(this.cart);
    this.hxService.createOrUpdateCart(this.cart).subscribe(
      res => {
        if (res['error'] === false) {
          this.route.navigate(['cart', atob(localStorage.getItem('ci'))]);
        } else {
          window.location.reload();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getUserDetails() {
    return !!(localStorage.getItem('ci') && localStorage.getItem('cm'));
  }

  payment() {
    this.route.navigate(['payment']);
  }

  getProductDetailsSku(sku) {
    if (typeof sku !== 'undefined') {
      return sku.split('-')[4];
    }
  }

  getProcessorName() {
    for (let attribute of this.attribute) {
      if (attribute.id === 8) {
        this.processorName.push(attribute.attribute_value);
      }
      if (attribute.id === 9) {
        this.processorName.push(attribute.attribute_value);
      }
      if (attribute.id === 10) {
        this.processorName.push(attribute.attribute_value);
      }
      if (attribute.id === 11) {
        this.processorName.push(attribute.attribute_value);
      }
    }

    return this.processorName;
  }

  getImage(urlElement: any) {
    this.imageUrl = urlElement;
  }

  get loginFormPhoneNumber() {
    return this.loginPhoneNoForm.controls;
  }

  get otpForm() {
    return this.otpFormGroup.controls;
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
            this.goCart();
          },
          err => {
            this.backPhoneNo();
            this.getOtpServerError = true;
          }
        );
      }
    }
  }
  getOptChange() {
    this.loginDisplayCount = 1;
  }
}
