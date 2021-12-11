import {Injectable} from '@angular/core';
import {Cart} from '../models/cart';
import {Company} from '../models/company';
import {User} from '../models/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Order} from '../models/order';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  private erpBaseUri = 'jakiś tam adres url do API eNovy';

  constructor(private http: HttpClient) {
  }

  makeOrder(cart: Cart, user: User, company: Company) {
    const url = `${this.erpBaseUri}/addOrder`;
    return this.http.post(url, {cart, user, company});
  }

  updateOrderStatus(updateOrder: Order, status: string) {
    const url = `${this.erpBaseUri}/updateOrder`;
    updateOrder.status = status;
    updateOrder.updatedAt = new Date();
    return this.http.put(url, updateOrder, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateOrderComment(updateOrder: Order, comment: string) {
    const url = `${this.erpBaseUri}/updateOrder`;
    updateOrder.comments = comment;
    updateOrder.updatedAt = new Date();
    return this.http.put(url, updateOrder, {headers: this.headers}).pipe(catchError(err => err));
  }

  setUserForOrder(updateOrder: Order, user: User) {
    const url = `${this.erpBaseUri}/updateOrder`;
    if (user) {
      updateOrder.user = user;
    }
    updateOrder.updatedAt = new Date();
    return this.http.put(url, updateOrder, {headers: this.headers}).pipe(catchError(err => err));
  }

  setUserAndCompanyForOrder(updateOrder: Order, user: User, company: Company) {
    const url = `${this.erpBaseUri}/updateOrder`;
    if (user) {
      updateOrder.user = user;
    }
    if (company) {
      updateOrder.company = company;
    }
    updateOrder.updatedAt = new Date();
    return this.http.put(url, updateOrder, {headers: this.headers}).pipe(catchError(err => err));
  }
}
