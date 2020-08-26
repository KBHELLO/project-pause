import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductCategory} from './category/productCategory';
import {State} from './state';

@Injectable({
  providedIn: 'root'
})
export class HxService {

  private url = 'http://13.235.88.230/api/v2/';
  //private url =  'http://192.168.5.89:7010/';
  private getCategory = this.url + 'asset?key=tQKkhzcy1w6JM1r5&category_name=';

  constructor(private http: HttpClient) {
  }

  getCategoryProduct(data): Observable<ProductCategory []> {
    const getUrl = this.getCategory + data + '&is_filter=1';
    return this.http.get<ProductCategory []>(getUrl);
  }

  getProduct(sku) {
    const getUrl = this.url + 'asset?key=tQKkhzcy1w6JM1r5&sku=' + sku;
    return this.http.get<any>(getUrl);
  }

  getState(): Observable<State[]> {
    const getUrl = this.url + 'details/state?key=tQKkhzcy1w6JM1r5';
    return this.http.get<State[]>(getUrl);
  }

  getCity(id) {
    const getUrl = this.url + 'details/city?key=tQKkhzcy1w6JM1r5&state_id=' + id;
    return this.http.get<any>(getUrl);
  }

  loginUser(data) {
    const getUrl = this.url + 'customer/login?key=tQKkhzcy1w6JM1r5';
    return this.http.post<any>(getUrl, data);
  }

  registrationUser(data) {
    const getUrl = this.url + 'customer?key=tQKkhzcy1w6JM1r5';
    return this.http.post<any>(getUrl, data,);
  }

  createOrUpdateCart(data) {
    const getUrl = this.url + 'cart?key=tQKkhzcy1w6JM1r5';
    return this.http.post<any>(getUrl, data);
  }

  getAllCartProduct(id) {
    const getUrl = this.url + 'cart?key=tQKkhzcy1w6JM1r5&customer_id=' + id;
    return this.http.get<any>(getUrl);
  }

  removeFormCart(customerId, sku) {
    const getUrl = this.url + 'cart?key=tQKkhzcy1w6JM1r5&customer_id=' + customerId + '&product_sku=' + sku;
    return this.http.delete<any>(getUrl);
  }

  getCustomerDetails(id) {
    const getUrl = this.url + 'customer?key=tQKkhzcy1w6JM1r5&customer_id=' + id;
    return this.http.get<any>(getUrl);
  }

  requestOTP(data) {
    const getUrl = this.url + 'otp?key=tQKkhzcy1w6JM1r5';
    return this.http.post<any>(getUrl, data);
  }

  verifyOTP(data) {
    const getUrl = this.url + 'otp?key=tQKkhzcy1w6JM1r5';
    return this.http.put(getUrl, data);
  }

  requestOrders(data) {
    const getUrl = this.url + 'orders?key=tQKkhzcy1w6JM1r5';
    return this.http.post(getUrl, data);
  }

  getCustomerOrderDetails(id) {
    const getUrl = this.url + 'orders?key=tQKkhzcy1w6JM1r5&customer_id=' + id;
    return this.http.get<any>(getUrl);
  }

  getCustomer(session_id) {
    const getUrl = this.url + 'customer/login?key=tQKkhzcy1w6JM1r5&session_id=' + session_id;
    return this.http.get<any>(getUrl);
  }

  cancelOrders(data) {
    const getUrl = this.url + 'orders?key=tQKkhzcy1w6JM1r5';
    return this.http.put<any>(getUrl, data);
  }
}
