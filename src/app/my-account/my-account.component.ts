import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Select, Store} from '@ngxs/store';
import {CartState} from '../store/cart/cart.state';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {ShoppingCartService} from '../services/shopping-cart.service';
import exchange from '../../assets/json/echange.json';
import {UpdateCartCurrency} from '../store/cart/cart.actions';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit, OnDestroy {

  @Select(CartState) cart$: Observable<any>;
  currency$ = new BehaviorSubject('PLN');
  currencies: string[] = [];
  isDestroyed$ = new Subject();
  loading = true;
  updatedCurrency: string;

  constructor(private authService: AuthService,
              private store: Store) {
    this.currencies = Object.keys(exchange);
  }

  ngOnInit(): void {
    this.cart$.pipe(filter(cart => cart.cart !== null), takeUntil(this.isDestroyed$)).subscribe((data) => {
      this.currency$.next(data.cart.currency);
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  logout() {
    this.authService.logout();
  }

  updateCurrency(updatedCurrency) {
    this.store.dispatch(new UpdateCartCurrency(updatedCurrency));
  }
}
