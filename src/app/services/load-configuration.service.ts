import {Injectable} from '@angular/core';
import {CrudService} from './crud-service';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Observable, of} from 'rxjs';
import {DatabaseService} from './database.service';
import {Flashing} from '../models/flashing';
import {map} from 'rxjs/operators';
import {Accessory} from '../models/accessory';
import {RoofWindowState} from '../store/roof-window/roof-window.state';
import {Store} from '@ngxs/store';
import {FlashingState} from '../store/flashing/flashing.state';
import {AccessoryState} from '../store/accessory/accessory.state';
import {FlatRoofWindow} from '../models/flat-roof-window';
import {FlatRoofWindowState} from '../store/flat-roof-window/flat-roof-window.state';

@Injectable({
  providedIn: 'root'
})
export class LoadConfigurationService {

  newWindow = new RoofWindowSkylight(
    null, null, null, 'I-OKNO', 'NPL-OKNO', null, null, null, 'dwuszybowy', 78,
    118, 'OknoDachowe', null, null, null, null, 'NawiewnikNeoVent', null, null, null, null,
    null, null, null, null, false, 0, [], [], [],
    [], 0, 0, 0, 0, null, null, null, 0, 'PL');

  newFlashing = new Flashing(null, null, null, 'I-KOŁNIERZ', 'NPL-KOŁNIERZ', '1.Nowy', null,
    78, 118, 'KołnierzUszczelniający', null, null, null, null, null, null, null,
    null, 0, null, 0, 0, 0, 0,
    [], [], null, false, null, []);

  // TODO Sprawdzić jaka jest grupa asortymentowa dla rolet wewnętrznych
  newAccessory = new Accessory(null, null, null, 'I-ROLETAW', 'NPL-ROLETAW', '1. Nowy', null, 78, 118, 'Akcesorium',
    null, null, null, null, null, null, null, null, null, null, null, null, null, 0,
    'manualne', null, 0, [], [], null, '');

  newFlatRoofWindow = new FlatRoofWindow(null, null, null, 'I-PŁASKI', 'NPL-OKNO', null, null, null, 'A01', 100, 100, 'DachPłaski', 'DachPłaski:Okno', 'PG', null, null, 'PVC',
    null, null, null, null, null, null, null, 0, [], [], [], [], 0, null, null, 0, null, null, null, null);

  constructor(private crud: CrudService,
              private db: DatabaseService,
              private store: Store) {
  }

  getWindowToReconfiguration(user: string, formName: string, windowCode: string): Observable<RoofWindowSkylight> {
    if (user !== '' || user !== undefined) {
      if (formName === 'no-name' && windowCode === undefined) {
        return of(this.newWindow);
      }
      if (formName === 'no-name' && windowCode === '-1') {
        return of(this.newWindow);
      }
      if (formName === undefined && windowCode === undefined) {
        return of(this.newWindow);
      }
      if (formName === 'no-name' && windowCode !== undefined) {
        return this.store.select(RoofWindowState.roofWindowByCode)
          .pipe(map(filterFn => filterFn(windowCode)));
      }
      // tslint:disable-next-line:max-line-length
      // TODO dodać opcję gdy wklejony zostanie link z konfiguracji zalogowanego użytkownika, a w trakcie wklejania użytkownik jest wylogowany
    }
  }

  getFlashingToReconfiguration(user: string, formName: string, flashingCode: string): Observable<Flashing> {
    if (user !== '' || user !== undefined) {
      if (formName === 'no-name' && flashingCode === undefined) {
        return of(this.newFlashing);
      }
      if (formName === 'no-name' && flashingCode === '-1') {
        return of(this.newFlashing);
      }
      if (formName === undefined && flashingCode === undefined) {
        return of(this.newFlashing);
      }
      if (formName === 'no-name' && flashingCode !== undefined) {
        return this.store.select(FlashingState.flashingByCode).pipe(
          map(filterFn => filterFn(flashingCode)));
      }
    }
  }

  getAccessoryToReconfiguration(user: string, formName: string, accessoryCode: string): Observable<Accessory> {
    if (user !== '' || user !== undefined) {
      if (formName === 'no-name' && accessoryCode === undefined) {
        return of(this.newAccessory);
      }
      if (formName === 'no-name' && accessoryCode === '-1') {
        return of(this.newAccessory);
      }
      if (formName === undefined && accessoryCode === undefined) {
        return of(this.newAccessory);
      }
      if (formName === 'no-name' && accessoryCode !== undefined) {
        return this.store.select(AccessoryState.accessoryByCode).pipe(
          map(filterFn => filterFn(accessoryCode)));
      }
    }
  }

  getFlarRoofWindowToReconfiguration(user: string, formName: string, flatRoofWindowCode: string): Observable<FlatRoofWindow> {
    if (user !== '' || user !== undefined) {
      if (formName === 'no-name' && flatRoofWindowCode === undefined) {
        return of(this.newFlatRoofWindow);
      }
      if (formName === 'no-name' && flatRoofWindowCode === '-1') {
        return of(this.newFlatRoofWindow);
      }
      if (formName === undefined && flatRoofWindowCode === undefined) {
        return of(this.newFlatRoofWindow);
      }
      if (formName === 'no-name' && flatRoofWindowCode !== undefined) {
        return this.store.select(FlatRoofWindowState.flatByCode)
          .pipe(map(filterFn => filterFn(flatRoofWindowCode)));
      }
      // tslint:disable-next-line:max-line-length
      // TODO dodać opcję gdy wklejony zostanie link z konfiguracji zalogowanego użytkownika, a w trakcie wklejania użytkownik jest wylogowany
    }
  }
}
