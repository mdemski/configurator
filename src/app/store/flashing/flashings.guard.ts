import {Injectable} from '@angular/core';
import {CanActivate, UrlTree} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {FlashingState} from './flashing.state';
import {GetFlashings} from './flashing.actions';

@Injectable()
export class FlashingsGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loadedFlashings;
    if (this.store.selectSnapshot(FlashingState.flashings).length === 0) {
      this.store.dispatch(new GetFlashings());
      loadedFlashings = true;
    } else {
      loadedFlashings = true;
    }
    return loadedFlashings;
  }
}
