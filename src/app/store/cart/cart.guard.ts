import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {CartState} from './cart.state';
import {GetCart} from './cart.actions';

@Injectable()
export class CartGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('Test');
    if (!this.store.selectSnapshot(CartState.cart)) {
      this.store.dispatch(new GetCart());
      return true;
    } else {
      return true;
    }
  }
}
