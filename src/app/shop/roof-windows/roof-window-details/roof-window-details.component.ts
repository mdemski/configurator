import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoofWindowSkylight} from '../../../models/roof-window-skylight';
import {Accessory} from '../../../models/accessory';
import {Select, Store} from '@ngxs/store';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {RouterState} from '@ngxs/router-plugin';
import {RoofWindowState} from '../../../store/roof-window/roof-window.state';
import {AppState} from '../../../store/app/app.state';
import {CrudService} from '../../../services/crud-service';
import {AddProductToCart} from '../../../store/cart/cart.actions';
import {CartState} from '../../../store/cart/cart.state';

@Component({
  selector: 'app-roof-window-details',
  templateUrl: './roof-window-details.component.html',
  styleUrls: ['./roof-window-details.component.scss']
})
export class RoofWindowDetailsComponent implements OnInit, OnDestroy {
  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(CartState) cart$: Observable<any>;
  window$: Observable<RoofWindowSkylight>;
  logInUser: {
    email: string;
    userName: string;
    isLogged: boolean
  };
  routerData;
  windowToShow: RoofWindowSkylight;
  isDestroyed$ = new Subject();
  picturesOfWindow = [];
  windowMaterial: string;
  windowVent: string;
  windowHandle: string;
  priceAfterDisc$ = new Subject<number>();
  glazing: string;
  availableSizes = ['55x78', '55x98', '66x98', '66x118', '66x140', '78x98', '78x118', '78x140', '78x160', '94x118', '94x140', '94x160', '114x118', '114x140', '134x98'];
  quantity = 1;
  availableExtras: Accessory[] = [];

  constructor(private store: Store, private crud: CrudService) {
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.logInUser = user.currentUser);
    this.store.select(RouterState.state).pipe(takeUntil(this.isDestroyed$)).subscribe(state => {
      this.window$ = this.store.select(RoofWindowState.roofWindowByCode)
        .pipe(map(filterFn => filterFn(state['params'].windowId.toString())));
    });
  }

  ngOnInit(): void {
    this.window$.pipe(takeUntil(this.isDestroyed$)).subscribe(window => {
      this.windowToShow = window;
      this.windowMaterial = window.stolarkaMaterial;
      this.windowVent = window.wentylacja;
      this.windowHandle = window.zamkniecieTyp;
      // TODO odkomentować po wczytaniu danych z eNova i zakomnetować kolejną linię
      // this.glazing = window.pakietSzybowy.split(':')[1];
      this.glazing = window.pakietSzybowy;
    });
    // TODO wczytać zdjęcia z bazy przypisane do danego indeksu
    this.picturesOfWindow.push('assets/img/products/ISO-I22.png');
    this.picturesOfWindow.push('assets/img/products/ISO-arrangement-1.png');
    this.picturesOfWindow.push('assets/img/products/ISO-arrangement-2.png');
    this.getDiscountPrice();
    // TODO napisać obsługę tej metody z wykorzystaniem store'a
    // this.availableExtras.push(this.db.getAccessoryById(1), this.db.getAccessoryById(2));
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe(() => console.log);
    // TODO wczytywać to z produktu po uzupełnieniu w eNova
    this.availableExtras.push(new Accessory('1234', 'Roletka', 'Roletka', 'NPL-ROLETAW', 'NEN-ROLETAW', '3. Dopuszczony',
      'D37', 78, 118, 'Akcesorium', 'RoletaWewnetrzna', 'D', 'D37', 'Wewnetrzne', 'A', 'B','Zaciemniająca',
      'A347', 'Srebeny', null, null, null, 'Srebrny', 0, 'manualne', '1234',
      123, ['a'], ['78x118'], 'PL'));
  }

  ngOnDestroy() {
    this.isDestroyed$.next(null);
  }

  getDiscountPrice() {
    if (this.logInUser.isLogged) {
      return this.crud.readUserByEmail(this.logInUser.email).pipe(takeUntil(this.isDestroyed$)).subscribe(user => {
        this.priceAfterDisc$.next(this.windowToShow.CenaDetaliczna / (1 + user.basicDiscount + user.roofWindowsDiscount));
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
