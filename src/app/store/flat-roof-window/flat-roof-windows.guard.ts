import {Injectable} from '@angular/core';
import {CanActivate, UrlTree} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {FlatRoofWindowState} from './flat-roof-window.state';
import {GetFlatRoofWindows} from './flat-roof-window.actions';

@Injectable()
export class FlatRoofWindowsGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loadedFlatRoofWindows;
    if (this.store.selectSnapshot(FlatRoofWindowState.flats).length === 0) {
      this.store.dispatch(new GetFlatRoofWindows());
      loadedFlatRoofWindows = true;
    } else {
      loadedFlatRoofWindows = true;
    }
    return loadedFlatRoofWindows;
  }
}
