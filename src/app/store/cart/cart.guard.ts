import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Store} from '@ngxs/store';
import {CartState} from './cart.state';
import {GetCart} from './cart.actions';

@Injectable()
export class CartGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate() {
    if (!this.store.selectSnapshot(CartState.cart)) {
      this.store.dispatch(new GetCart());
      return true;
    } else {
      return true;
    }
  }
}
