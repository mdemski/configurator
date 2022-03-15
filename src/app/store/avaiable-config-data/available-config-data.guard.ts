import {Injectable} from '@angular/core';
import {CanActivate, UrlTree} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {AvailableConfigDataState} from './available-config-data.state';
import {
  GetAccessoriesAvailableConfigData,
  GetAvailableGlazingsData,
  GetExclusionsForAccessories,
  GetExclusionsForFlashings,
  GetExclusionsForFlatRoofWindows,
  GetExclusionsForRoofWindows,
  GetExclusionsForVerticalWindows,
  GetFlashingsAvailableConfigData,
  GetFlatRoofWindowsAvailableConfigData,
  GetRoofWindowsAvailableConfigData,
  GetVerticalWindowsAvailableConfigData
} from './available-config-data.actions';

@Injectable()
export class AvailableConfigDataGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loadedRoofWindowsOptions;
    let loadedFlashingsOptions;
    let loadedAccessoriesOptions;
    let loadedFlatRoofWindowsOptions;
    let loadedVerticalWindowsOptions;
    let loadedGlazingOptions;
    if (this.store.selectSnapshot(AvailableConfigDataState.configRoofWindows) === null ||
      this.store.selectSnapshot(AvailableConfigDataState.roofWindowsExclusions) === null) {
      this.store.dispatch(new GetRoofWindowsAvailableConfigData());
      this.store.dispatch(new GetExclusionsForRoofWindows());
      loadedRoofWindowsOptions = true;
    } else {
      loadedRoofWindowsOptions = true;
    }
    if (this.store.selectSnapshot(AvailableConfigDataState.configFlashings) === null ||
      this.store.selectSnapshot(AvailableConfigDataState.flashingsExclusions) === null) {
      this.store.dispatch(new GetFlashingsAvailableConfigData());
      this.store.dispatch(new GetExclusionsForFlashings());
      loadedFlashingsOptions = true;
    } else {
      loadedFlashingsOptions = true;
    }
    if (this.store.selectSnapshot(AvailableConfigDataState.configAccessories) === null ||
      this.store.selectSnapshot(AvailableConfigDataState.accessoriesExclusions) === null) {
      this.store.dispatch(new GetAccessoriesAvailableConfigData());
      this.store.dispatch(new GetExclusionsForAccessories());
      loadedAccessoriesOptions = true;
    } else {
      loadedAccessoriesOptions = true;
    }
    if (this.store.selectSnapshot(AvailableConfigDataState.configFlatRoofWindows) === null ||
      this.store.selectSnapshot(AvailableConfigDataState.flatRoofWindowsExclusions) === null) {
      this.store.dispatch(new GetFlatRoofWindowsAvailableConfigData());
      this.store.dispatch(new GetExclusionsForFlatRoofWindows());
      loadedFlatRoofWindowsOptions = true;
    } else {
      loadedFlatRoofWindowsOptions = true;
    }
    if (this.store.selectSnapshot(AvailableConfigDataState.configVerticalWindows) === null ||
      this.store.selectSnapshot(AvailableConfigDataState.verticalWindowsExclusions) === null) {
      this.store.dispatch(new GetVerticalWindowsAvailableConfigData());
      this.store.dispatch(new GetExclusionsForVerticalWindows());
      loadedVerticalWindowsOptions = true;
    } else {
      loadedVerticalWindowsOptions = true;
    }
    if (this.store.selectSnapshot(AvailableConfigDataState.glazingOptions) === null) {
      this.store.dispatch(new GetAvailableGlazingsData());
      loadedGlazingOptions = true;
    } else {
      loadedGlazingOptions = true;
    }
    return loadedRoofWindowsOptions &&
      loadedFlashingsOptions &&
      loadedAccessoriesOptions &&
      loadedFlatRoofWindowsOptions &&
      loadedGlazingOptions &&
      loadedVerticalWindowsOptions;
  }
}
