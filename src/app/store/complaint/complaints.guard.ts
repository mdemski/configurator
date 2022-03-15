import {CanActivate, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {ComplaintState} from './complaint.state';
import {GetComplaintsForUser} from './complaint.actions';
import {AppState} from '../app/app.state';
import {map} from 'rxjs/operators';

@Injectable()
export class ComplaintsGuard implements CanActivate {
  constructor(private store: Store) {
  }

  @Select(AppState) user$: Observable<{ currentUser }>;

  canActivate():
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loadedComplaints;
    if (this.store.selectSnapshot(ComplaintState).length === 0) {
      this.user$.pipe(map(user => {
        this.store.dispatch(new GetComplaintsForUser(user.currentUser.email));
      })).subscribe();
      loadedComplaints = true;
    } else {
      loadedComplaints = true;
    }
    return loadedComplaints;
  }

}
