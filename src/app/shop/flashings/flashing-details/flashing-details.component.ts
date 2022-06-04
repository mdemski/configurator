import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../../store/app/app.state';
import {CartState} from '../../../store/cart/cart.state';
import {Flashing} from '../../../models/flashing';
import {filter, map, takeUntil} from 'rxjs/operators';
import {RouterState} from '@ngxs/router-plugin';
import {FlashingState} from '../../../store/flashing/flashing.state';
import {AddProductToCart} from '../../../store/cart/cart.actions';

@Component({
  selector: 'app-flashing-details',
  templateUrl: './flashing-details.component.html',
  styleUrls: ['./flashing-details.component.scss']
})
export class FlashingDetailsComponent implements OnInit, OnDestroy {
  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(CartState) cart$: Observable<any>;
  flashing$: Observable<Flashing>;
  isDestroyed$ = new Subject();
  logInUser: {
    email: string,
    userName: string,
    isLogged: boolean
  };
  picturesOfFlashing = [];
  priceAfterDisc$ = new Subject<number>();
  availableSizes = ['55x78', '55x98', '66x98', '66x118', '66x140', '78x98', '78x118', '78x140', '78x160', '94x118', '94x140', '94x160', '114x118', '114x140', '134x98'];
  quantity = 1;

  constructor(private store: Store) {
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.logInUser = user.currentUser);
    this.store.select(RouterState.state).pipe(takeUntil(this.isDestroyed$)).subscribe(state => {
      this.flashing$ = this.store.select(FlashingState.flashingByCode)
        .pipe(map(filterFn => filterFn(state['params'].flashingId.toString())));
    });
  }

  ngOnInit(): void {
    // TODO wczytać zdjęcia z bazy przypisane do danego indeksu
    this.picturesOfFlashing.push('assets/img/products/U.png');
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe();
  }

  ngOnDestroy() {
    this.isDestroyed$.next(null);
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

  order(product, quantity: number) {
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
    const secondPart = kod.substring(kod.length - 16);
    // const matching = secondPart.split('-')[1];
    const specNumber = secondPart.split('-')[2];
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
