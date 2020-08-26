import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HxService} from '../hx.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private diameter: string;

  constructor(private route: Router,
              private root: ActivatedRoute) {
  }

  ngOnInit() {
  }

  showEarPods(smartPhones: string) {
    this.route.navigate(['category', smartPhones]);
  }

  productCategory(product: string) {
    this.route.navigate(['category', 'smartPhones']);
  }

  /**
   * method generate SKU and navigate to particular product page.
   * @param type: string, model type.
   * @param model: string, model name.
   * @param color: string, model color.
   * @param storage: number, storage of model.
   */
  product(type: string, model: string, color: string, storage: number) {
    let sku = 'HX-APPLE-';
    let productSku: string;
    if (type === 'SMARTPHONE') {
      productSku = sku + model + '-' + color + '-' + storage + '-' + 'EX-ON-HXWEB-' + type;
    }
    if (type === 'WEARABLES') {
      productSku = sku + model + '-' + color + '-' + storage +'MM-GPS-CELL-EX-ON-HXWEB-' + type;
    }
    this.route.navigate(['product', productSku]);
  }

}

