import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../../store/app/app.state';
import {Observable, Subject} from 'rxjs';
import {CartState} from '../../../store/cart/cart.state';
import {Accessory} from '../../../models/accessory';
import {filter, map, takeUntil} from 'rxjs/operators';
import {RouterState} from '@ngxs/router-plugin';
import {AccessoryState} from '../../../store/accessory/accessory.state';
import {AddProductToCart} from '../../../store/cart/cart.actions';

@Component({
  selector: 'app-accessories-details',
  templateUrl: './accessories-details.component.html',
  styleUrls: ['./accessories-details.component.scss']
})
export class AccessoriesDetailsComponent implements OnInit, OnDestroy {
  @Select(AppState) user$: Observable<{ currentUser }>;
  @Select(CartState) cart$: Observable<any>;
  accessory$: Observable<Accessory>;
  logInUser: {
    email: string,
    userName: string,
    isLogged: boolean
  };
  routerData;
  isDestroyed$ = new Subject();
  picturesOfAccessory = [];
  priceAfterDisc$ = new Subject<number>();
  availableSizes = ['55x78', '55x98', '66x98', '66x118', '66x140', '78x98', '78x118', '78x140', '78x160', '94x118', '94x140', '94x160', '114x118', '114x140', '134x98'];
  quantity = 1;

  constructor(private store: Store) {
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.logInUser = user.currentUser);
    this.store.select(RouterState.state).pipe(takeUntil(this.isDestroyed$)).subscribe(state => {
      this.accessory$ = this.store.select(AccessoryState.accessoryByCode)
        .pipe(map(filterFn => filterFn(state['params'].accessoryId.toString())));
    });
  }

  ngOnInit(): void {
    // TODO wczytać zdjęcia z bazy przypisane do danego indeksu
    this.picturesOfAccessory.push('assets/img/products/ISO-arrangement-1.png');
    this.picturesOfAccessory.push('assets/img/products/ISO-V-D37.png');
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe();
  }

  ngOnDestroy() {
    this.isDestroyed$.next(null);
  }

  // private getDiscountPrice() {
  //   if (this.logInUser.isLogged) {
  //     return this.store.dispatch(new GetUserData(this.logInUser.email, this.logInUser.isLogged)).pipe(takeUntil(this.isDestroyed$))
  //       .subscribe(({user}) => {
  //         this.priceAfterDisc$.next(); // To trzeba zrobić w template przy wyświetlaniu
  //       });
  //   }
  // }

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
}
