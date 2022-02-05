import {Injectable} from '@angular/core';
import {Cart} from '../models/cart';
import {Company} from '../models/company';
import {User} from '../models/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Order} from '../models/order';
import {catchError} from 'rxjs/operators';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Flashing} from '../models/flashing';
import {Item} from '../models/item';
import {Address} from '../models/address';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  private erpBaseUri = 'jakieś tam adres url do API eNovy';

  // TODO do usunięcia po podłączeniu API z eNova
  windowToTests = new RoofWindowSkylight('1O-ISO-V-E02-KL00-A7022P-078118-OKPO01', 'ISO E02 78x118', 'ISO E02 78x118', 'I-OKNO', 'NPL-OKNO', 'Sprawdzony', 'Okno:ISOV', 'Okno:E02', 'dwuszybowy',
    78, 118, 'OknoDachowe', 'OknoDachowe:Okno', 'Okno:IS1', 'OknoDachowe:ISO', 'Okno:Obrotowe', 'NawiewnikNeoVent', 'DrewnoSosna',
    'Drewno:Bezbarwne', 'OknoDachowe:IS', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'Okno:ExtraSecure',
    'Okno:RAL7048', null, 4, [], ['zewnetrznaHartowana'], ['assets/img/products/ISO-I22.png'], [], 997, 1.2, 1.0, 2000, 'Okno:RAL7048', 'Okno:RAL7048', null, 0, 'PL');
  temporaryFlashing = new Flashing('1K-1-U-UO------A7022P-055098-OKPK01', 'UN/O 055x098 Kołnierz uniwersalny /A7022P/UO/OKPK01', 'Kołnierz U 55x98 UO', 'I-KOLNIERZ', 'NPL-KOLNIERZ', 'Nowy', 'U', 55, 98, 'KołnierzUszczelniający',
    'KolnierzUszczelniający', 'Kołnierz:U', 'KołnierzUszczelniający:K-1', 'KołnierzUszczelniający', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'U', 0, 'UO', 5, 0, 0,
    270, ['78x118', '78x140'], ['assets/img/products/flashings.jpg'], 'PL', false, null);
  testCart = new Cart('234fgsdf',
    [new Item('34234fg', this.windowToTests, 2, 0, new Date(), true),
      new Item('vcxzv3423', this.temporaryFlashing, 1, 0, new Date(), true)],
    new Date().valueOf(), this.windowToTests.CenaDetaliczna, this.windowToTests.CenaDetaliczna, 'PLN', 1, 0.23, true, true);
  companyToTests = new Company('', 'Felek', 'm.demski@okpol.pl', '11122233344', 0.02, 0.38, 0.38, 0.38, 0.38, 0.38, 0.63,
    50000, new Address('Lolek', 'Bolek', '123456789', 'Felkowa', '3/1', '10-150', 'Lewin', 'Polzka'),
    'DTHXX', 10000000, 11000000, 10, 20, 30, 40, 50, 0, [], [], null);
  userToTest = new User('34t435345235', 'test@test.pl', '1234', '1234', 'User Test', 'user', true, 'asgasgagd-agwegah-wtwet2352af',
    0, 0, 0, 0, 0, 0, 0, '11122233344', '132353634lj3453', null, 'www', new Date(), new Date());

  constructor(private http: HttpClient) {
  }

  getUserOrders() {
    // TODO do usunięcia po podłączeniu API z eNova i przefiltrować po statusach zamówień
    // const url = `${this.erpBaseUri}`;
    // return this.http.get(url);
    return of([new Order('654321', this.testCart, '123456/01/2022', new Date(), new Date(), '0. Poczeklania', this.companyToTests, this.userToTest, 'Proszę o pilną realizację')]);

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
