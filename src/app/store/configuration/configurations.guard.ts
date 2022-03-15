import {Injectable} from '@angular/core';
import {CanActivate, UrlTree} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {ConfigurationState} from './configuration.state';
import {GetConfigurations} from './configuration.actions';

@Injectable()
export class ConfigurationsGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate():
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loadedConfigurations;
    if (this.store.selectSnapshot(ConfigurationState.configurations).length === 0) {
      this.store.dispatch(new GetConfigurations());
      loadedConfigurations = true;
    } else {
      loadedConfigurations = true;
    }
    return loadedConfigurations;
  }
}
