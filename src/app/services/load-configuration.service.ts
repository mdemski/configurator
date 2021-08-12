import {Injectable} from '@angular/core';
import {CrudFirebaseService} from './crud-firebase-service';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {DatabaseService} from './database.service';
import {Flashing} from '../models/flashing';
import {map} from 'rxjs/operators';
import {Accessory} from '../models/accessory';

@Injectable({
  providedIn: 'root'
})
export class LoadConfigurationService {

  newWindow = new RoofWindowSkylight(
    null, null, null, null, null, null, null, null, 'dwuszybowy', 78,
    118, 'OknoDachowe', null, null, null, null, 'NawiewnikNeoVent', null, null, null, null,
    null, null, null, null, false, 0, [], [], [],
    [], 0, 0, 0, 0, null, null, null, 0, 'PL');
  windowData$: BehaviorSubject<RoofWindowSkylight> = new BehaviorSubject(this.newWindow);

  newFlashing = new Flashing(null, null, null, 'I-KOŁNIERZ', 'NPL-KOŁNIERZ', '1.Nowy', null,
      0, 0, 'KołnierzUszczelniający', null, null, null, null, null, null, null,
      null, 0, null, 0, 0, 0, 0,
      [], [], null, false, null, null);
  flashingData$: BehaviorSubject<Flashing> = new BehaviorSubject(this.newFlashing);

  // TODO Sprawdzić jaka jest grupa asortymentowa dla rolet wewnętrznych
  newAccessory = new Accessory(null, null, null, 'I-ROLETAW', 'NPL-ROLETAW', '1. Nowy', null, 0, 0, 'Akcesorium',
    null, null, null, null, null, null, null, null, null, null, 0,
    'manualne', null, 0, [], [], null);
  accessoryData$: BehaviorSubject<Accessory> = new BehaviorSubject(this.newAccessory);

  constructor(private crud: CrudFirebaseService,
              private db: DatabaseService) {
  }

  getWindowToReconfiguration(user: string, formName: string, windowCode: string): Observable<RoofWindowSkylight> {
    if (user !== '' || user !== undefined) {
      if (formName === 'no-name' && windowCode === undefined) {
        return of(this.newWindow);
      }
      if (formName === undefined && windowCode === undefined) {
        return of(this.newWindow);
      }
      if (formName === 'no-name' && windowCode !== undefined) {
        return this.db.getWindowByCode(windowCode);
      }
      // tslint:disable-next-line:max-line-length
      // TODO dodać opcję gdy wklejony zostanie link z konfiguracji zalogowanego użytkownika, a w trakcie wklejania użytkownik jest wylogowany
    }
  }

  getWindowConfigurationByFormName(formName: string) {
    return this.crud.readConfigurationByFormName(formName);
  }

  getFlashingToReconfiguration(user: string, formName: string, flashingCode: string): Observable<Flashing> {
    if (user !== '' || user !== undefined) {
      if (formName === 'no-name' && flashingCode === undefined) {
        return of(this.newFlashing);
      }
      if (formName === undefined && flashingCode === undefined) {
        return of(this.newFlashing);
      }
      if (formName === 'no-name' && flashingCode !== undefined) {
        return this.db.getFlashingByCode(flashingCode);
      }
    }
  }

  getFlashingToReconfigurationFromWindowData(): Observable<Flashing> {
    return this.windowData$.pipe(map(window => {
      // @ts-ignore
      this.newFlashing.szerokosc = window._szerokosc;
      // @ts-ignore
      this.newFlashing.wysokosc = window._wysokosc;
      // @ts-ignore
      this.newFlashing.oblachowanieMaterial = window._oblachowanieMaterial;
      // @ts-ignore
      this.newFlashing.oblachowanieMaterial = window._oblachowanieMaterial;
      // @ts-ignore
      this.newFlashing.oblachowanieKolor = window._oblachowanieKolor;
      // @ts-ignore
      this.newFlashing.oblachowanieKolor = window._oblachowanieKolor;
      // @ts-ignore
      this.newFlashing.oblachowanieFinisz = window._oblachowanieFinisz;
      // @ts-ignore
      this.newFlashing.oblachowanieFinisz = window._oblachowanieFinisz;
      return this.newFlashing;
    }));
  }

  getFlashingConfigurationByFormName(formName: string) {
    return this.crud.readConfigurationByFormName(formName);
  }

  getAccessoryToReconfiguration() {

  }

  getAccessoryToReconfigurationFromWindowData() {
    return this.windowData$.pipe(map(window => {
      // @ts-ignore
      this.newAccessory.szerokosc = window._szerokosc;
      // @ts-ignore
      this.newAccessory.wysokosc = window._wysokosc;
      return this.newAccessory;
    }));
  }

  getAccessoryConfigurationByFormName(formName: string) {
    return this.crud.readConfigurationByFormName(formName);
  }

  getVerticalConfigurationByFormName(formName: string) {
    return this.crud.readConfigurationByFormName(formName);
  }

  getFlatConfigurationByFormName(formName: string) {
    return this.crud.readConfigurationByFormName(formName);
  }

}
