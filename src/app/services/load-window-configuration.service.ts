import {Injectable} from '@angular/core';
import {CrudFirebaseService} from './crud-firebase-service';
import {map} from 'rxjs/operators';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Observable, of} from 'rxjs';
import {DatabaseService} from './database.service';

@Injectable({
  providedIn: 'root'
})
export class LoadWindowConfigurationService {

  constructor(private crud: CrudFirebaseService,
              private db: DatabaseService) {
  }

  getWindowToReconfiguration(user: string, configId: number, windowId: number, windowCode: string): Observable<RoofWindowSkylight> {
    // console.log(configId); // gdy puste to undefined
    // console.log(windowId); // gdy puste to undefined
    // console.log(windowCode); // gdy puste to undefined
    const newWindow = new RoofWindowSkylight(
      null, null, null, null, null, null, null, null, 'dwuszybowy', 78,
      118, 'OknoDachowe', null, null, null, null, 'NawiewnikNeoVent', null, null, null, null,
      null, null, null, null, false, 0, [], [], [],
      [], 0, 0, 0, 0, null, null, null, 0, 'PL');

    if (user !== '' || user !== undefined) {
      if (configId === undefined && windowId === undefined && windowCode === undefined) {
        return of(newWindow);
      }
      configId = parseInt(String(configId), 10);
      windowId = parseInt(String(windowId), 10);
      // przypadek 1 i 3
      if (windowId === -1 && windowCode === undefined) {
        return of(newWindow);
      }
      // przypadek 5
      if (windowId !== -1 && configId !== -1) {
        return this.crud.readWindowByIdFromConfigurationById(user, configId, windowId).pipe(map(window => {
          return new RoofWindowSkylight(window.window._kod, window.window._nazwaPozycjiPL, window.window._windowName,
            window.window._indeksAlgorytm, window.window._nazwaPLAlgorytm, window.window._status, window.window._model,
            window.window._pakietSzybowy, window.window._glazingToCalculation, window.window._szerokosc, window.window._wysokosc,
            window.window._grupaAsortymentowa, window.window._typ, window.window._geometria, window.window._rodzaj,
            window.window._otwieranie, window.window._wentylacja, window.window._stolarkaMaterial, window.window._stolarkaKolor,
            window.window._rodzina, window.window._oblachowanieMaterial, window.window._oblachowanieKolor,
            window.window._oblachowanieFinisz, window.window._zamkniecieTyp, window.window._zamkniecieKolor,
            window.window._windowHardware, window.window._uszczelki, window.window._dostepneRozmiary, window.window._windowCoats,
            window.window._linkiDoZdjec, window.window._listaDodatkow, window.window._CenaDetaliczna, window.window._windowUW,
            window.window._windowUG, window.window._iloscSprzedanychRok, window.window._kolorTworzywWew, window.window._kolorTworzywZew,
            window.window._okucia, window.window._numberOfGlasses, window.window._cennik);
        }));
      }
      // przypadek 2 i 4
      if (windowId === -1 && windowCode !== undefined) {
        return this.db.getWindowByCode(windowCode);
      }
    }
  }
}
