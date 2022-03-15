import {Injectable} from '@angular/core';
import {CanActivate, UrlTree} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {SkylightState} from './skylight.state';
import {GetSkylights} from './skylight.actions';

@Injectable()
export class SkylightsGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loadedSkylights;
    if (this.store.selectSnapshot(SkylightState.skylights).length === 0) {
      this.store.dispatch(new GetSkylights());
      loadedSkylights = true;
    } else {
      loadedSkylights = true;
    }
    return loadedSkylights;
  }
}
