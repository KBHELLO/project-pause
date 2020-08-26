import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HxService} from '../hx.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart_product = [];
  cart_sku: string;
  update_cart = {};
  update_cart_json = {};
  update_card_product: object[] = [];
  skuArray: string[] = [];

  constructor(private root: ActivatedRoute,
              private hxService: HxService,
              private route: Router) {
  }

  ngOnInit() {
    this.hxService.getAllCartProduct(this.root.snapshot.paramMap.get('id')).subscribe(
      res => {
        //console.log(res['res']);
        //console.log(res['res']['asset_details'][0]['asset_details']['gst_percentage']);
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
            cart_product_json['sale_price'] = res['res']['asset_details'][i]['sale_price'];
            cart_product_json['special_price'] = res['res']['asset_details'][i]['special_price'];
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
            this.cart_product.push(cart_product_json);
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getProductSum() {
    let sum = 0;
    for (let i = 0; i < this.cart_product.length; i++) {
      sum += this.cart_product[i]['quantity'];
    }
    return sum;
  }

  getProductDetailsFromSuk(sku) {
    return sku.split('-');
  }

  getTotalPrice() {
    let totalPrice = 0;
    for (let i = 0; i < this.cart_product.length; i++) {
      let price = 0;
      price = this.cart_product[i]['quantity'] * this.cart_product[i]['special_price'];
      totalPrice += price;
    }
    return totalPrice;
  }

  removeCart() {
    this.hxService.removeFormCart(this.root.snapshot.paramMap.get('id'), this.cart_sku).subscribe(
      res => {
        if (res['res'] === true) {
          window.location.reload();
        }
      }, err => {
        console.log(err);
      }
    );
  }

  updateCart() {
    this.update_cart['customer_id'] = atob(localStorage.getItem('ci'));
    this.update_cart_json['product_sku'] = this.cart_sku;
    this.update_cart_json['quantity'] = 1;
    this.update_card_product.push(this.update_cart_json);
    this.update_cart['cart_details'] = this.update_card_product;
    this.hxService.createOrUpdateCart(this.update_cart).subscribe(
      res => {
        if (res['error'] === false) {
          window.location.reload();
        } else {
          window.location.reload();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  updateQuantity(i: number) {
    this.cart_sku = this.skuArray[i];
  }

  goToPayment() {
    this.route.navigate(['payment']);
  }

  backToProduct(i: number) {
    this.route.navigate(['product', this.skuArray[i]]);
  }

  goToProduct() {
    this.route.navigate(['category', 'SmartPhones']);
  }
}
