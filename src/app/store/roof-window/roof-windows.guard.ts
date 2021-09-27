import {Injectable} from '@angular/core';
import {CanActivate, UrlTree} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {RoofWindowState} from './roof-window.state';
import {GetRoofWindows} from './roof-window.actions';

@Injectable()
export class RoofWindowsGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loadedRoofWindows;
    if (this.store.selectSnapshot(RoofWindowState.roofWindows).length === 0) {
      this.store.dispatch(new GetRoofWindows());
      loadedRoofWindows = true;
    } else {
      loadedRoofWindows = true;
    }
    return loadedRoofWindows;
  }
}
