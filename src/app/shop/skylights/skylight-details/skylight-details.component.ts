import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {AppState} from '../../../store/app/app.state';
import {CartState} from '../../../store/cart/cart.state';
import {RoofWindowSkylight} from '../../../models/roof-window-skylight';
import {Accessory} from '../../../models/accessory';
import {CrudService} from '../../../services/crud-service';
import {filter, map, takeUntil} from 'rxjs/operators';
import {RouterState} from '@ngxs/router-plugin';
import {SkylightState} from '../../../store/skylight/skylight.state';
import {AddProductToCart} from '../../../store/cart/cart.actions';
import {Router} from '@angular/router';

@Component({
  selector: 'app-skylight-details',
  templateUrl: './skylight-details.component.html',
  styleUrls: ['./skylight-details.component.scss']
})
export class SkylightDetailsComponent implements OnInit, OnDestroy {
  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(CartState) cart$: Observable<any>;
  skylight$: Observable<RoofWindowSkylight>;
  logInUser: {
    email: string;
    userName: string;
    isLogged: boolean;
  };
  skylightToShow: RoofWindowSkylight;
  isDestroy$ = new Subject();
  picturesOfSkylight = [];
  skylightMaterial: string;
  glazing: string;
  priceAfterDisc$ = new Subject<number>();
  availableSizes = ['47x73', '47x57', '86x86', '55x78', '55x98', '66x98', '78x98'];
  quantity = 1;
  availableExtras: Accessory[] = [];

  constructor(private store: Store, private crud: CrudService, public router: Router) {
    this.user$.pipe(takeUntil(this.isDestroy$)).subscribe(user => this.logInUser = user.currentUser);
    this.store.select(RouterState).pipe(takeUntil(this.isDestroy$)).subscribe(state => {
      this.skylight$ = this.store.select(SkylightState.skylightByCode).pipe(
        map(filterFn => filterFn(state['params'].skylightId.toString())));
    });
  }

  ngOnInit(): void {
    this.skylight$.pipe(takeUntil(this.isDestroy$)).subscribe(skylight => {
      this.skylightToShow = skylight;
      this.skylightMaterial = skylight.stolarkaMaterial;
      // TODO odkomentować po wczytaniu danych z eNova i zakomnetować kolejną linię
      // this.glazing = window.pakietSzybowy.split(':')[1];
      this.glazing = skylight.pakietSzybowy;
    });
    // TODO wczytać zdjęcia z bazy przypisane do danego indeksu
    this.picturesOfSkylight.push('assets/img/products/WVD+47x73');
    this.picturesOfSkylight.push('assets/img/products/WVD+-arrangement-1.png');
    this.picturesOfSkylight.push('assets/img/products/WVD+-arrangement-2.png');
    this.getDiscountPrice();
    // TODO napisać obsługę tej metody z wykorzystaniem store'a
    // this.availableExtras.push(this.db.getAccessoryById(1), this.db.getAccessoryById(2));
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroy$)).subscribe(() => console.log);
    // TODO wczytywać to z produktu po uzupełnieniu w eNova
    this.availableExtras.push(new Accessory('1234', 'Roletka', 'Roletka', 'NPL-ROLETAW', 'NEN-ROLETAW', '3. Dopuszczony',
      'D37', 78, 118, 'Akcesorium', 'RoletaWewnetrzna', 'D', 'D37', 'Wewnetrzne', 'A', 'B', 'Zaciemniająca',
      'A347', 'Srebeny', null, null, null, 'Srebrny', 0, 'manualne', '1234',
      123, ['a'], ['78x118'], 'PL', ''));
  }

  ngOnDestroy(): void {
    this.isDestroy$.next(null);
  }

  getDiscountPrice() {
    if (this.logInUser.isLogged) {
      return this.crud.readUserByEmail(this.logInUser.email).pipe(takeUntil(this.isDestroy$)).subscribe(user => {
        this.priceAfterDisc$.next(this.skylightToShow.CenaDetaliczna / (1 + user.basicDiscount + user.skylightsDiscount));
      });
    }
  }

  resize(delta: number) {
    this.quantity = this.quantity + delta;
  }

  decreaseQuantity() {
    if (this.quantity === 1) {
      this.quantity = 1;
    } else {
      this.resize(-1);
    }
  }

  increaseQuantity() {
    this.resize(+1);
  }

  addToCart(product, quantity: number) {
    this.store.dispatch(new AddProductToCart(product, quantity));
  }

  order(quantity: number) {
    // TODO napisać obsługę tej metody z wykorzystaniem store'a
    // this.db.order(this.windowToShow, quantity);
  }

  returnCurrencyName(currency: string) {
    if (currency === 'EUR') {
      return '€';
    } else {
      return 'zł';
    }
  }

  getLinkCode(kod: string, size: string) {
    const firstPart = kod.substring(0, kod.length - 13);
    const secondPart = kod.substring(kod.length - 13);
    const specNumber = secondPart.split('-')[1];
    const szerokosc = Number(size.split('x')[0]);
    const wysokosc = Number(size.split('x')[1]);
    let widthCode;
    if (szerokosc < 100) {
      widthCode = '0' + szerokosc;
    } else {
      widthCode = szerokosc;
    }
    let heightCode;
    if (wysokosc === null || wysokosc === 0) {
      heightCode = '---';
    } else {
      if (wysokosc < 100) {
        heightCode = '0' + wysokosc;
      } else {
        heightCode = wysokosc;
      }
    }
    return firstPart + widthCode + heightCode + '-' + specNumber;
  }
}
