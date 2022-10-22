import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../../store/app/app.state';
import {Observable, Subject} from 'rxjs';
import {CartState} from '../../../store/cart/cart.state';
import {FlatRoofWindow} from '../../../models/flat-roof-window';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import {RouterState} from '@ngxs/router-plugin';
import {FlatRoofWindowState} from '../../../store/flat-roof-window/flat-roof-window.state';
import {AddProductToCart} from '../../../store/cart/cart.actions';
import {Router} from '@angular/router';
import {GetUserData} from '../../../store/user/user.actions';
import {UserState, UserStateModel} from '../../../store/user/user.state';
import {AccessoryState} from '../../../store/accessory/accessory.state';
import {GetAccessories} from '../../../store/accessory/accessory.actions';

@Component({
  selector: 'app-flat-roof-window-details',
  templateUrl: './flat-roof-window-details.component.html',
  styleUrls: ['./flat-roof-window-details.component.scss']
})
export class FlatRoofWindowDetailsComponent implements OnInit, OnDestroy {

  isDestroyed$ = new Subject();
  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(CartState) cart$: Observable<any>;
  @Select(UserState) userState$: Observable<UserStateModel>;
  @Select(AccessoryState) accessories$: Observable<any>;
  flatRoofWindow$: Observable<FlatRoofWindow>;
  logInUser: {
    email: string;
    userName: string;
    isLogged: boolean
  };
  picturesOfWindow = [];
  availableSizes = ['60x60', '90x60', '120x60', '70x70', '80x80', '90x90', '120x90', '100x100', '150x100', '120x120', '140x140', '220x120'];
  quantity = 1;

  constructor(private store: Store, public router: Router) {
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.logInUser = user.currentUser);
    this.store.select(RouterState.state).pipe(takeUntil(this.isDestroyed$)).subscribe(state => {
      this.flatRoofWindow$ = this.store.select(FlatRoofWindowState.flatByCode)
        .pipe(map(filterFn => filterFn(state['params'].flatId.toString())));
    });
  }

  ngOnInit(): void {
    // TODO wczytać zdjęcia z bazy przypisane do danego indeksu
    this.picturesOfWindow.push('assets/img/products/PGX_LED.png');
    this.picturesOfWindow.push('assets/img/products/PG-arrangement-1.png');
    this.picturesOfWindow.push('assets/img/products/PG-arrangement-2.png');
    this.loadUserState();
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe();
    this.accessories$.pipe(takeUntil(this.isDestroyed$),
      tap(accessoryState => {
        if (accessoryState.accessories.length === 0) {
          this.store.dispatch(new GetAccessories());
        }
      })).subscribe();
  }

  ngOnDestroy() {
    this.isDestroyed$.next(null);
  }

  loadUserState() {
    if (this.logInUser.isLogged) {
      this.userState$.pipe(takeUntil(this.isDestroyed$),
        tap(user => {
          if (user._id === '') {
            this.store.dispatch(new GetUserData(this.logInUser.email, this.logInUser.isLogged));
          }
        })).subscribe();
    }
  }

  getExtras(flat: FlatRoofWindow) {
    const extras = [];
    this.accessories$.pipe(takeUntil(this.isDestroyed$)).subscribe(accessoryState => {
      for (const windowAccessory of flat.listaDodatkow) {
        for (const accessory of accessoryState.accessories) {
          if (windowAccessory === accessory.kod) {
            extras.push(accessory);
          }
        }
      }
    });
    return extras;
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
