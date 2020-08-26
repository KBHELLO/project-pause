import {Component, OnInit} from '@angular/core';
import {HxService} from '../hx.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categoryProduct: object[] = [];

  constructor(private hxService: HxService,
              private route: ActivatedRoute,
              private root: Router) {
  }

  ngOnInit() {
    this.root.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    this.hxService.getCategoryProduct(this.route.snapshot.paramMap.get('name')).subscribe(
      res => {
        //console.log(res);
        for (let i = 0; i < res['res']['asset_details'].length; i++) {
          let category_json = {};
          category_json['asset_name'] = res['res']['asset_details'][i]['asset_name'];
          category_json['sub_category'] = res['res']['asset_details'][i]['sub_category'];
          category_json['sku'] = res['res']['asset_details'][i]['sku'];
          category_json['sale_price'] = res['res']['asset_details'][i]['sale_price'];
          category_json['special_price'] = res['res']['special_price'][i]['special_price'];

          category_json['picture'] = res['res']['pictures'][i]['url'];
          this.categoryProduct.push(category_json);
          //console.log(this.categoryProduct);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  getProductDetailsSku(sku) {
    return sku.split('-');
  }

  goToProduct(sku: string) {
    this.root.navigate(['product', sku]);
  }
}
