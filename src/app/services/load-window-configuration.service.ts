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

  getWindowToReconfiguration(user: string, formName: string, windowCode: string): Observable<RoofWindowSkylight> {
    const newWindow = new RoofWindowSkylight(
      null, null, null, null, null, null, null, null, 'dwuszybowy', 78,
      118, 'OknoDachowe', null, null, null, null, null, null, null, null, null,
      null, null, null, null, false, 0, [], [], [],
      [], 0, 0, 0, 0, null, null, null, 0, 'PL');

    if (user !== '' || user !== undefined) {
      if (formName === 'no-name' && windowCode === undefined) {
        return of(newWindow);
      }
      if (formName === undefined && windowCode === undefined) {
        return of(newWindow);
      }
      if (formName === 'no-name' && windowCode !== undefined) {
        return this.db.getWindowByCode(windowCode);
      }
      // TODO dodać opcję gdy wklejony zostanie link z konfiguracji zalogowanego użytkownika, a w trakcie wklejania użytkownik jest wylogowany
    }
  }

  getWindowConfigurationByFormName(formName: string) {
    return this.crud.readWindowConfigurationByFormName(formName);
  }
}
