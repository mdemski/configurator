import {Injectable} from '@angular/core';
import {CanActivate, UrlTree} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {AccessoryState} from './accessory.state';
import {GetAccessories} from './accessory.actions';

@Injectable()
export class AccessoriesGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loadedAccessories;
    if (this.store.selectSnapshot(AccessoryState.accessories).length === 0) {
      this.store.dispatch(new GetAccessories());
      loadedAccessories = true;
    } else {
      loadedAccessories = true;
    }
    return loadedAccessories;
  }
}
