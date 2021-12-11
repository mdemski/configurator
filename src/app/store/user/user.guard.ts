import {CanActivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {UserState} from './user.state';
import {AppState} from '../app/app.state';
import {map} from 'rxjs/operators';
import {GetUserData} from './user.actions';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private store: Store) {
  }

  @Select(AppState) user$: Observable<{ currentUser }>;

  canActivate() {
    if (this.store.selectSnapshot(UserState.user).userName === '') {
      this.user$.pipe(map(user => {
        this.store.dispatch(new GetUserData(user.currentUser.email));
      })).subscribe();
      return true;
    } else {
      return true;
    }
  }
}